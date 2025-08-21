// Core types for the cexy.ai application

export interface Memory {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'audio' | 'video' | 'photo' | 'mixed';
  duration?: number; // in seconds
  size: number; // in bytes
  tags: string[];
  sentiment: SentimentAnalysis;
  metadata: MemoryMetadata;
  privacy: PrivacySettings;
  blockchain: BlockchainData;
  createdAt: Date;
  updatedAt: Date;
}

export interface SentimentAnalysis {
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  keywords: string[];
}

export interface MemoryMetadata {
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  deviceInfo: {
    type: 'wearable' | 'mobile' | 'web';
    model?: string;
    os?: string;
  };
  quality: {
    resolution?: string;
    bitrate?: number;
    fps?: number;
  };
}

export interface PrivacySettings {
  isPublic: boolean;
  shareWithCommunity: boolean;
  allowAIProcessing: boolean;
  shareWithFriends: string[]; // user IDs
  anonymizeData: boolean;
}

export interface BlockchainData {
  arweaveId?: string;
  transactionHash?: string;
  nftTokenId?: string;
  isNftMinted: boolean;
  piTokensEarned: number;
  piTokensSpent: number;
}

export interface User {
  id: string;
  piWalletAddress: string;
  username: string;
  email?: string;
  profile: UserProfile;
  preferences: UserPreferences;
  subscription: SubscriptionTier;
  piTokenBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  displayName: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  stats: {
    totalMemories: number;
    totalDuration: number;
    nftsMinted: number;
    piTokensEarned: number;
    communityShares: number;
  };
}

export interface UserPreferences {
  recordingQuality: 'low' | 'medium' | 'high' | 'ultra';
  autoProcessing: boolean;
  aiCurationLevel: 'minimal' | 'moderate' | 'aggressive';
  notificationSettings: {
    newMemoryProcessed: boolean;
    nftMinted: boolean;
    piTokensReceived: boolean;
    communityInteractions: boolean;
  };
  privacyDefaults: PrivacySettings;
}

export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

export interface RecordingSession {
  id: string;
  userId: string;
  status: 'recording' | 'paused' | 'stopped' | 'processing';
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: 'audio' | 'video';
  quality: string;
  tempFileUrl?: string;
  estimatedCost: number; // in Pi tokens
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  memory_id: string;
  created_by: string;
  sentiment_score: number;
  duration: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Community {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[];
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  sharedMemories: string[];
}

export interface AIAnalysisJob {
  id: string;
  memoryId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'sentiment' | 'transcription' | 'highlight_detection' | 'categorization';
  progress: number; // 0 to 100
  result?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Pi Network Integration types
export interface PiPayment {
  amount: number;
  memo: string;
  metadata: {
    userId: string;
    feature: string;
    description: string;
  };
}

export interface PiTransaction {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: object;
  from_address: string;
  to_address: string;
  direction: 'user_to_app' | 'app_to_user';
  network: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction?: {
    txid: string;
    verified: boolean;
    _link: string;
  };
  created_at: string;
}

// Storage types
export interface StorageUploadResult {
  hash: string;
  url: string;
  size: number;
  type: 'arweave';
}

export interface StorageConfig {
  provider: 'arweave';
  encryption: boolean;
  redundancy: number;
  retention: 'permanent' | 'temporary';
}
