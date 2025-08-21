import { NextRequest, NextResponse } from 'next/server';
import { dbUtils } from '@/lib/database';
import { getStorageService } from '@/lib/storage';
import { getAIService, aiUtils } from '@/lib/ai';
import { piUtils } from '@/lib/pi-network';

// Helper function to get user from session
async function getUserFromSession(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing authorization header');
  }

  const token = authHeader.substring(7);
  const sessionData = JSON.parse(Buffer.from(token, 'base64').toString());
  const { userId, walletAddress, timestamp } = sessionData;

  if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
    throw new Error('Session expired');
  }

  const user = await dbUtils.findUserByWallet(walletAddress);
  
  if (!user || user.id !== userId) {
    throw new Error('Invalid session');
  }

  return user;
}

// GET /api/memories - Get user's memories
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const memories = await dbUtils.getMemoriesByUser(user.id, limit, offset);

    // Parse JSON fields
    const parsedMemories = memories.map(memory => ({
      id: memory.id,
      userId: memory.user_id,
      title: memory.title,
      description: memory.description,
      type: memory.type,
      duration: memory.duration,
      size: memory.size,
      tags: JSON.parse(memory.tags || '[]'),
      sentiment: JSON.parse(memory.sentiment || '{}'),
      metadata: JSON.parse(memory.metadata || '{}'),
      privacy: JSON.parse(memory.privacy_settings || '{}'),
      blockchain: JSON.parse(memory.blockchain_data || '{}'),
      createdAt: memory.created_at,
      updatedAt: memory.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: parsedMemories,
      pagination: {
        page,
        limit,
        total: parsedMemories.length, // This should be the actual total count
        hasNext: parsedMemories.length === limit,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Get memories error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message.includes('authorization') ? 401 : 500 }
    );
  }
}

// POST /api/memories - Create new memory
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const audioFile = formData.get('audio') as File | null;
    const videoFile = formData.get('video') as File | null;
    const metadataStr = formData.get('metadata') as string;

    if (!title || !type || (!audioFile && !videoFile)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userPreferences = JSON.parse(user.preferences || '{}');

    // Check if user has sufficient Pi tokens for processing
    const estimatedCost = aiUtils.estimateProcessingCost(
      audioFile || undefined,
      videoFile || undefined,
      userPreferences.aiCurationLevel || 'moderate'
    );

    if (user.pi_token_balance < estimatedCost) {
      return NextResponse.json(
        { error: `Insufficient Pi tokens. Required: ${estimatedCost.toFixed(4)} π` },
        { status: 402 }
      );
    }

    // Initialize services
    const storageService = getStorageService();
    await storageService.initialize();

    const aiService = getAIService();

    // Process files
    let totalSize = 0;
    let duration = 0;
    let audioBlob: Blob | undefined;
    let videoBlob: Blob | undefined;

    if (audioFile) {
      audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
      totalSize += audioFile.size;
      // Estimate duration based on file size (rough approximation)
      duration = Math.max(duration, audioFile.size / 16000); // Assuming 128kbps audio
    }

    if (videoFile) {
      videoBlob = new Blob([await videoFile.arrayBuffer()], { type: videoFile.type });
      totalSize += videoFile.size;
      // Estimate duration based on file size (rough approximation)
      duration = Math.max(duration, videoFile.size / 125000); // Assuming 1Mbps video
    }

    let metadata = {};
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.warn('Invalid metadata JSON:', e);
      }
    }

    // AI Processing (if enabled)
    interface AIResults extends Record<string, unknown> {
      transcription: string;
      sentiment: {
        score: number;
        confidence: number;
        emotions: Record<string, number>;
        keywords: string[];
      };
      categories: string[];
      objects: string[];
      description: string;
      highlights: {
        timestamps: number[];
        reasons: string[];
        confidence: number;
      };
      rarity: string;
    }

    let aiResults: AIResults = {
      transcription: '',
      sentiment: {
        score: 0,
        confidence: 0,
        emotions: {
          joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0, disgust: 0
        },
        keywords: [],
      },
      categories: ['everyday'],
      objects: [],
      description: description || title,
      highlights: { timestamps: [0], reasons: ['Default'], confidence: 0.5 },
      rarity: 'common',
    };

    if (aiUtils.isAIProcessingEnabled(userPreferences)) {
      try {
        const processingResult = await aiService.processMemory(audioBlob, videoBlob, {
          duration,
          userEngagement: 0,
          ...metadata,
        });
        
        aiResults = {
          transcription: processingResult.transcription,
          sentiment: processingResult.sentiment,
          categories: processingResult.categories,
          objects: processingResult.objects,
          description: processingResult.description,
          highlights: processingResult.highlights,
          rarity: processingResult.rarity,
        };
      } catch (aiError) {
        console.error('AI processing failed:', aiError);
        // Continue without AI processing
      }
    }

    // Store files
    const mainFile = videoFile || audioFile!;
    const fileBuffer = new Uint8Array(await mainFile.arrayBuffer());
    
    const storageResults = await storageService.uploadMemory(
      fileBuffer,
      {
        title,
        description: aiResults.description,
        type,
        sentiment: aiResults.sentiment,
        categories: aiResults.categories,
        userId: user.id,
      },
      mainFile.type
    );

    // Calculate storage cost
    const storageCost = piUtils.calculateStorageCost(
      totalSize,
      userPreferences.recordingQuality || 'medium'
    );

    // Create memory record
    const privacyDefaults = userPreferences.privacyDefaults || {
      isPublic: false,
      shareWithCommunity: false,
      allowAIProcessing: true,
      shareWithFriends: [],
      anonymizeData: false,
    };

    const memoryData = {
      userId: user.id,
      title,
      description: aiResults.description,
      contentType: type,
      type,
      duration: Math.round(duration),
      size: totalSize,
      tags: aiResults.categories,
      sentiment: aiResults.sentiment,
      metadata: {
        ...metadata,
        deviceInfo: {
          type: 'web',
          userAgent: request.headers.get('user-agent'),
        },
        quality: {
          recordingQuality: userPreferences.recordingQuality || 'medium',
        },
        aiProcessing: {
          enabled: aiUtils.isAIProcessingEnabled(userPreferences),
          level: userPreferences.aiCurationLevel || 'moderate',
          transcription: aiResults.transcription,
          objects: aiResults.objects,
          highlights: aiResults.highlights,
        },
      },
      privacyLevel: privacyDefaults.isPublic ? 'public' : 'private',
      privacySettings: privacyDefaults,
      blockchainData: {
        arweaveId: storageResults.arweave?.hash,
        isNftMinted: false,
        piTokensEarned: 0,
        piTokensSpent: estimatedCost + storageCost,
      },
      aiAnalysis: aiResults,
    };

    const savedMemory = await dbUtils.saveMemory(memoryData);

    // Deduct Pi tokens from user balance
    // In a real implementation, this would be done atomically with the memory creation
    // and involve actual Pi Network transactions

    return NextResponse.json({
      success: true,
      data: {
        id: savedMemory.id,
        title: savedMemory.title,
        description: savedMemory.description,
        type: savedMemory.type,
        duration: savedMemory.duration,
        size: savedMemory.size,
        storageUrls: {
          arweave: storageResults.arweave?.url,
        },
        aiResults,
        costs: {
          processing: estimatedCost,
          storage: storageCost,
          total: estimatedCost + storageCost,
        },
      },
    });

  } catch (error) {
    console.error('Create memory error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error && error.message.includes('authorization') ? 401 : 500 }
    );
  }
}
