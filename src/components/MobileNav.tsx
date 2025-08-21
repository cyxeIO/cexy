'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MobileNavProps {
  user?: { username: string } | null;
  onSignIn?: () => void;
  isPiSdkReady?: boolean;
  piSdkConfig?: any;
  isMainnet?: boolean;
  onNetworkToggle?: (isMainnet: boolean) => void;
}

export default function MobileNav({ user, onSignIn, isPiSdkReady, piSdkConfig, isMainnet = true, onNetworkToggle }: MobileNavProps) {

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="px-4 py-3">
        {/* Top Row: Logo + User */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col items-start">
            <img src="/cexy_logo_transparent.gif" alt="Logo" className="w-16 h-10 object-contain" />
          </div>
          
          {user ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-300 font-medium">@{user.username}</span>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              disabled={!isPiSdkReady}
              className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full transition-all disabled:opacity-50"
            >
              <img src="/pi_logo.png" alt="Pi" className="w-3 h-3" />
              <span className="text-xs text-orange-300 font-medium">
                {isPiSdkReady ? 'Sign In' : 'Loading...'}
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
