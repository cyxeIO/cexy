import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { error: 'Test endpoint failed' },
      { status: 500 }
    );
  }
}
