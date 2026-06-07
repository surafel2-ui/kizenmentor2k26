import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Shield, AlertCircle, Info, BookOpen } from 'lucide-react';
import ThreeDBinder from './components/ThreeDBinder';
import AdminPanel from './components/AdminPanel';
import Guestbook from './components/Guestbook';
import FullScreenLightbox from './components/FullScreenLightbox';
import { Photo, GuestMessage, AdminSession } from './types';

// Client-side local fallback state in case server restarts or does not load instantly
const PRELOADED_PHOTOS: Photo[] = [];

const PRELOADED_MESSAGES: GuestMessage[] = [];

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>(PRELOADED_PHOTOS);
  const [messages, setMessages] = useState<GuestMessage[]>(PRELOADED_MESSAGES);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [activeTab, setActiveTab] = useState<'cover' | 'photos' | 'guestbook' | 'admin'>('cover');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPhotoForLightbox, setSelectedPhotoForLightbox] = useState<Photo | null>(null);
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(() => {
    try {
      const saved = sessionStorage.getItem('yearbook_liked_photos');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });
  
  // Load data from Express API
  const loadData = async () => {
    try {
      const response = await fetch('/api/data');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos || []);
        setMessages(data.messages || []);
      } else {
        setErrorMessage('Unable to connect with full-stack storage. Switched to offline memory sandbox.');
      }
    } catch (e) {
      console.warn('API connection failed, running on persistent cache memory: ', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-update feed every 30 seconds for live updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle Login
  const handleLogin = (session: AdminSession) => {
    setAdminSession(session);
    setActiveTab('admin');
  };

  // Handle Logout
  const handleLogout = () => {
    setAdminSession(null);
    setActiveTab('photos');
  };

  // Publish Photo
  const handlePublishPhoto = async (photoData: {
    url: string;
    caption: string;
    studentNames: string;
    uploadedBy: 'Teferi' | 'Sinen';
    tags: string[];
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoData)
      });
      if (response.ok) {
        const resData = await response.json();
        // Reload photos feed
        await loadData();
        
        // Auto-open this published photo in full screen lightbox!
        if (resData.success && resData.photo) {
          setSelectedPhotoForLightbox(resData.photo);
          setActiveTab('photos');
        }
        return true;
      }
    } catch (e) {
      console.error('Failed to publish photo on backend:', e);
    }

    // Client-side local sandbox state fallback
    const mockNewPhoto: Photo = {
      id: 'photo_mock_' + Date.now(),
      url: photoData.url,
      caption: photoData.caption,
      studentNames: photoData.studentNames,
      uploadedBy: photoData.uploadedBy,
      timestamp: new Date().toISOString(),
      tags: photoData.tags,
      likes: 0
    };
    setPhotos(prev => [mockNewPhoto, ...prev]);
    setSelectedPhotoForLightbox(mockNewPhoto);
    setActiveTab('photos');
    return true;
  };

  // Delete Photo
  const handleDeletePhoto = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await loadData();
      } else {
        // Fallback local filter
        setPhotos(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      setPhotos(prev => prev.filter(p => p.id !== id));
    }
  };

  // Like Photo
  const handleLikePhoto = async (id: string) => {
    if (likedPhotoIds.has(id)) {
      return; // Already liked in this session
    }

    const updated = new Set(likedPhotoIds);
    updated.add(id);
    setLikedPhotoIds(updated);
    try {
      sessionStorage.setItem('yearbook_liked_photos', JSON.stringify(Array.from(updated)));
    } catch (e) {
      console.warn('Failed saving liked photo state: ', e);
    }

    try {
      const response = await fetch(`/api/photos/${id}/like`, { method: 'POST' });
      if (response.ok) {
        const resData = await response.json();
        setPhotos(prev =>
          prev.map(p => (p.id === id ? { ...p, likes: resData.likes } : p))
        );
      } else {
        // Fallback local increment
        setPhotos(prev =>
          prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
        );
      }
    } catch (e) {
      setPhotos(prev =>
        prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
      );
    }
  };

  // Add guestbook message
  const handleAddMessage = async (msgData: { name: string; content: string; role: string }): Promise<boolean> => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      if (response.ok) {
        await loadData();
        return true;
      }
    } catch (e) {
      console.error('Failed to post message on backend API:', e);
    }

    // Fallback sandbox state logic
    const mockMsg: GuestMessage = {
      id: 'msg_mock_' + Date.now(),
      name: msgData.name,
      content: msgData.content,
      timestamp: new Date().toISOString(),
      role: msgData.role
    };
    setMessages(prev => [mockMsg, ...prev]);
    return true;
  };

  // Delete guestbook message (Only admins)
  const handleDeleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await loadData();
      } else {
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#240306] text-[#FEE9BD] flex flex-col font-sans relative overflow-x-hidden selection:bg-gold-500 selection:text-maroon-950">
      
      {/* Tiny subtle background stars for ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(156,27,39,0.15),transparent_80%)] pointer-events-none" />

      {/* Floating Sparkles and particles overlay */}
      <div className="absolute inset-0 pointer-events-none" id="sparkles-container">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold-400"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.6, 0.1]
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 8 + 6,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Primary header area of the application container */}
      <header className="w-full text-center py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4"
          id="app-header-container"
        >
          <div className="flex justify-center items-center gap-1 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 w-fit mx-auto mb-4 backdrop-blur shadow-sm">
            <span className="text-[10.5px] uppercase font-bold tracking-[0.25em] text-gold-300">
              Honoring Mentor Academy Graduates
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-[42px] tracking-[0.14em] uppercase text-gold-200 mt-2 leading-tight drop-shadow">
            KAIZEN 2026
          </h1>
          <p className="mt-1 font-serif italic text-sm sm:text-base text-slate-350 drop-shadow">
            &quot;binder , photo and graduation records&quot;
          </p>

          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-4" />
        </motion.div>
      </header>

      {/* Main Core Stage Area */}
      <main className="flex-1 container mx-auto px-4 py-3 z-10 flex flex-col items-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-10 w-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-display text-gold-400 text-sm tracking-widest uppercase">
              Opening the 2026 Memorial Binder...
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* Server connection error warning badge (graceful) */}
            {errorMessage && (
              <div className="mx-auto max-w-lg mb-6 flex items-center gap-2.5 rounded-xl bg-orange-950/40 p-3 text-xs text-orange-200 border border-orange-500/20 backdrop-blur-sm shadow-md animate-fadeIn">
                <Info className="h-4.5 w-4.5 text-orange-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

             {/* Inner Interactive Binder Page containing 3D simulation cover and flippable ledger layers */}
            <ThreeDBinder
              photos={photos}
              messages={messages}
              isAdmin={!!adminSession}
              onDeletePhoto={handleDeletePhoto}
              onLikePhoto={handleLikePhoto}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onPreviewPhoto={setSelectedPhotoForLightbox}
              likedPhotoIds={likedPhotoIds}
              renderAdminPanel={() => (
                <AdminPanel
                  currentSession={adminSession}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  onPublish={handlePublishPhoto}
                  publishedPhotos={photos}
                  onDeletePhoto={handleDeletePhoto}
                />
              )}
              renderGuestbook={() => (
                <Guestbook
                  messages={messages}
                  onAddMessage={handleAddMessage}
                  isAdmin={!!adminSession}
                  onDeleteMessage={handleDeleteMessage}
                />
              )}
            />

            {/* FULL SCREEN LIGHTBOX INSTANCE */}
            <FullScreenLightbox
              photo={selectedPhotoForLightbox}
              photos={photos}
              onClose={() => setSelectedPhotoForLightbox(null)}
              onLike={handleLikePhoto}
              onDelete={handleDeletePhoto}
              onSelectPhoto={setSelectedPhotoForLightbox}
              likedPhotoIds={likedPhotoIds}
              isAdmin={!!adminSession}
            />
          </div>
        )}
      </main>

      {/* App Absolute Footer info */}
      <footer className="w-full text-center py-8 text-slate-400 text-xs border-t border-gold-500/5 mt-12 bg-maroon-950/20 backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col items-center gap-3">
          <p className="font-serif italic">
            &quot;May your paths be filled with continuous elevation. Congratulations Class of 2026.&quot;
          </p>
          <p className="text-[10px] font-sans tracking-wide text-slate-500">
            Mentor Academy • Kaizen 2018/2026 Steering Committee
          </p>
        </div>
      </footer>
    </div>
  );
}
