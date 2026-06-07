import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquarePlus, Scroll, Calendar, User, Trash2 } from 'lucide-react';
import { GuestMessage } from '../types';

interface GuestbookProps {
  messages: GuestMessage[];
  onAddMessage: (msg: { name: string; content: string; role: string }) => Promise<boolean>;
  isAdmin: boolean;
  onDeleteMessage?: (id: string) => void;
}

export default function Guestbook({
  messages,
  onAddMessage,
  isAdmin,
  onDeleteMessage
}: GuestbookProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setErrorMsg('Please specify your name and leave a congrats message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccess(false);

    const ok = await onAddMessage({
      name: name.trim(),
      content: content.trim(),
      role
    });

    setIsSubmitting(false);

    if (ok) {
      setName('');
      setContent('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setErrorMsg('Failed to post message on binder timeline. Retry.');
    }
  };

  const formattedDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const roleColors: Record<string, string> = {
    'Senior': 'bg-gold-500/10 text-gold-300 border-gold-500/30',
    'Academic Faculty': 'bg-red-500/10 text-red-300 border-red-500/30',
    'Mentor Academy Principal': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    'Parent': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    'Visitor': 'bg-slate-500/10 text-slate-300 border-slate-500/30'
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" id="guestbook-section">
      {/* Signature submission form */}
      <div className="lg:col-span-5 bg-maroon-950/60 rounded-2xl border border-gold-500/20 p-6 md:p-8 backdrop-blur-md embossed-border">
        <h4 className="font-display font-bold text-sm text-gold-400 uppercase tracking-widest flex items-center gap-2 border-b border-gold-500/10 pb-4 mb-5">
          <MessageSquarePlus className="h-4.5 w-4.5" />
          Leave a Signature
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300">
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Aziza jemal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-gold-500 focus:outline-none"
              required
              id="guest-name-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300">
              Academic Roll / Affiliation
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-gold-300 focus:border-gold-500 focus:outline-none"
              id="guest-role-select"
            >
              <option value="Senior">Senior (Class of &apos;26)</option>
              <option value="Academic Faculty">Academic Faculty</option>
              <option value="Parent">Proud Parent</option>
              <option value="Visitor">Visitor / Friend</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300">
              Yearbook Wishes & Thoughts
            </label>
            <textarea
              rows={4}
              placeholder="Leave some words of advice or a happy congratulations note in the KAIZEN binder..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs font-serif text-slate-100 placeholder-slate-550 focus:border-gold-500 focus:outline-none leading-relaxed"
              required
              id="guest-content-textarea"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 font-sans italic bg-red-950/20 p-2.5 rounded border border-red-900/30">
              {errorMsg}
            </div>
          )}

          {success && (
            <div className="text-xs text-emerald-400 font-sans italic bg-emerald-950/20 p-2.5 rounded border border-emerald-900/30">
              Signature logged! Thank you for celebrating Mentor Academy.
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 py-3 text-xs font-bold uppercase tracking-wider text-maroon-950 hover:from-gold-400 hover:to-gold-300 transition-all duration-300 cursor-pointer shadow-md shadow-black/20"
            id="guest-submit-btn"
          >
            <Scroll className="h-4 w-4" />
            <span>{isSubmitting ? 'Logging Signature...' : 'Sign the 2026 Binder'}</span>
          </button>
        </form>
      </div>

      {/* Signature scrolling board */}
      <div className="lg:col-span-7 bg-maroon-950/40 rounded-2xl border border-gold-500/15 p-6 md:p-8 backdrop-blur-sm flex flex-col justify-between">
        <div>
          <h4 className="font-display font-bold text-sm text-gold-400 uppercase tracking-widest flex items-center justify-between border-b border-gold-500/10 pb-4 mb-5">
            <span className="flex items-center gap-2">
              <Scroll className="h-4.5 w-4.5 text-gold-500" />
              Steering Ledger Board
            </span>
            <span className="text-xs font-sans font-medium text-slate-400 italic">
              {messages.length} Signatures logged
            </span>
          </h4>

          {messages.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-serif italic text-sm">
              The ledger board is currently clean. Be the very first to set a milestone!
            </div>
          ) : (
            <div className="max-h-[380px] overflow-y-auto space-y-4 pr-1 scrollbar-thin" id="signatures-ledger-board">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index * 0.1 }}
                    className="relative bg-gold-200/[0.04] p-4 rounded-xl border border-gold-500/10 flex items-start gap-3 shadow hover:border-gold-500/25 transition-all group"
                  >
                    {/* Retro Academic Crest Graphic bullet */}
                    <div className="h-9 w-9 bg-maroon-900/60 flex items-center justify-center rounded-full border border-gold-600/30 text-gold-500 shrink-0 font-display font-black text-xs">
                      {msg.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-display font-extrabold text-xs tracking-wider text-gold-300">
                            {msg.name}
                          </h5>
                          <span className={`inline-block text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${roleColors[msg.role || 'Visitor'] || roleColors['Visitor']}`}>
                            {msg.role || 'Visitor'}
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3 text-gold-600" />
                          {formattedDate(msg.timestamp)}
                        </span>
                      </div>

                      <p className="mt-2.5 font-serif text-sm text-slate-100 italic leading-relaxed whitespace-pre-wrap">
                        &quot; {msg.content} &quot;
                      </p>
                    </div>

                    {/* Admin delete button */}
                    {isAdmin && onDeleteMessage && (
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-900/55 transition shrink-0 ml-1"
                        title="Remove legacy signature"
                        id={`delete-signature-${msg.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-gold-500/10 pt-4 flex items-center justify-between text-[11px] font-sans text-slate-400">
          <span className="flex items-center gap-1">
            <Scroll className="h-3 w-3 text-gold-500" />
            Mentor Academy Class of 2026 Memorial Ledger
          </span>
          <span>Security TLS encrypted</span>
        </div>
      </div>
    </div>
  );
}
