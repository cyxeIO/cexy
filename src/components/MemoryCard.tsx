'use client';

import { useState } from 'react';
import { Heart, Share2, Download, Eye, Lock, Unlock, Star } from 'lucide-react';
import { Memory } from '@/types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface MemoryCardProps {
  memory: Memory;
  onLike?: (memoryId: string) => void;
  onShare?: (memoryId: string) => void;
  onDownload?: (memoryId: string) => void;
  onView?: (memoryId: string) => void;
  onPrivacyToggle?: (memoryId: string, isPublic: boolean) => void;
}

export default function MemoryCard({
  memory,
  onLike,
  onShare,
  onDownload,
  onView,
  onPrivacyToggle,
}: MemoryCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100)); // Placeholder

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(memory.id);
    toast.success(isLiked ? 'Unliked' : 'Liked!');
  };

  const handleShare = () => {
    if (memory.privacy.isPublic) {
      onShare?.(memory.id);
      toast.success('Memory shared!');
    } else {
      toast.error('This memory is private');
    }
  };

  const handlePrivacyToggle = () => {
    const newPrivacy = !memory.privacy.isPublic;
    onPrivacyToggle?.(memory.id, newPrivacy);
    toast.success(`Memory is now ${newPrivacy ? 'public' : 'private'}`);
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSentimentColor = (score: number): string => {
    if (score > 0.3) return 'text-green-500';
    if (score < -0.3) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getSentimentEmoji = (score: number): string => {
    if (score > 0.5) return '😊';
    if (score > 0.2) return '🙂';
    if (score > -0.2) return '😐';
    if (score > -0.5) return '😕';
    return '😢';
  };

  const getRarityBorder = (rarity: string): string => {
    switch (rarity) {
      case 'legendary': return 'border-purple-200 bg-purple-50';
      case 'epic': return 'border-orange-200 bg-orange-50';
      case 'rare': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`rounded-xl border-2 ${getRarityBorder(memory.blockchain.isNftMinted ? 'epic' : 'common')} shadow-lg overflow-hidden transition-all duration-200`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 truncate flex-1">
            {memory.title}
          </h3>
          <div className="flex items-center gap-2 ml-2">
            {memory.blockchain.isNftMinted && (
              <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                <Star size={12} />
                NFT
              </div>
            )}
            <button
              onClick={handlePrivacyToggle}
              className={`p-1 rounded-full transition-colors ${
                memory.privacy.isPublic 
                  ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                  : 'text-red-600 bg-red-100 hover:bg-red-200'
              }`}
            >
              {memory.privacy.isPublic ? <Unlock size={14} /> : <Lock size={14} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="capitalize">{memory.type}</span>
          <span>{formatDuration(memory.duration)}</span>
          <span>{formatFileSize(memory.size)}</span>
          <span className={getSentimentColor(memory.sentiment.score)}>
            {getSentimentEmoji(memory.sentiment.score)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Description */}
        {memory.description && (
          <p className="text-gray-700 mb-3 line-clamp-2">
            {memory.description}
          </p>
        )}

        {/* Tags */}
        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {memory.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
            {memory.tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{memory.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Sentiment Details */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Emotional Analysis</span>
            <span>{Math.round(memory.sentiment.confidence * 100)}% confident</span>
          </div>
          <div className="flex gap-2">
            {Object.entries(memory.sentiment.emotions)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([emotion, score]) => (
                <div key={emotion} className="text-xs">
                  <span className="capitalize text-gray-600">{emotion}</span>
                  <div className="w-8 h-1 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="text-xs text-gray-500 mb-3">
          <div className="flex justify-between">
            <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
            {memory.metadata.location && (
              <span>📍 {memory.metadata.location.address || 'Unknown location'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
              {likes}
            </button>

            <button
              onClick={() => onView?.(memory.id)}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <Eye size={14} />
              View
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              disabled={!memory.privacy.isPublic}
              className={`p-2 rounded-full transition-colors ${
                memory.privacy.isPublic
                  ? 'text-gray-600 hover:bg-gray-200'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Share2 size={14} />
            </button>

            <button
              onClick={() => onDownload?.(memory.id)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Pi Token Info */}
        {(memory.blockchain.piTokensEarned > 0 || memory.blockchain.piTokensSpent > 0) && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-600">
              {memory.blockchain.piTokensEarned > 0 && (
                <span className="text-green-600">
                  +{memory.blockchain.piTokensEarned.toFixed(4)} π earned
                </span>
              )}
              {memory.blockchain.piTokensSpent > 0 && (
                <span className="text-orange-600">
                  -{memory.blockchain.piTokensSpent.toFixed(4)} π spent
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
