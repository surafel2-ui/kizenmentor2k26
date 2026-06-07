import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, FileUp, AlertCircle, Sparkles, BookOpen, UserCheck, ShieldClose, Trash2, ArrowRight } from 'lucide-react';
import { AdminSession, Photo } from '../types';

interface AdminPanelProps {
  currentSession: AdminSession | null;
  onLogin: (session: AdminSession) => void;
  onLogout: () => void;
  onPublish: (photoData: { url: string; caption: string; studentNames: string; uploadedBy: 'Teferi' | 'Sinen'; tags: string[] }) => Promise<boolean>;
  publishedPhotos: Photo[];
  onDeletePhoto: (id: string) => void;
}

export default function AdminPanel({
  currentSession,
  onLogin,
  onLogout,
  onPublish,
  publishedPhotos,
  onDeletePhoto
}: AdminPanelProps) {
  // Login form state
  const [selectedAdmin, setSelectedAdmin] = useState<'Teferi' | 'Sinen'>('Teferi');
  const [pinCode, setPinCode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Upload/Publish form state
  const [caption, setCaption] = useState('');
  const [studentNames, setStudentNames] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isLivePreview, setIsLivePreview] = useState(false);
  
  // Drag and drop / local file selection state
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Admin PIN codes:
  const ADMIN_CREDS = {
    'Teferi': { pin: '121916', title: 'Committee' },
    'Sinen': { pin: '121916', title: 'Committee' }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const targetCred = ADMIN_CREDS[selectedAdmin];
    if (pinCode === targetCred.pin) {
      // Login success
      onLogin({
        username: selectedAdmin === 'Teferi' ? 'teferi_2026' : 'sinen_2026',
        name: selectedAdmin,
        loggedIn: true
      });
      setPinCode('');
    } else {
      setLoginError('Invalid Administrator PIN Code. Please check the binder register.');
    }
  };

  // Convert uploaded file to base64
  const processFile = (file: File) => {
    setFileError('');
    if (!file.type.startsWith('image/')) {
      setFileError('The selected file is not a valid image. Please select .png or .jpg format.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setFileError('Image is too large. Max size allowed is 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoUrl(e.target.result as string);
        setIsLivePreview(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle Photo Publisher Submission
  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession) return;
    if (!photoUrl) {
      setFileError('Please select a photo file to publish.');
      return;
    }

    setIsSubmitting(true);
    setFileError('');
    setSuccessMsg('');

    const success = await onPublish({
      url: photoUrl,
      caption: caption.trim(),
      studentNames: studentNames.trim(),
      uploadedBy: currentSession.name,
      tags: selectedTags
    });

    setIsSubmitting(false);

    if (success) {
      setSuccessMsg('Graduation memory published on the Class of 2026 Binder cover!');
      setCaption('');
      setStudentNames('');
      setSelectedTags([]);
      setPhotoUrl('');
      setIsLivePreview(false);
      // Wait and clear success message
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      setFileError('Server rejection error. Please check express logs.');
    }
  };

  // Admin filter of photos uploaded by the specific logged in admin to manage easily
  const adminUploadedPhotos = publishedPhotos.filter(p => p.uploadedBy === currentSession?.name);

  return (
    <div className="w-full text-slate-100" id="admin-panel-container">
      <AnimatePresence mode="wait">
        {!currentSession ? (
          // LOGIN FORM
          <motion.div
            key="login-form-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto max-w-md overflow-hidden rounded-2xl border border-gold-500/20 bg-maroon-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-md embossed-border"
          >
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 text-gold-500 border border-gold-400/20">
                <Lock className="h-6 w-6" id="lock-icon" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wider text-gold-400">
                Admin Authentication
              </h3>
              <p className="mt-1 text-xs text-slate-300 font-sans">
                KAIZEN 2018/2026 Yearbook Steering Committee
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300">
                  Select Admin Account
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-3" id="admin-selector">
                  <button
                    type="button"
                    onClick={() => setSelectedAdmin('Teferi')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 ${
                      selectedAdmin === 'Teferi'
                        ? 'border-gold-500 bg-gold-500/15 text-gold-200'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700/60'
                    }`}
                  >
                    <span className="font-display font-bold text-sm tracking-wide">Teferi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAdmin('Sinen')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-300 ${
                      selectedAdmin === 'Sinen'
                        ? 'border-gold-500 bg-gold-500/15 text-gold-200'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700/60'
                    }`}
                  >
                    <span className="font-display font-bold text-sm tracking-wide">Sinen</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300">
                  Admin Passkey PIN
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    maxLength={15}
                    placeholder="Enter Graduation Secret PIN"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full rounded-lg border border-gold-500/15 bg-slate-950/60 py-2.5 pl-3 pr-10 text-center font-mono text-sm tracking-widest text-gold-500 placeholder-slate-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    required
                    id="pin-input"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-950/50 p-3 text-xs text-red-200 border border-red-550/20">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 py-3 text-xs font-bold uppercase tracking-wider text-maroon-950 hover:from-gold-500 hover:to-gold-400 focus:outline-none shadow-md transition-all duration-300 cursor-pointer"
                id="login-submit-btn"
              >
                <span>Access Admin Station</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          // LOGGED IN PUBLISH INTERFACE
          <motion.div
            key="publish-panel"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {/* Form Column */}
            <div className="lg:col-span-12 xl:col-span-7 bg-maroon-950/55 rounded-2xl border border-gold-500/20 p-6 md:p-8 backdrop-blur-md embossed-border">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-500/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-gold-400 uppercase tracking-widest">
                      Admin: {currentSession.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-900/30 transition shadow-inner cursor-pointer"
                  id="admin-logout-btn"
                >
                  <ShieldClose className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Publish Form */}
              <form onSubmit={handlePublishSubmit} className="mt-6 space-y-5">
                <h4 className="font-display font-medium text-sm text-gold-300 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Publish Photo to Binder Cover
                </h4>

                {/* Secure File drag & drop, manual Selection, or Fallback Web Image address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Graduation Picture File (Drag & Drop or Manual Select)
                  </label>
                  
                  {/* Interactive Drag Drop Box config */}
                  <div
                    onClick={triggerFileSelect}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 cursor-pointer ${
                      dragOver
                        ? 'border-gold-400 bg-gold-500/10'
                        : photoUrl
                        ? 'border-gold-500/20 bg-slate-950/50'
                        : 'border-slate-800 bg-slate-950/30 hover:border-gold-500/30 hover:bg-slate-950/50'
                    }`}
                    id="dropzone-area"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {photoUrl && isLivePreview ? (
                      <div className="relative w-full max-w-[280px] aspect-video overflow-hidden rounded-lg border border-gold-500/30 shadow-lg">
                        <img src={photoUrl} className="h-full w-full object-cover" alt="Selected Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-gold-200 uppercase font-bold tracking-widest font-sans">
                            Click / Drop to Replace
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-950/60 text-gold-500 mb-2">
                          <FileUp className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-medium text-slate-200">
                          Drag and drop graduation photo here, or <span className="text-gold-400 underline">browse</span>
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500 font-sans">
                          Supports JPG, PNG formats up to 8MB
                        </p>
                      </>
                    )}
                  </div>


                </div>

                {/* Student names input row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Seniors in Photo
                    </label>
                    <input
                      type="text"
                      placeholder="Aziza jemal (optional)"
                      value={studentNames}
                      onChange={(e) => setStudentNames(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-100 placeholder-slate-550 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  {/* Beautiful Category picker */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Select Tag / Category
                    </label>
                    <div className="mt-2 flex flex-wrap gap-1.5" id="admin-tag-selections">
                      {['CEREMONY', 'CAP THROW', 'SELFIE', 'GABY DAY', 'AWARD CEREMONY'].map((tag) => {
                        const active = selectedTags.includes(tag);
                        return (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => {
                              setSelectedTags(prev => 
                                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                              );
                            }}
                            className={`cursor-pointer text-[9.5px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                              active
                                ? 'bg-gold-500/20 text-gold-300 border-gold-500/80'
                                : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-gold-200'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Caption / Description Box */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Graduation Day Memory Details / Elegant Caption
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the beautiful senior achievement moment. (optional)"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs italic font-serif text-slate-100 placeholder-slate-550 focus:border-gold-500 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Error message */}
                {fileError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-950/50 p-3 text-xs text-red-200 border border-red-550/20">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{fileError}</span>
                  </div>
                )}

                {/* Success Message Banner */}
                {successMsg && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-950/50 p-3 text-xs text-emerald-200 border border-emerald-500/20">
                    <UserCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Publish Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 py-3 text-xs font-bold uppercase tracking-wider text-maroon-950 hover:from-gold-500 hover:to-gold-400 disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-md shadow-black/30"
                  id="publish-photo-btn"
                >
                  <FileUp className="h-4 w-4" />
                  <span>{isSubmitting ? 'Publishing Memory...' : 'Publish to Class Binder'}</span>
                </button>
              </form>
            </div>

            {/* Sidebar Column - Administration logs / quick deletion list */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
              {/* Instructions and Credentials Reminder card */}
              <div className="bg-maroon-950/50 border border-gold-500/15 rounded-2.5xl p-5 md:p-6 backdrop-blur-sm">
                <h4 className="font-display font-semibold text-xs tracking-wider text-gold-400 uppercase flex items-center gap-2 border-b border-gold-500/10 pb-2">
                  <BookOpen className="h-4 w-4" />
                  Steering Committee Protocols
                </h4>
                <ul className="mt-3.5 space-y-2.5 text-[11.5px] text-slate-300 font-sans leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-gold-500 mt-0.5">•</span>
                    <span>Class of 2026 Admin panels operate with high editorial standards. Provide precise labels.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-gold-500 mt-0.5">•</span>
                    <span>Photos are immediately appended as primary features on the interactive yearbook cover pages.</span>
                  </li>

                </ul>
              </div>

              {/* Photos Published by Current Admin Section */}
              <div className="bg-slate-950/40 rounded-2.5xl border border-gold-500/10 p-5 md:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-semibold text-xs tracking-wider text-gold-400 uppercase border-b border-gold-500/10 pb-3">
                    Your Published Photos ({adminUploadedPhotos.length})
                  </h4>

                  {adminUploadedPhotos.length === 0 ? (
                    <div className="mt-8 text-center text-xs text-slate-400 italic py-10 font-sans">
                      No photos uploaded by your administrative credential yet.
                    </div>
                  ) : (
                    <div className="mt-4 max-h-[290px] overflow-y-auto space-y-2.5 pr-2" id="admin-photo-history-list">
                      {adminUploadedPhotos.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 bg-maroon-950/40 p-2.5 rounded-xl border border-gold-900/40"
                        >
                          <img
                            src={item.url}
                            alt="Log item"
                            className="h-11 w-11 object-cover rounded shadow border border-gold-500/10"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-semibold text-[11px] text-gold-300 truncate">
                              {item.studentNames}
                            </p>
                            <p className="font-serif italic text-[10.5px] text-slate-300 truncate leading-tight">
                              "{item.caption}"
                            </p>
                          </div>
                          <button
                            onClick={() => onDeletePhoto(item.id)}
                            className="text-slate-400 hover:text-red-400 p-1.5 hover:bg-slate-900/50 rounded transition"
                            title="Delete memory"
                            id={`delete-history-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-gold-500/10 pt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Steering Admin ID: <strong className="font-mono text-gold-500">{currentSession.username}</strong></span>
                  <span>System: REST active</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
