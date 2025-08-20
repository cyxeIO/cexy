import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Health check endpoint called');
    
    // Test basic functionality
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      message: 'cexy.ai API is running'
    };
    
    console.log('Health check response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
