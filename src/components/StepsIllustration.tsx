import React from 'react';
import { motion } from 'motion/react';

interface StepsIllustrationProps {
  className?: string;
  animate?: boolean;
}

export default function StepsIllustration({ className = '', animate = true }: StepsIllustrationProps) {
  // Stagger configurations for motion SVG paths
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.25, duration: 0.6, ease: 'easeOut' }
    })
  };

  return (
    <div className={`relative select-none text-gold-500 ${className}`} id="steps-illustration">
      <div className="w-full max-w-[420px] mx-auto">
        <svg
          viewBox="0 0 320 220"
          fill="none"
          stroke="currentColor"
          className="w-full h-auto drop-shadow-lg"
          id="steps-svg"
        >
          {/* Staircase Steps: Replicating the diagonal stairs climb toward graduation */}
          <motion.path
            d="M 40,150 L 80,150 L 80,132 L 120,132 L 120,114 L 160,114 L 160,96 L 200,96 L 200,78 L 240,78"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
            animate={animate ? { pathLength: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
          
          {/* Subtle stair support underline */}
          <motion.path
            d="M 32,154 L 202,81"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity="0.6"
            initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
            animate={animate ? { pathLength: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          />

          {/* Golden Floor ground line */}
          <motion.line
            x1="10"
            y1="150"
            x2="40"
            y2="150"
            stroke="currentColor"
            strokeWidth="2.5"
            initial={animate ? { scaleX: 0 } : { scaleX: 1 }}
            animate={animate ? { scaleX: 1 } : {}}
            style={{ transformOrigin: 'right' }}
            transition={{ duration: 0.5 }}
          />

          {/* 1. Infant Silhouette (Below/Start of Stairs) - Crawling Baby */}
          <motion.g
            custom={1}
            variants={itemVariants}
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
            className="fill-current"
          >
            {/* Baby crawling */}
            <circle cx="28" cy="138" r="2.2" />
            <path d="M 27,140 Q 23,141 19,144 Q 17,147 21,148 Q 23,146 25,143 M 28,141 Q 31,144 32,147 M 24,142 Q 22,146 17,148" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </motion.g>

          {/* 2. Toddler Silhouette (First step) - Walking Child */}
          <motion.g
            custom={2}
            variants={itemVariants}
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
            className="fill-current"
          >
            {/* Toddler leaning slightly forward */}
            <circle cx="62" cy="132" r="2.5" />
            <path d="M 62,135 L 61,143 M 61,143 L 58,149 M 61,143 L 64,149 M 62,136 Q 58,138 59,141 M 62,136 L 65,142" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </motion.g>

          {/* 3. Little Kid Silhouette (Second step) - School kid with backpack */}
          <motion.g
            custom={3}
            variants={itemVariants}
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
            className="fill-current"
          >
            {/* School kid */}
            <circle cx="102" cy="112" r="3" />
            {/* Kid body and little backpack */}
            <path d="M 102,115 L 102,124 M 102,124 L 99,131 M 102,124 L 105,131 M 102,117 L 106,122 M 102,117 Q 97,117 98,122 M 98,118 H 101 V 123 H 98 Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </motion.g>

          {/* 4. Youth School Student (Third step) - Teenager */}
          <motion.g
            custom={4}
            variants={itemVariants}
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
            className="fill-current"
          >
            {/* Teenager */}
            <circle cx="142" cy="91" r="3.2" />
            <path d="M 142,94 L 142,106 M 142,106 L 138,113 M 142,106 L 146,113 M 142,96 L 137,102 M 142,96 L 148,103" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </motion.g>

          {/* 5. Gown Graduate Silhouette (Highest Stair) - Looking up, holding diploma and raised scroll */}
          <motion.g
            custom={5}
            variants={itemVariants}
            initial={animate ? 'hidden' : 'visible'}
            animate="visible"
            className="fill-current"
          >
            {/* Graduate details */}
            {/* Mortar board (grad cap) */}
            <polygon points="214,48 223,51 232,48 223,45" stroke="currentColor" strokeWidth="1.2" />
            <rect x="221" y="49" width="4" height="2" />
            <path d="M 229,50 L 231,56" stroke="currentColor" strokeWidth="0.8" /> {/* Tassel */}
            <circle cx="223" cy="54" r="3.5" /> {/* Head */}
            
            {/* Gown & Arms */}
            {/* Raised arm holding college diploma scroll */}
            <path d="M 223,58 L 223,72 C 220,74 213,76 215,77 C 217,78 221,77 225,75 M 223,72 L 220,77 L 221,78 M 223,72 L 226,77 L 228,78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Left Hand pointing forward and raising degree */}
            <path d="M 223,59 C 229,59 235,53 238,47" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            {/* Diploma scroll in hand */}
            <path d="M 235,46 L 241,49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </motion.g>

          {/* Script Word: "Congratulations" - exact replica matching the bottom flow */}
          <motion.text
            x="130"
            y="178"
            textAnchor="middle"
            className="font-script fill-current text-[27px] font-medium gold-gradient-text"
            initial={animate ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Congratulations
          </motion.text>

          {/* Under script gold accent flourish line */}
          <motion.path
            d="M 40,192 C 90,192 100,188 135,188 C 170,188 180,192 230,192"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          />

          {/* Left Vertical text: CLASS OF 2026 as shown in the original cover */}
          <g className="fill-current text-gold-500" style={{ letterSpacing: '0.1em' }}>
            <motion.text 
              x="264" 
              y="114" 
              className="font-display font-medium text-[9px] text-center" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.9 }} 
              transition={{ delay: 1.6 }}
            >
              C
            </motion.text>
            <motion.text 
              x="264" 
              y="126" 
              className="font-display font-medium text-[9px] text-center" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.9 }} 
              transition={{ delay: 1.7 }}
            >
              L
            </motion.text>
            <motion.text 
              x="264" 
              y="138" 
              className="font-display font-medium text-[9px] text-center" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.9 }} 
              transition={{ delay: 1.8 }}
            >
              A
            </motion.text>
            <motion.text 
              x="264" 
              y="150" 
              className="font-display font-medium text-[9px] text-center" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.9 }} 
              transition={{ delay: 1.9 }}
            >
              S
            </motion.text>
            <motion.text 
              x="264" 
              y="162" 
              className="font-display font-medium text-[9px] text-center" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.9 }} 
              transition={{ delay: 2.0 }}
            >
              S
            </motion.text>
            
            <motion.text 
              x="264" 
              y="178" 
              className="font-display font-medium text-[9px] text-center" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.9 }} 
              transition={{ delay: 2.1 }}
            >
              O
            </motion.text>
            <motion.text 
              x="264" 
              y="190" 
              className="font-display font-medium text-[9px] text-center" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.9 }} 
              transition={{ delay: 2.2 }}
            >
              F
            </motion.text>
          </g>

          {/* Elegant numbers vertical right column */}
          <motion.g
            className="fill-current text-gold-500 font-display font-bold text-[21px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            <text x="282" y="118">2</text>
            <text x="282" y="142">0</text>
            <text x="282" y="166">2</text>
            <text x="282" y="190" className="text-gold-400">6</text>
          </motion.g>

          {/* Little elegant elements to frame the climber */}
          <motion.circle cx="115" cy="55" r="1.2" fill="currentColor" opacity="0.6" animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 2.5 }} />
          <motion.circle cx="215" cy="30" r="1.5" fill="currentColor" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />
        </svg>
      </div>
    </div>
  );
}
