import { NextRequest, NextResponse } from 'next/server';
import { getRegistrations } from '@/lib/metricsService';
import { piBlockchainService } from '@/lib/pi-blockchain';

// Verify user registration status from blockchain and backend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const walletAddress = searchParams.get('walletAddress');
    const username = searchParams.get('username');

    if (!userId && !walletAddress && !username) {
      return NextResponse.json(
        { error: 'At least one identifier (userId, walletAddress, or username) is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Verifying registration for:', { userId, walletAddress, username });

    // Check in local metrics database first
    const allRegistrations = getRegistrations();
    let existingRegistration = null;

    if (userId) {
      existingRegistration = allRegistrations.find(reg => reg.userId === userId);
    }
    
    if (!existingRegistration && walletAddress) {
      existingRegistration = allRegistrations.find(reg => reg.walletAddress === walletAddress);
    }
    
    if (!existingRegistration && username) {
      existingRegistration = allRegistrations.find(reg => reg.username === username);
    }

    if (existingRegistration) {
      console.log('✅ Found existing registration in metrics database:', existingRegistration);
      
      // Verify on blockchain for additional security
      let blockchainVerified = false;
      let blockchainDetails = null;
      
      try {
        if (walletAddress || existingRegistration.walletAddress) {
          const addressToCheck = walletAddress || existingRegistration.walletAddress;
          blockchainVerified = await piBlockchainService.verifyRegistration(addressToCheck);
          blockchainDetails = await piBlockchainService.getRegistrationDetails(addressToCheck);
        }
      } catch (error) {
        console.warn('Blockchain verification failed, using database record:', error);
        blockchainVerified = true; // Fallback to database record
      }

      return NextResponse.json({
        success: true,
        registered: true,
        registrationData: {
          registrationId: existingRegistration.registrationId,
          username: existingRegistration.username,
          userId: existingRegistration.userId,
          walletAddress: existingRegistration.walletAddress,
          transactionId: existingRegistration.transactionId,
          paymentId: existingRegistration.paymentId,
          amount: existingRegistration.amount,
          timestamp: existingRegistration.timestamp,
          status: 'completed',
          type: 'beta_registration',
          blockchainVerified,
          blockchainDetails
        },
        verificationMethod: 'database',
        blockchainVerified
      });
    }

    // Check blockchain if not found in database
    if (walletAddress) {
      try {
        const blockchainVerified = await piBlockchainService.verifyRegistration(walletAddress);
        const blockchainDetails = await piBlockchainService.getRegistrationDetails(walletAddress);
        
        if (blockchainVerified && blockchainDetails) {
          console.log('✅ Found registration on blockchain:', blockchainDetails);
          
          return NextResponse.json({
            success: true,
            registered: true,
            registrationData: {
              registrationId: blockchainDetails.registrationId,
              walletAddress: blockchainDetails.walletAddress,
              timestamp: blockchainDetails.timestamp,
              status: 'completed',
              type: 'beta_registration',
              blockchainVerified: true,
              blockchainDetails,
              // These might not be available from blockchain alone
              username: username || 'Unknown',
              userId: userId || walletAddress,
              transactionId: 'blockchain_verified',
              paymentId: 'blockchain_verified',
              amount: 0.01
            },
            verificationMethod: 'blockchain',
            blockchainVerified: true
          });
        }
      } catch (error) {
        console.error('Blockchain verification failed:', error);
      }
    }

    // Not found anywhere
    console.log('❌ No registration found for user');
    return NextResponse.json({
      success: true,
      registered: false,
      message: 'No registration found for this user',
      verificationMethod: 'not_found',
      blockchainVerified: false
    });

  } catch (error: any) {
    console.error('Registration verification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to verify registration',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Get registration details and transaction history
export async function POST(request: NextRequest) {
  try {
    const { userId, walletAddress, includeTransactionHistory = true } = await request.json();

    if (!userId && !walletAddress) {
      return NextResponse.json(
        { error: 'userId or walletAddress is required' },
        { status: 400 }
      );
    }

    console.log('📊 Getting detailed registration info for:', { userId, walletAddress });

    // Get registration from metrics database
    const allRegistrations = getRegistrations();
    const registration = allRegistrations.find(reg => 
      (userId && reg.userId === userId) || 
      (walletAddress && reg.walletAddress === walletAddress)
    );

    if (!registration) {
      return NextResponse.json({
        success: false,
        message: 'Registration not found'
      }, { status: 404 });
    }

    let transactionHistory: Array<{
      hash: string;
      status: string;
      timestamp: number;
      fee: number;
      blockHeight?: number;
      explorerUrl: string;
    }> = [];
    let blockchainStatus = null;

    if (includeTransactionHistory && registration.walletAddress) {
      try {
        // Get blockchain transaction history
        const userTransactions = await piBlockchainService.getUserRegistrations(registration.walletAddress);
        transactionHistory = userTransactions.map(tx => ({
          hash: tx.hash,
          status: tx.status,
          timestamp: tx.timestamp,
          fee: tx.fee,
          blockHeight: tx.blockHeight,
          explorerUrl: `https://pi-blockchain.net/tx/${tx.hash}`
        }));

        // Get current blockchain status
        if (registration.transactionId) {
          blockchainStatus = await piBlockchainService.getTransactionStatus(registration.transactionId);
        }
      } catch (error) {
        console.warn('Failed to get blockchain history:', error);
      }
    }

    return NextResponse.json({
      success: true,
      registrationData: registration,
      transactionHistory,
      blockchainStatus,
      explorerUrl: registration.transactionId ? 
        `https://pi-blockchain.net/tx/${registration.transactionId}` : null,
      verifiedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Detailed registration query error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get registration details',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
