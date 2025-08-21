import { NextRequest, NextResponse } from 'next/server';
import { piService } from '@/lib/pi-service';

// Approve payments
export async function POST(request: NextRequest) {
  console.log('🔄 Payment approval endpoint called');
  
  try {
    const body = await request.json();
    console.log('📥 Payment approval request body:', body);
    
    const { paymentId, userId, username, isMainnet = false } = body;

    if (!paymentId) {
      console.error('❌ Missing paymentId in request');
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔄 Attempting to approve payment ${paymentId} for user ${username} (${userId})`);
    console.log(`🌐 Network mode: ${isMainnet ? 'MAINNET' : 'TESTNET'}`);

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

    console.log(`🔑 Using API key: ${apiKey.slice(0, 8)}...${apiKey.slice(-8)}`);

    await piService.approvePayment(paymentId, apiKey);

    console.log(`✅ Successfully approved payment ${paymentId}`);
    
    return NextResponse.json({
      success: true,
      message: `Approved payment ${paymentId}`,
      paymentId,
      userId,
      username,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Payment approval error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Determine appropriate status code and user-friendly message
    let statusCode = 500;
    let userMessage = error.message || 'Failed to approve payment';
    
    if (error.message.includes('payment_not_found') || error.message.includes('not found')) {
      statusCode = 404;
      userMessage = 'Payment expired or already processed. Please try creating a new payment.';
    } else if (error.message.includes('already_approved')) {
      statusCode = 200; // Treat as success since payment is approved
      return NextResponse.json({
        success: true,
        message: 'Payment was already approved',
        paymentId: request.json().then(body => body.paymentId),
        timestamp: new Date().toISOString()
      });
    } else if (error.message.includes('Invalid API key')) {
      statusCode = 401;
      userMessage = 'Invalid Pi Network API configuration. Please contact support.';
    }
    
    return NextResponse.json(
      { 
        error: userMessage,
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}
