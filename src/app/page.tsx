'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Coins, Heart, Lock, Mic, Star, Users, Video } from 'lucide-react';
import RecordingControls from '@/components/RecordingControls';
import MemoryCard from '@/components/MemoryCard';
import { Memory } from '@/types';
import toast, { Toaster } from 'react-hot-toast';

interface User {
  id: string;
  walletAddress: string;
  username: string;
  displayName: string;
  piTokenBalance: number;
  subscriptionTier: string;
}

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initializeApp = async () => {
      try {
        await checkSession();
        await loadMemories();
      } catch (error) {
        console.error('App initialization failed:', error);
      }
    };
    
    initializeApp();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('cexy_session_token');
      if (token) {
        const response = await fetch('/api/auth', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('cexy_session_token');
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMemories = async () => {
    try {
      const token = localStorage.getItem('cexy_session_token');
      if (!token) return;

      const response = await fetch('/api/memories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMemories(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load memories:', error);
    }
  };

  const handlePiLogin = async () => {
    try {
      // In a real implementation, this would integrate with Pi SDK
      toast.success('Pi Wallet login coming soon!');
      
      // Simulate login for demo
      const mockUser = {
        id: 'demo-user-1',
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        username: 'demo_user',
        displayName: 'Demo User',
        piTokenBalance: 10.5,
        subscriptionTier: 'free',
      };
      
      const mockToken = Buffer.from(JSON.stringify({
        userId: mockUser.id,
        walletAddress: mockUser.walletAddress,
        timestamp: Date.now(),
      })).toString('base64');
      
      localStorage.setItem('cexy_session_token', mockToken);
      setUser(mockUser);
      toast.success('Welcome to cexy.ai!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleRecordingComplete = async (blob: Blob, type: 'audio' | 'video') => {
    try {
      toast.success(`${type === 'video' ? 'Video' : 'Audio'} recording saved!`);

      if (!user) {
        toast.error('Please login to save memories');
        return;
      }

      const formData = new FormData();
      formData.append('title', `${type === 'video' ? 'Video' : 'Audio'} Memory ${new Date().toLocaleString()}`);
      formData.append('description', 'A new memory captured with cexy.ai');
      formData.append('type', type);
      formData.append(type, blob, `memory.${type === 'video' ? 'webm' : 'webm'}`);
      
      const token = localStorage.getItem('cexy_session_token');
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        await response.json();
        toast.success('Memory saved and processing started!');
        await loadMemories(); // Reload memories
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save memory');
      }
    } catch (error) {
      console.error('Failed to save memory:', error);
      toast.error('Failed to save memory');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cexy.ai...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                cexy.ai
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    <Coins size={16} />
                    {user.piTokenBalance?.toFixed(4) || '0.0000'} π
                  </div>
                  <div className="text-sm text-gray-600">
                    Welcome, {user.displayName}!
                  </div>
                </div>
              ) : (
                <button
                  onClick={handlePiLogin}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Coins size={18} />
                  Connect Pi Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          /* Landing Page for Non-Logged Users */
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Record, Relive, and Own Your Memories
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Capture life&apos;s moments with AI-powered curation, blockchain security, and NFT minting on the Pi Network.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Smart Recording</h3>
                  <p className="text-gray-600">Continuous audio/video capture with intelligent highlight detection</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Curation</h3>
                  <p className="text-gray-600">Sentiment analysis, categorization, and automatic highlight reels</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Blockchain Security</h3>
                  <p className="text-gray-600">Decentralized storage on IPFS/Arweave with Pi Network integration</p>
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-8"
                >
                  <Star className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">NFT Memories</h3>
                  <p className="text-blue-100 mb-6">
                    Mint your most precious memories as NFTs on the Pi blockchain. Each memory&apos;s rarity is determined by AI analysis of emotional content, uniqueness, and engagement.
                  </p>
                  <div className="flex items-center gap-2 text-yellow-300">
                    <Coins size={20} />
                    <span>Earn Pi tokens for quality memories</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-xl p-8"
                >
                  <Users className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Community Sharing</h3>
                  <p className="text-green-100 mb-6">
                    Share curated moments with the community while maintaining full control over your privacy. Connect with others through shared experiences.
                  </p>
                  <div className="flex items-center gap-2 text-green-200">
                    <Heart size={20} />
                    <span>Privacy-first design with granular controls</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Dashboard for Logged Users */
          <div className="space-y-8">
            {/* Recording Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
              data-recording-controls
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Capture New Memory
              </h2>
              <RecordingControls
                onRecordingComplete={handleRecordingComplete}
                onRecordingStart={() => {}}
                onRecordingStop={() => {}}
              />
            </motion.section>

            {/* Memories Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Memories</h2>
                <div className="text-sm text-gray-600">
                  {memories.length} memories stored
                </div>
              </div>

              {memories.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No memories yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start recording to capture and preserve your precious moments with AI-powered insights.
                  </p>
                  <button
                    onClick={() => {
                      document.querySelector('[data-recording-controls]')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Recording
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memories.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      onLike={() => toast.success('Memory liked!')}
                      onShare={() => toast.success('Memory shared!')}
                      onDownload={() => toast.success('Download started!')}
                      onView={() => toast.success('Memory viewer coming soon!')}
                      onPrivacyToggle={(_, isPublic) => 
                        toast.success(`Memory is now ${isPublic ? 'public' : 'private'}`)
                      }
                    />
                  ))}
                </div>
              )}
            </motion.section>
          </div>
        )}
      </main>
    </div>
  );
}
