export interface Photo {
  id: string;
  url: string; // Base64 data or preloaded URL
  caption: string;
  studentNames: string;
  uploadedBy: 'Teferi' | 'Sinen';
  timestamp: string;
  tags: string[];
  likes: number;
}

export interface GuestMessage {
  id: string;
  name: string;
  content: string;
  timestamp: string;
  role?: string; // e.g. "Senior", "Teacher", "Parent", "Visitor"
}

export interface AdminSession {
  username: string;
  name: 'Teferi' | 'Sinen';
  loggedIn: boolean;
}

export interface GalleryData {
  photos: Photo[];
  messages: GuestMessage[];
}
