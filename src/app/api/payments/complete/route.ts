import { NextRequest, NextResponse } from 'next/server';
import { piService } from '@/lib/pi-service';
import { addRegistration } from '@/lib/metricsService';

// Complete payments and handle registration
export async function POST(request: NextRequest) {
  try {
    const { paymentId, txid, walletAddress, userId, username, isMainnet = false } = await request.json();

    if (!paymentId || !txid) {
      return NextResponse.json(
        { error: 'Payment ID and transaction ID are required' },
        { status: 400 }
      );
    }

    console.log('🔄 Completing payment and registration:', {
      paymentId,
      txid,
      userId,
      username,
      walletAddress,
      isMainnet,
      network: isMainnet ? 'MAINNET' : 'TESTNET'
    });

    // Get the correct API key based on network
    const apiKey = isMainnet 
      ? process.env.PI_API_KEY_MAINNET 
      : process.env.PI_API_KEY_TESTNET;

    if (!apiKey) {
      console.error(`❌ Pi API Key not configured for ${isMainnet ? 'mainnet' : 'testnet'}`);
      return NextResponse.json(
        { error: `Pi API Key not configured for ${isMainnet ? 'mainnet' : 'testnet'}` },
        { status: 500 }
      );
    }

    console.log(`🔑 Using API key for completion: ${apiKey.slice(0, 8)}...${apiKey.slice(-8)}`);

    // Complete the payment on Pi Platform and get payment details
    const completedPayment = await piService.completePayment(paymentId, txid, apiKey);
    
    // Extract the actual Pi wallet address from the payment (user_uid is the user's wallet address)
    const actualWalletAddress = completedPayment?.user_uid || walletAddress;
    console.log(`💰 Payment completed - User wallet: ${actualWalletAddress}, App wallet: ${completedPayment?.to_address}`);

    // Create registration record
    const registrationId = `CEXY_${username.toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;
    
    // Store registration data (this should be in a database in production)
    const registrationData = {
      registrationId,
      userId,
      username,
      walletAddress: actualWalletAddress, // Use actual Pi wallet address
      paymentId,
      transactionId: txid,
      status: 'completed',
      timestamp: Date.now(),
      type: 'beta_registration'
    };

    // Add to metrics database for real-time tracking
    addRegistration({
      registrationId,
      username,
      userId,
      walletAddress: actualWalletAddress, // Use actual Pi wallet address
      transactionId: txid,
      paymentId,
      amount: 0.01 // Pi registration cost
    });

    console.log('✅ Registration completed and added to metrics:', registrationData);

    return NextResponse.json({
      success: true,
      message: `Registration completed successfully for @${username}`,
      registrationId,
      transactionId: txid,
      status: 'completed'
    });

  } catch (error: any) {
    console.error('Payment completion error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to complete payment and registration',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
