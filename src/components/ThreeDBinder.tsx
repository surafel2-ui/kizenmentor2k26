import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Calendar, Award, MapPin, GraduationCap, ChevronRight, BookOpen, Clock, Heart, Plus } from 'lucide-react';
import CrestLogo from './CrestLogo';
import StepsIllustration from './StepsIllustration';
import CornerOrnament from './CornerOrnament';
import PhotoCard from './PhotoCard';
import { Photo, GuestMessage, AdminSession } from '../types';

interface ThreeDBinderProps {
  photos: Photo[];
  messages: GuestMessage[];
  isAdmin: boolean;
  onDeletePhoto: (id: string) => void;
  onLikePhoto: (id: string) => void;
  activeTab: 'cover' | 'photos' | 'guestbook' | 'admin';
  setActiveTab: (tab: 'cover' | 'photos' | 'guestbook' | 'admin') => void;
  renderAdminPanel: () => React.ReactNode;
  renderGuestbook: () => React.ReactNode;
  onPreviewPhoto?: (photo: Photo) => void;
  likedPhotoIds?: Set<string>;
}

export default function ThreeDBinder({
  photos,
  messages,
  isAdmin,
  onDeletePhoto,
  onLikePhoto,
  activeTab,
  setActiveTab,
  renderAdminPanel,
  renderGuestbook,
  onPreviewPhoto,
  likedPhotoIds
}: ThreeDBinderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 3D Parallax Mouse variables
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax calculations
  const rotateXRaw = useTransform(mouseY, [-300, 300], [12, -12]);
  const rotateYRaw = useTransform(mouseX, [-300, 300], [-15, 15]);

  // Handle smooth spring config for high-end feel
  const springConfig = { damping: 24, stiffness: 120, mass: 0.8 };
  const rotateX = useSpring(rotateXRaw, springConfig);
  const rotateY = useSpring(rotateYRaw, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isOpen) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = e.clientX - rect.left - width / 2;
    const yVal = e.clientY - rect.top - height / 2;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Launch countdown calculator to Collegiate Term Start (e.g. Sept 1, 2026)
  useEffect(() => {
    const targetDate = new Date('2026-09-16T08:00:00Z').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter photo categorizations based on tags list
  const categoriesList = ['ALL', 'CEREMONY', 'CAP THROW', 'SELFIE', 'GABY DAY', 'AWARD CEREMONY'];

  const filteredPhotos = activeCategory === 'ALL'
    ? photos
    : photos.filter(p => p.tags && p.tags.some(t => t.toUpperCase() === activeCategory.toUpperCase()));

  const handleOpenBinderBook = () => {
    setIsOpen(true);
    setActiveTab('photos');
  };

  const handleCloseBinderBook = () => {
    setIsOpen(false);
    setActiveTab('cover');
  };

  // Synchronize book open state when navigation tab is changed of any administrative event
  useEffect(() => {
    if (activeTab !== 'cover' && !isOpen) {
      setIsOpen(true);
    } else if (activeTab === 'cover' && isOpen) {
      setIsOpen(false);
    }
  }, [activeTab, isOpen]);

  return (
    <div className="w-full flex flex-col items-center" id="three-d-binder-root">
      {/* Dynamic Navigation row inside the outer binder wrapper */}
      <div className="w-full max-w-6xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-maroon-900/60 border border-gold-500/20 px-4 md:px-6 py-3.5 rounded-xl backdrop-blur-md shadow-xl text-center sm:text-left" id="binder-nav">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="h-9 w-9 text-gold-500 shrink-0">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow">
              <path d="M50,5 L90,15 L90,85 L50,95 L10,85 L10,15 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="3" />
              <path d="M50,5 L50,95" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <text x="50" y="58" textAnchor="middle" fill="currentColor" className="font-display font-black text-[22px]">26</text>
            </svg>
          </div>
          <div>
            <h1 className="font-display font-black text-xs md:text-sm tracking-[0.2em] text-gold-400">
              KAIZEN MEMORIAL
            </h1>
            <p className="text-[10px] md:text-xs text-slate-300 font-sans tracking-wide">
              Mentor Academy Senior Day Portal
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-3" id="binder-tab-buttons">
          <button
            onClick={handleCloseBinderBook}
            className={`cursor-pointer text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 sm:px-4 py-2 rounded-lg transition-all ${
              !isOpen && activeTab === 'cover'
                ? 'bg-gold-500 text-maroon-950 font-bold'
                : 'text-slate-300 hover:text-gold-200 hover:bg-gold-950/20'
            }`}
          >
            📖 Cover
          </button>
          
          <button
            onClick={() => {
              setIsOpen(true);
              setActiveTab('photos');
            }}
            className={`cursor-pointer text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 sm:px-4 py-2 rounded-lg transition-all ${
              isOpen && activeTab === 'photos'
                ? 'bg-gold-500 text-maroon-950 font-bold'
                : 'text-slate-300 hover:text-gold-200 hover:bg-gold-950/20'
            }`}
          >
            🎓 Photos
          </button>

          <button
            onClick={() => {
              setIsOpen(true);
              setActiveTab('guestbook');
            }}
            className={`cursor-pointer text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 sm:px-4 py-2 rounded-lg transition-all ${
              isOpen && activeTab === 'guestbook'
                ? 'bg-gold-500 text-maroon-950 font-bold'
                : 'text-slate-300 hover:text-gold-200 hover:bg-gold-950/20'
            }`}
          >
            📝 Ledger
          </button>

          <button
            onClick={() => {
              setIsOpen(true);
              setActiveTab('admin');
            }}
            className={`cursor-pointer text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 sm:px-4 py-2 rounded-lg transition-all ${
              isOpen && activeTab === 'admin'
                ? 'bg-gold-500 text-maroon-950 font-bold'
                : 'text-slate-300 hover:text-gold-200 hover:bg-gold-950/20'
            }`}
          >
            🔐 Admin
          </button>
        </div>
      </div>

      {/* Main Perspective stage wrapper */}
      <div className="w-full max-w-6xl flex justify-center py-4 px-2 sm:px-4" style={{ perspective: '1800px' }}>
        
        {/* CLOSED BOOK BINDER - Highly Responsive HTML/CSS Leather Layout */}
        {!isOpen ? (
          <motion.div
            whileHover={{ scale: 1.012 }}
            onClick={handleOpenBinderBook}
            className="cursor-pointer relative w-full max-w-[390px] sm:max-w-[420px] aspect-[1/1.38] rounded-2xl border-4 border-[#705211]/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.92)] transition-shadow duration-300 binder-leather p-5 sm:p-8 flex flex-col justify-between overflow-hidden text-center select-none"
            id="binder-closed-cover"
          >
            {/* Soft inner gold dashed lines */}
            <div className="absolute inset-1.5 sm:inset-2 border border-gold-600/30 rounded-xl pointer-events-none" />
            <div className="absolute inset-3 sm:inset-4 border border-dashed border-gold-500/15 rounded-lg pointer-events-none" />

            {/* Corner Ornaments with responsive CSS scaling */}
            <div className="scale-75 sm:scale-100 origin-top-left absolute top-1 left-1 pointer-events-none">
              <CornerOrnament position="top-left" size={56} />
            </div>
            <div className="scale-75 sm:scale-100 origin-top-right absolute top-1 right-1 pointer-events-none">
              <CornerOrnament position="top-right" size={56} />
            </div>
            <div className="scale-75 sm:scale-100 origin-bottom-left absolute bottom-1 left-1 pointer-events-none">
              <CornerOrnament position="bottom-left" size={56} />
            </div>
            <div className="scale-75 sm:scale-100 origin-bottom-right absolute bottom-1 right-1 pointer-events-none">
              <CornerOrnament position="bottom-right" size={56} />
            </div>

            {/* Front Header: MENTOR ACADEMY - responsive text sizes and alignment */}
            <div className="z-10 pt-2 sm:pt-4">
              <h2 className="font-display font-black text-xs sm:text-[14.5px] tracking-[0.22em] sm:tracking-[0.3em] text-gold-200 uppercase drop-shadow-md">
                MENTOR ACADEMY
              </h2>
            </div>

            {/* School Crest Logo - responsive scaling */}
            <div className="z-10 flex justify-center py-1 sm:py-2">
              <div className="scale-80 sm:scale-100 origin-center">
                <CrestLogo size={135} />
              </div>
            </div>

            {/* Large Gold "KAIZEN" bold header, looking like 3D metallic gold */}
            <div className="z-10 relative flex flex-col">
              <h1 className="font-display font-extrabold text-[#F7E1B7] text-[38px] xs:text-[44px] sm:text-[54px] tracking-[0.12em] sm:tracking-[0.14em] uppercase leading-none drop-shadow-2xl embossed-gold-text">
                KAIZEN
              </h1>
              <div className="text-gold-200 font-serif italic text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] font-medium pt-1.5 opacity-80">
                2018/2026
              </div>
            </div>

            {/* Iconic climbers steps layout - responsive scaling */}
            <div className="z-10 px-2 sm:px-4">
              <div className="scale-85 sm:scale-100 origin-center">
                <StepsIllustration animate={false} />
              </div>
            </div>

            {/* Click Hint footer instruction */}
            <div className="z-10 text-[9.5px] sm:text-[10px] uppercase font-sans text-gold-550 font-bold tracking-[0.15em] sm:tracking-[0.2em] animate-pulse pb-1 sm:pb-2">
              • CLICK COVER TO OPEN BINDER •
            </div>
          </motion.div>
        ) : (
          
          /* OPENED BINDER INTERFACE (Aged Notebook Ledger Spread) */
          <motion.div
            initial={{ opacity: 0, r: -5 }}
            animate={{ opacity: 1, r: 0 }}
            className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[640px] rounded-3xl border border-gold-500/20 bg-[#3b050a]/95 shadow-2xl overflow-hidden shadow-black/80"
            id="binder-opened-spread"
          >
            {/* Left Page (The School Commemorative panel - static but highly stylish stats) */}
            <div className="lg:col-span-12 xl:col-span-4 p-6 md:p-8 border-b xl:border-b-0 xl:border-r border-gold-500/10 flex flex-col justify-between binder-inside-pages text-slate-800 relative shadow-inner">
              
              {/* Corner Ornaments */}
              <CornerOrnament position="top-left" size={44} className="text-gold-700/60" />
              <CornerOrnament position="bottom-left" size={44} className="text-gold-700/60" />

              <div>
                {/* School banner */}
                <div className="text-center pt-3 pb-4">
                  <span className="font-display font-extrabold text-[11px] tracking-[0.22em] text-gold-800 uppercase block">
                    MENTOR ACADEMY
                  </span>
                  <h3 className="font-display font-black text-xl tracking-wider text-maroon-900 uppercase">
                    KAIZEN BOARD
                  </h3>
                  <p className="text-[10px] text-slate-600 font-sans uppercase tracking-[0.15em] font-bold mt-1">
                    Senior Graduation Record
                  </p>
                  <div className="w-16 h-0.5 bg-gold-700 mx-auto mt-2" />
                </div>

                {/* Commencement Countdown clock */}
                <div className="mt-4 bg-maroon-900/[0.04] rounded-2xl border border-gold-700/15 p-4 text-center">
                  <h4 className="font-display font-bold text-[10px] tracking-[0.18em] text-maroon-800 uppercase mb-3 flex items-center justify-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold-700 animate-spin-slow" />
                    University Term Starts In:
                  </h4>
                  <div className="grid grid-cols-4 gap-2 text-center" id="countdown-grid">
                    <div className="bg-white/90 rounded-lg p-2 shadow border border-gold-550/10">
                      <p className="font-display font-black text-lg text-maroon-900 leading-tight">{countdown.days}</p>
                      <p className="text-[8px] text-slate-500 uppercase tracking-widest font-sans font-bold">Days</p>
                    </div>
                    <div className="bg-white/90 rounded-lg p-2 shadow border border-gold-550/10">
                      <p className="font-display font-black text-lg text-maroon-900 leading-tight">{countdown.hours}</p>
                      <p className="text-[8px] text-slate-500 uppercase tracking-widest font-sans font-bold">Hrs</p>
                    </div>
                    <div className="bg-white/90 rounded-lg p-2 shadow border border-gold-550/10">
                      <p className="font-display font-black text-lg text-maroon-900 leading-tight">{countdown.minutes}</p>
                      <p className="text-[8px] text-slate-500 uppercase tracking-widest font-sans font-bold">Min</p>
                    </div>
                    <div className="bg-white/90 rounded-lg p-2 shadow border border-gold-550/10">
                      <p className="font-display font-black text-lg text-maroon-900 leading-tight">{countdown.seconds}</p>
                      <p className="text-[8px] text-slate-500 uppercase tracking-widest font-sans font-bold">Sec</p>
                    </div>
                  </div>
                </div>

                {/* School Stats list */}
                <div className="mt-6 space-y-4">
                  <h5 className="font-display font-bold text-[10px] tracking-[0.15em] text-gold-800 uppercase border-b border-gold-700/10 pb-1.5">
                    Class Profiles
                  </h5>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gold-700/10 text-gold-700 flex items-center justify-center border border-gold-700/20">
                      <GraduationCap className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-sans tracking-wide leading-none uppercase font-bold">Graduating Seniors</p>
                      <p className="font-display font-extrabold text-sm text-maroon-950 mt-1">59 Seniors</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gold-700/10 text-gold-700 flex items-center justify-center border border-gold-700/20">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-sans tracking-wide leading-none uppercase font-bold">Kaizen Motto</p>
                      <p className="font-serif italic text-xs text-maroon-950 mt-1">"continuous improvement"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gold-700/10 text-gold-700 flex items-center justify-center border border-gold-700/20">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-sans tracking-wide leading-none uppercase font-bold">Location</p>
                      <p className="font-display font-extrabold text-sm text-maroon-950 mt-1">legetafo behind 20m</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Binder details footer with manual Close button */}
              <div className="mt-8 border-t border-gold-700/10 pt-4 flex flex-col gap-2">
                <blockquote className="font-serif italic text-[11.5px] text-slate-600 text-center leading-relaxed px-2">
                  "Growing step by step from infancy to graduating scholars"
                </blockquote>
                
                <button
                  onClick={handleCloseBinderBook}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gold-700/30 bg-gold-800/10 py-2.5 text-xs font-bold text-gold-800 uppercase tracking-widest hover:bg-gold-700/20 transition cursor-pointer"
                  id="close-binder-btn"
                >
                  📖 View Front Cover
                </button>
              </div>
            </div>

            {/* Right Page Content Block (Primary Tab Content - Photos, Ledger, or Admin Panels) */}
            <div className="lg:col-span-12 xl:col-span-8 p-6 md:p-8 flex flex-col justify-between relative">
              {/* Background elegant details */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <CrestLogo size={320} />
              </div>

              {/* Actual Tab Displays */}
              <div className="flex-1">
                {activeTab === 'photos' && (
                  <div className="space-y-6" id="opened-photos-gallery">
                    {/* Header bar with photo Categories */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-500/10 pb-4">
                      <div>
                        <h3 className="font-display font-bold text-lg text-gold-300 uppercase tracking-widest flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-gold-500" />
                          Senior Scrapbook ({filteredPhotos.length})
                        </h3>
                        <p className="text-xs text-slate-300 font-sans mt-0.5">
                          Photos published by authorized graduation steering admins
                        </p>
                      </div>

                      {/* Add Picture trigger for Admin helper */}
                      {isAdmin && (
                        <button
                          onClick={() => setActiveTab('admin')}
                          className="inline-flex items-center gap-1 bg-gold-500 text-maroon-950 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition cursor-pointer"
                          id="gallery-add-photo-btn"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Publish Photo</span>
                        </button>
                      )}
                    </div>

                    {/* Filter categories tabs flow */}
                    {categoriesList.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 mt-2" id="gallery-categories-filter">
                        {categoriesList.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`cursor-pointer text-[10.5px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                              activeCategory === cat
                                ? 'bg-gold-500/15 text-gold-200 border-gold-500/70'
                                : 'bg-slate-950/20 text-slate-400 border-slate-800 hover:text-gold-300 hover:border-slate-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Photo Matrix Cards */}
                    {filteredPhotos.length === 0 ? (
                      <div className="text-center py-24 text-slate-400 font-serif italic text-sm border-2 border-dashed border-gold-500/10 rounded-2xl">
                        No pictures listed within category &quot;{activeCategory}&quot;.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4" id="gallery-photo-grid">
                        {filteredPhotos.map((photo) => (
                          <PhotoCard
                            key={photo.id}
                            photo={photo}
                            isAdmin={isAdmin}
                            onDelete={onDeletePhoto}
                            onLike={onLikePhoto}
                            onPreview={onPreviewPhoto}
                            likedPhotoIds={likedPhotoIds}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'guestbook' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-b border-gold-500/10 pb-3 mb-5">
                      <h3 className="font-display font-bold text-lg text-gold-300 uppercase tracking-widest">
                        Memorial Ledger Board
                      </h3>
                      <p className="text-xs text-slate-350 font-sans mt-0.5">
                        Permanent signatures and congratulations greetings for Mentor Academy&apos;s Class of 2026
                      </p>
                    </div>
                    {renderGuestbook()}
                  </div>
                )}

                {activeTab === 'admin' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border-b border-gold-500/10 pb-3 mb-5">
                      <h3 className="font-display font-bold text-lg text-gold-300 uppercase tracking-widest">
                        Steering Administration Office
                      </h3>
                      <p className="text-xs text-slate-350 font-sans mt-0.5">
                        Manage graduation pics, tags, and verify system signatures
                      </p>
                    </div>
                    {renderAdminPanel()}
                  </div>
                )}
              </div>

              {/* opened book folder right footer details */}
              <div className="mt-8 border-t border-gold-500/10 pt-4 flex flex-col md:flex-row md:items-center justify-between text-[11px] font-sans text-slate-400 gap-2">
                <span>Class of 2026 Memorial • Mentor Academy Binder Portal</span>
                <span className="text-gold-500/50">Developed & Reserved KAIZEN © 2026</span>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
