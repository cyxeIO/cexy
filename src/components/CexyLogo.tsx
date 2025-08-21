'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CexyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'minimal' | 'gradient';
  animated?: boolean;
  showText?: boolean;
}

const sizeMap = {
  xs: { icon: 'w-6 h-6', text: 'text-lg' },
  sm: { icon: 'w-8 h-8', text: 'text-xl' },
  md: { icon: 'w-10 h-10', text: 'text-2xl' },
  lg: { icon: 'w-12 h-12', text: 'text-3xl' },
  xl: { icon: 'w-16 h-16', text: 'text-4xl' },
  '2xl': { icon: 'w-20 h-20', text: 'text-5xl' }
};

export default function CexyLogo({ 
  size = 'md', 
  variant = 'default', 
  animated = true,
  showText = true 
}: CexyLogoProps) {
  const { icon, text } = sizeMap[size];

  const iconVariants = {
    initial: { 
      scale: 1,
      rotate: 0 
    },
    animate: { 
      scale: [1, 1.05, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatDelay: 2
      }
    },
    hover: {
      scale: 1.1,
      rotate: 10,
      transition: { duration: 0.3 }
    }
  };

  const textVariants = {
    initial: { opacity: 0.8 },
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  };

  const getIconBackground = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-white/10 border border-white/20';
      case 'gradient':
        return 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500';
      default:
        return 'bg-gradient-to-br from-purple-600 via-pink-500 to-red-500';
    }
  };

  const getTextGradient = () => {
    switch (variant) {
      case 'minimal':
        return 'from-white to-gray-300';
      case 'gradient':
        return 'from-purple-400 via-blue-400 to-cyan-400';
      default:
        return 'from-purple-400 via-pink-400 to-red-400';
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Animated Icon */}
      <motion.div
        className={`${icon} ${getIconBackground()} rounded-xl flex items-center justify-center relative overflow-hidden cursor-pointer`}
        variants={iconVariants}
        initial="initial"
        animate={animated ? "animate" : "initial"}
        whileHover="hover"
      >
        {/* Animated background particles */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* CEXY Infinity Dots */}
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 40 24"
          className="relative z-10"
        >
          {/* Connecting Lines (subtle) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={animated ? { opacity: [0, 0.3, 0.3, 0] } : { opacity: 0.2 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* C to E */}
            <line x1="8" y1="12" x2="20" y2="8" stroke="currentColor" strokeWidth="1" className="text-white/30" />
            {/* E to X */}
            <line x1="20" y1="8" x2="20" y2="16" stroke="currentColor" strokeWidth="1" className="text-white/30" />
            {/* X to Y */}
            <line x1="20" y1="16" x2="32" y2="12" stroke="currentColor" strokeWidth="1" className="text-white/30" />
            {/* Y back to C (completing infinity) */}
            <line x1="32" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1" className="text-white/30" />
          </motion.g>
          
          {/* CEXY Dots positioned to form infinity */}
          
          {/* C - Left side of infinity */}
          <motion.circle
            cx="8"
            cy="12"
            r="2"
            fill="currentColor"
            className="text-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={animated ? {
              scale: [0, 1.2, 1, 1.1, 1],
              opacity: [0, 1, 1, 1, 1],
              filter: [
                'drop-shadow(0 0 2px rgba(255,255,255,0.3))',
                'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
                'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                'drop-shadow(0 0 6px rgba(255,255,255,0.6))',
                'drop-shadow(0 0 4px rgba(255,255,255,0.5))'
              ]
            } : { scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0,
              repeat: animated ? Infinity : 0,
              repeatDelay: 3
            }}
          />
          
          {/* E - Top intersection */}
          <motion.circle
            cx="20"
            cy="8"
            r="2"
            fill="currentColor"
            className="text-purple-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={animated ? {
              scale: [0, 1.2, 1, 1.1, 1],
              opacity: [0, 1, 1, 1, 1],
              filter: [
                'drop-shadow(0 0 2px rgba(168, 85, 247, 0.3))',
                'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))',
                'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))',
                'drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))',
                'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))'
              ]
            } : { scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              repeat: animated ? Infinity : 0,
              repeatDelay: 3
            }}
          />
          
          {/* X - Center crossing (most important) */}
          <motion.circle
            cx="20"
            cy="16"
            r="2.5"
            fill="currentColor"
            className="text-yellow-400"
            initial={{ scale: 0, opacity: 0 }}
            animate={animated ? {
              scale: [0, 1.4, 1.1, 1.3, 1.1],
              opacity: [0, 1, 1, 1, 1],
              filter: [
                'drop-shadow(0 0 3px rgba(251, 191, 36, 0.4))',
                'drop-shadow(0 0 12px rgba(251, 191, 36, 1))',
                'drop-shadow(0 0 6px rgba(251, 191, 36, 0.7))',
                'drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))',
                'drop-shadow(0 0 6px rgba(251, 191, 36, 0.7))'
              ]
            } : { scale: 1.1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              repeat: animated ? Infinity : 0,
              repeatDelay: 3
            }}
          />
          
          {/* Y - Right side of infinity */}
          <motion.circle
            cx="32"
            cy="12"
            r="2"
            fill="currentColor"
            className="text-cyan-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={animated ? {
              scale: [0, 1.2, 1, 1.1, 1],
              opacity: [0, 1, 1, 1, 1],
              filter: [
                'drop-shadow(0 0 2px rgba(103, 232, 249, 0.3))',
                'drop-shadow(0 0 8px rgba(103, 232, 249, 0.8))',
                'drop-shadow(0 0 4px rgba(103, 232, 249, 0.5))',
                'drop-shadow(0 0 6px rgba(103, 232, 249, 0.6))',
                'drop-shadow(0 0 4px rgba(103, 232, 249, 0.5))'
              ]
            } : { scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.2,
              repeat: animated ? Infinity : 0,
              repeatDelay: 3
            }}
          />
          
          {/* Connection pulse effect */}
          {animated && (
            <motion.g
              animate={{
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 2,
                ease: "easeInOut"
              }}
            >
              {/* Connection lines with gradient */}
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="50%" stopColor="rgba(251,191,36,0.6)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                </linearGradient>
              </defs>
              
              {/* Infinity flow lines */}
              <path
                d="M 8 12 C 12 8, 16 8, 20 8 C 24 8, 28 8, 32 12 C 28 16, 24 16, 20 16 C 16 16, 12 16, 8 12"
                fill="none"
                stroke="url(#connectionGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </motion.g>
          )}
          
          {/* Static dots for non-animated version */}
          {!animated && (
            <>
              <circle cx="8" cy="12" r="2" fill="currentColor" className="text-white" />
              <circle cx="20" cy="8" r="2" fill="currentColor" className="text-purple-300" />
              <circle cx="20" cy="16" r="2.5" fill="currentColor" className="text-yellow-400" />
              <circle cx="32" cy="12" r="2" fill="currentColor" className="text-cyan-300" />
            </>
          )}
        </motion.svg>
      </motion.div>

      {/* Animated Text */}
      {showText && (
        <motion.div className="flex flex-col">
          <motion.div
            className="flex items-baseline gap-1"
            variants={textVariants}
            initial="initial"
            animate={animated ? "animate" : "initial"}
          >
            <span
              className={`${text} font-black tracking-tight bg-gradient-to-r ${getTextGradient()} bg-clip-text text-transparent`}
              style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              CEXY
            </span>
            <span
              className={`${text} font-light text-white opacity-90`}
              style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              ai
            </span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
