import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, User, Calendar, Trash2, Tag, BookOpen } from 'lucide-react';
import { Photo } from '../types';

interface PhotoCardProps {
  key?: string;
  photo: Photo;
  isAdmin: boolean;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
  onPreview?: (photo: Photo) => void;
  likedPhotoIds?: Set<string>;
}

export default function PhotoCard({ photo, isAdmin, onDelete, onLike, onPreview, likedPhotoIds }: PhotoCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const isLikedByMe = likedPhotoIds?.has(photo.id) || false;

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLikedByMe) return;
    if (onLike) {
      setIsLiking(true);
      await onLike(photo.id);
      setTimeout(() => setIsLiking(false), 600);
    }
  };

  const formattedDate = new Date(photo.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      layoutId={`photo-card-${photo.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="relative flex flex-col overflow-hidden rounded-xl border border-gold-500/20 bg-maroon-950/70 p-4 shadow-xl backdrop-blur-md hover:border-gold-500/50"
      id={`photo-card-container-${photo.id}`}
    >
      {/* Elegantly simulated gold metal frame corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gold-500/60 rounded-tl mt-1 ml-1" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold-500/60 rounded-tr mt-1 mr-1" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gold-500/60 rounded-bl mb-1 ml-1" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gold-500/60 rounded-br mb-1 mr-1" />

      {/* Keepsake Polaroid Inner Card style - Opened properly with native aspect ratios to maintain crisp high quality */}
      <div 
        onClick={() => onPreview?.(photo)}
        className="group relative flex items-center justify-center h-64 sm:h-72 w-full overflow-hidden rounded border border-maroon-800 bg-black/70 cursor-zoom-in"
      >
        <img
          src={photo.url}
          alt={photo.caption || 'Graduation Photo'}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        
        {/* Author Label (Mr. Carter or Mrs. Evans) - Floating badge of authenticity */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-maroon-950/90 px-3 py-1 text-[10.5px] font-semibold tracking-wider text-gold-300 border border-gold-600/40 shadow-md pointer-events-none">
          <BookOpen className="h-3.5 w-3.5 text-gold-500" />
          <span>Post: {photo.uploadedBy}</span>
        </div>

        {/* Delete Quick Button (Only if authenticated Administrator) */}
        {isAdmin && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(photo.id);
            }}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-950/90 text-red-200 border border-red-800 hover:bg-red-900 transition-all duration-200 shadow-md hover:scale-105 z-10"
            title="Delete this graduation picture"
            id={`delete-btn-${photo.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Picture Meta & Content Block */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {photo.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded bg-gold-950/50 px-2 py-0.5 text-[9.5px] font-medium tracking-wide text-gold-300 border border-gold-800/30"
                >
                  <Tag className="h-2.5 w-2.5 text-gold-500" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Student Names featured in the picture (Optional) */}
          {photo.studentNames && photo.studentNames.trim() && photo.studentNames !== 'Senior Class' && (
            <div className="flex items-start gap-1.5 mt-1 text-gold-200">
              <User className="h-3.5 w-3.5 text-gold-500 mt-1 shrink-0" />
              <span className="font-display font-semibold text-xs tracking-wider line-clamp-2">
                {photo.studentNames}
              </span>
            </div>
          )}

          {/* Description caption (Optional) */}
          {photo.caption && photo.caption.trim() && photo.caption !== 'Class of 2026 Memory' && (
            <p className="mt-2 font-serif text-sm italic leading-relaxed text-slate-100/90 line-clamp-3">
              "{photo.caption}"
            </p>
          )}
        </div>

        {/* Footer Meta Row (Likes & Time Stamp) */}
        <div className="mt-4 flex items-center justify-between border-t border-gold-500/10 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5 text-gold-600" />
            <span>{formattedDate}</span>
          </div>

          <button
            onClick={handleLikeClick}
            disabled={isLikedByMe}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
              isLikedByMe
                ? 'bg-gold-500/25 text-gold-200 border border-gold-500/50 cursor-not-allowed'
                : photo.likes > 0
                ? 'bg-gold-500/10 text-gold-300 border border-gold-500/20 hover:bg-gold-500/20'
                : 'bg-maroon-900/40 text-slate-400 border border-transparent hover:text-gold-300 hover:bg-gold-950/20'
            }`}
            id={`like-btn-${photo.id}`}
            title={isLikedByMe ? "You have already liked this photo in this session" : "Like this photo"}
          >
            <motion.div
              animate={isLiking ? { scale: [1, 1.4, 0.9, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isLikedByMe ? 'fill-gold-400 text-gold-400' : photo.likes > 0 ? 'fill-gold-400/50 text-gold-400' : 'text-slate-400'
                }`}
              />
            </motion.div>
            <span>{photo.likes || 0}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
