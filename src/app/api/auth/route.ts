import { NextRequest, NextResponse } from 'next/server';
import { dbUtils } from '@/lib/database';
import { getPiService } from '@/lib/pi-network';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, signature, message } = body;

    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { error: 'Missing required authentication data' },
        { status: 400 }
      );
    }

    // Verify the signature with Pi Network
    const piService = getPiService();
    
    try {
      // In a real implementation, you would verify the signature
      // For now, we'll simulate authentication
      const piUser = await piService.authenticateUser();
      
      // Check if user exists in our database
      let user = await dbUtils.findUserByWallet(walletAddress);
      
      if (!user) {
        // Create new user
        const userData = {
          piWalletAddress: walletAddress,
          username: piUser.username || `user_${Date.now()}`,
          email: '',
          displayName: piUser.username || 'Anonymous User',
          preferences: {
            recordingQuality: 'medium',
            autoProcessing: true,
            aiCurationLevel: 'moderate',
            notificationSettings: {
              newMemoryProcessed: true,
              nftMinted: true,
              piTokensReceived: true,
              communityInteractions: false,
            },
            privacyDefaults: {
              isPublic: false,
              shareWithCommunity: false,
              allowAIProcessing: true,
              shareWithFriends: [],
              anonymizeData: false,
            },
          },
          stats: {
            totalMemories: 0,
            totalDuration: 0,
            nftsMinted: 0,
            piTokensEarned: 0,
            communityShares: 0,
          },
        };

        user = await dbUtils.createUser(userData);
      }

      // Generate session token (in production, use proper JWT or session management)
      const sessionToken = Buffer.from(
        JSON.stringify({
          userId: user.id,
          walletAddress: user.pi_wallet_address,
          timestamp: Date.now(),
        })
      ).toString('base64');

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          walletAddress: user.pi_wallet_address,
          username: user.username,
          displayName: user.display_name,
          avatar: user.avatar,
          bio: user.bio,
          isVerified: user.is_verified,
          subscriptionTier: user.subscription_tier,
          piTokenBalance: user.pi_token_balance,
          preferences: JSON.parse(user.preferences || '{}'),
          stats: JSON.parse(user.stats || '{}'),
        },
        sessionToken,
      });

    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      // Decode session token
      const sessionData = JSON.parse(Buffer.from(token, 'base64').toString());
      const { userId, walletAddress, timestamp } = sessionData;

      // Check if token is expired (24 hours)
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        return NextResponse.json(
          { error: 'Session expired' },
          { status: 401 }
        );
      }

      // Get user from database
      const user = await dbUtils.findUserByWallet(walletAddress);
      
      if (!user || user.id !== userId) {
        return NextResponse.json(
          { error: 'Invalid session' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          walletAddress: user.pi_wallet_address,
          username: user.username,
          displayName: user.display_name,
          avatar: user.avatar,
          bio: user.bio,
          isVerified: user.is_verified,
          subscriptionTier: user.subscription_tier,
          piTokenBalance: user.pi_token_balance,
          preferences: JSON.parse(user.preferences || '{}'),
          stats: JSON.parse(user.stats || '{}'),
        },
      });

    } catch {
      return NextResponse.json(
        { error: 'Invalid session token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
