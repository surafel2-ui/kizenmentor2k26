import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable body parsing with elevated limits for base64 photo uploads
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'gallery.json');

// Define Firestore standard error types as mandated by firebase-integration skill
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: false,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error Detailed Output: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase
let db: any = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log('Firebase Firestore database configured successfully:', firebaseConfig.firestoreDatabaseId);
    
    // Asynchronously verify connectivity
    getDocFromServer(doc(db, 'test', 'connection'))
      .then(() => console.log('Firestore connection validation test succeeded.'))
      .catch((err) => {
        if (err instanceof Error && err.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration: client is offline.");
        } else {
          console.warn("Firestore validation test caught standard permission limits (which is normal before data exists):", err.message);
        }
      });
  } else {
    console.warn('firebase-applet-config.json not found. Falling back to local data store.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase SDK:', error);
}

// Low-level helper routines if Firebase fails or is not enabled yet
const DEFAULT_PHOTOS: any[] = [];
const DEFAULT_MESSAGES: any[] = [];

function initDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = {
        photos: DEFAULT_PHOTOS,
        messages: DEFAULT_MESSAGES
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      console.log('Local fallback database initialized.');
    }
  } catch (error) {
    console.error('Error initializing fallback database:', error);
  }
}

initDatabase();

function readLocalData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read local data file, using empty structure:', e);
  }
  return { photos: DEFAULT_PHOTOS, messages: DEFAULT_MESSAGES };
}

function writeLocalData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write local data file:', e);
  }
}

// Unified async getter for photos and messages from Firebase with local fallback
async function getData() {
  if (db) {
    try {
      const photosCol = collection(db, 'photos');
      const messagesCol = collection(db, 'messages');

      const qPhotos = query(photosCol, orderBy('timestamp', 'desc'));
      const qMessages = query(messagesCol, orderBy('timestamp', 'desc'));

      const [photosSnapshot, messagesSnapshot] = await Promise.all([
        getDocs(qPhotos).catch((err) => handleFirestoreError(err, OperationType.LIST, 'photos')),
        getDocs(qMessages).catch((err) => handleFirestoreError(err, OperationType.LIST, 'messages'))
      ]);

      const photos: any[] = [];
      photosSnapshot.forEach((docSnap) => {
        const docData = docSnap.data();
        photos.push({
          ...docData,
          tags: Array.isArray(docData.tags) ? docData.tags : (docData.tags ? String(docData.tags).split(',').map((t: string) => t.trim()) : [])
        });
      });

      const messages: any[] = [];
      messagesSnapshot.forEach((docSnap) => {
        messages.push({ ...docSnap.data() });
      });

      return { photos, messages };
    } catch (e) {
      console.error('Firebase fetching failed, using local database fallback:', e);
      return readLocalData();
    }
  }
  return readLocalData();
}

// REST endpoints
app.get('/api/data', async (req, res) => {
  const data = await getData();
  res.json(data);
});

// Create new photo upload
app.post('/api/photos', async (req, res) => {
  const { url, caption, studentNames, uploadedBy, tags } = req.body;
  if (!url || !uploadedBy) {
    return res.status(400).json({ error: 'Missing required parameters. URL and author signature are required.' });
  }

  const normalizedTags = Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : []);
  
  const newPhoto = {
    id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    url,
    caption: caption ? String(caption).trim() : '',
    studentNames: studentNames ? String(studentNames).trim() : '',
    uploadedBy: uploadedBy === 'Sinen' ? 'Sinen' : 'Teferi',
    timestamp: new Date().toISOString(),
    tags: normalizedTags.filter(Boolean),
    likes: 0
  };

  if (db) {
    try {
      const docRef = doc(db, 'photos', newPhoto.id);
      await setDoc(docRef, newPhoto).catch((err) => handleFirestoreError(err, OperationType.CREATE, `photos/${newPhoto.id}`));
      return res.json({ success: true, photo: newPhoto });
    } catch (e) {
      console.error('Failed to insert photo in Firestore: ', e);
      return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to save photo to cloud database.' });
    }
  }

  const data = readLocalData();
  data.photos.unshift(newPhoto);
  writeLocalData(data);
  res.json({ success: true, photo: newPhoto });
});

// Admin deletes photo
app.delete('/api/photos/:id', async (req, res) => {
  const { id } = req.params;

  if (db) {
    try {
      const docRef = doc(db, 'photos', id);
      await deleteDoc(docRef).catch((err) => handleFirestoreError(err, OperationType.DELETE, `photos/${id}`));
      return res.json({ success: true, message: 'Photo deleted successfully' });
    } catch (e) {
      console.error('Failed to delete photo in Firestore: ', e);
      return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to delete photo from cloud database.' });
    }
  }

  const data = readLocalData();
  const initialCount = data.photos.length;
  data.photos = data.photos.filter((p: any) => p.id !== id);
  
  if (data.photos.length === initialCount) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  writeLocalData(data);
  res.json({ success: true, message: 'Photo deleted successfully' });
});

// Add like to photo
app.post('/api/photos/:id/like', async (req, res) => {
  const { id } = req.params;

  if (db) {
    try {
      const docRef = doc(db, 'photos', id);
      const docSnap = await getDoc(docRef).catch((err) => handleFirestoreError(err, OperationType.GET, `photos/${id}`));
      if (!docSnap.exists()) {
        return res.status(404).json({ error: 'Photo not found' });
      }
      const newLikes = (docSnap.data().likes || 0) + 1;
      await updateDoc(docRef, { likes: newLikes }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `photos/${id}`));
      return res.json({ success: true, likes: newLikes });
    } catch (e) {
      console.error('Failed to increment likes in Firestore: ', e);
      return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to save like update to cloud database.' });
    }
  }

  const data = readLocalData();
  const photo = data.photos.find((p: any) => p.id === id);
  if (photo) {
    photo.likes = (photo.likes || 0) + 1;
    writeLocalData(data);
    return res.json({ success: true, likes: photo.likes });
  }
  res.status(404).json({ error: 'Photo not found' });
});

// Add message to guestbook
app.post('/api/messages', async (req, res) => {
  const { name, content, role } = req.body;
  if (!name || !content) {
    return res.status(400).json({ error: 'Name and content are required' });
  }

  const newMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name,
    content,
    timestamp: new Date().toISOString(),
    role: role || 'Visitor'
  };

  if (db) {
    try {
      const docRef = doc(db, 'messages', newMessage.id);
      await setDoc(docRef, newMessage).catch((err) => handleFirestoreError(err, OperationType.CREATE, `messages/${newMessage.id}`));
      return res.json({ success: true, message: newMessage });
    } catch (e) {
      console.error('Failed to insert message in Firestore: ', e);
      return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to save message to cloud database.' });
    }
  }

  const data = readLocalData();
  data.messages.unshift(newMessage);
  writeLocalData(data);
  res.json({ success: true, message: newMessage });
});

// Delete message helper
app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;

  if (db) {
    try {
      const docRef = doc(db, 'messages', id);
      await deleteDoc(docRef).catch((err) => handleFirestoreError(err, OperationType.DELETE, `messages/${id}`));
      return res.json({ success: true });
    } catch (e) {
      console.error('Failed to delete message in Firestore: ', e);
      return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to delete message from cloud database.' });
    }
  }

  const data = readLocalData();
  data.messages = data.messages.filter((m: any) => m.id !== id);
  writeLocalData(data);
  res.json({ success: true });
});

// Start server
async function boot() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mentor Binder Server running at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  boot();
}

export default app;
