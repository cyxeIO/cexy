import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Testing Pi API configuration...');
    
    // Check if API key is configured
    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'PI_API_KEY not configured',
        environment: {
          nodeEnv: process.env.NODE_ENV,
          piApiKey: 'Missing',
          piSandboxMode: process.env.NEXT_PUBLIC_PI_SANDBOX_MODE,
          piTestnetMode: process.env.NEXT_PUBLIC_PI_TESTNET_MODE,
          backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL
        }
      }, { status: 500 });
    }

    console.log(`🔑 API Key configured: ${apiKey.substring(0, 10)}...`);
    
    // Test a simple API call to verify authentication
    try {
      const response = await fetch('https://api.minepi.com/v2/me', {
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const responseText = await response.text();
      console.log('Pi API Response:', response.status, responseText);

      return NextResponse.json({
        success: response.ok,
        message: response.ok ? 'Pi API connection successful' : 'Pi API authentication failed',
        environment: {
          nodeEnv: process.env.NODE_ENV,
          piApiKey: `${apiKey.substring(0, 10)}...`,
          piSandboxMode: process.env.NEXT_PUBLIC_PI_SANDBOX_MODE,
          piTestnetMode: process.env.NEXT_PUBLIC_PI_TESTNET_MODE,
          backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL
        },
        piApiTest: {
          status: response.status,
          statusText: response.statusText,
          response: responseText
        },
        timestamp: new Date().toISOString()
      });
    } catch (apiError: any) {
      console.error('❌ Pi API test failed:', apiError);
      
      return NextResponse.json({
        success: false,
        error: 'Pi API connection failed',
        environment: {
          nodeEnv: process.env.NODE_ENV,
          piApiKey: `${apiKey.substring(0, 10)}...`,
          piSandboxMode: process.env.NEXT_PUBLIC_PI_SANDBOX_MODE,
          piTestnetMode: process.env.NEXT_PUBLIC_PI_TESTNET_MODE,
          backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL
        },
        piApiError: apiError.message,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error: any) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Test endpoint failed',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test registration payload:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Test registration endpoint working',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test registration error:', error);
    return NextResponse.json(
      { error: 'Test registration failed' },
      { status: 500 }
    );
  }
}
