import { NextRequest, NextResponse } from 'next/server';

// Simplified auth endpoint for testing
export async function GET(request: NextRequest) {
  try {
    console.log('Auth GET: Simple test');
    return NextResponse.json({
      success: true,
      message: 'Auth endpoint working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Auth endpoint failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Auth POST: Simple test');
    const body = await request.json();
    console.log('Request body:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Mock login successful',
      user: {
        id: 'test-user',
        displayName: 'Test User',
        piTokenBalance: 10.0
      }
    });
  } catch (error) {
    console.error('Auth POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Auth POST failed' },
      { status: 500 }
    );
  }
}
