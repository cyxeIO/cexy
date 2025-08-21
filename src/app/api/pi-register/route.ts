import { NextRequest, NextResponse } from 'next/server';
import { piService, type PiAuthResult } from '@/lib/pi-service';

// GET - Check registration status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');

    if (!userId && !username) {
      return NextResponse.json(
        { error: 'User ID or username is required' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingUser = await piService.getRegistrationStatus(userId || username!);
    
    if (existingUser) {
      return NextResponse.json({
        registered: true,
        user: {
          registrationId: existingUser.registrationId,
          status: existingUser.status,
          transactionId: existingUser.transactionId,
          message: existingUser.message
        }
      });
    } else {
      return NextResponse.json({
        registered: false
      });
    }

  } catch (error: any) {
    console.error('Registration status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check registration status' },
      { status: 500 }
    );
  }
}

// POST - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authResult, walletAddress } = body;

    console.log('Registration attempt:', {
      hasAuthResult: !!authResult,
      hasWallet: !!walletAddress,
      userId: authResult?.user?.uid,
      username: authResult?.user?.username
    });

    // Validate input
    if (!authResult || !walletAddress) {
      console.error('Missing required fields:', { authResult: !!authResult, walletAddress: !!walletAddress });
      return NextResponse.json(
        { error: 'Authentication result and wallet address are required' },
        { status: 400 }
      );
    }

    // Validate authResult structure
    if (!authResult.accessToken || !authResult.user?.uid || !authResult.user?.username) {
      console.error('Invalid auth result structure:', authResult);
      return NextResponse.json(
        { error: 'Invalid authentication result' },
        { status: 400 }
      );
    }

    console.log('Calling piService.registerUser...');
    // Register user
    const registration = await piService.registerUser(authResult as PiAuthResult, walletAddress);
    console.log('Registration successful:', registration);

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for CEXY beta access!',
      registration: {
        registrationId: registration.registrationId,
        walletAddress: registration.walletAddress,
        username: registration.username,
        status: registration.status,
        timestamp: registration.timestamp
      }
    });

  } catch (error: any) {
    console.error('Pi registration error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Registration failed',
        success: false
      },
      { status: 400 }
    );
  }
}
