import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment configuration
    const config = {
      api_key: process.env.PI_API_KEY ? 'Present' : 'Missing',
      api_key_length: process.env.PI_API_KEY?.length || 0,
      network_url: process.env.PI_NETWORK_URL || 'Not set',
      backend_url: process.env.NEXT_PUBLIC_BACKEND_URL || 'Not set',
      sandbox_mode: process.env.NEXT_PUBLIC_PI_SANDBOX_MODE || 'Not set',
      testnet_mode: process.env.NEXT_PUBLIC_PI_TESTNET_MODE || 'Not set',
      sdk_version: process.env.NEXT_PUBLIC_PI_SDK_VERSION || 'Not set'
    };

    // Test Pi API connectivity
    let apiTest = {
      status: 'Unknown',
      error: null as string | null
    };

    if (process.env.PI_API_KEY) {
      try {
        const response = await fetch('https://api.minepi.com/v2/me', {
          headers: {
            'Authorization': `Bearer ${process.env.PI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        apiTest = {
          status: response.ok ? 'Connected' : `HTTP ${response.status}`,
          error: response.ok ? null : await response.text()
        };
      } catch (error) {
        apiTest = {
          status: 'Connection Failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      configuration: config,
      api_connectivity: apiTest,
      recommendations: [
        config.api_key === 'Missing' ? '❌ Set PI_API_KEY in environment' : '✅ API key configured',
        config.sandbox_mode === 'false' ? '✅ Sandbox mode disabled (mainnet)' : '⚠️ Check sandbox mode setting',
        config.testnet_mode === 'false' ? '✅ Testnet mode disabled (mainnet)' : '⚠️ Check testnet mode setting',
        '📱 Ensure app is registered in Pi Developer Portal (develop.pi)',
        '🌐 Use official Pi Browser for authentication',
        '🔗 Verify validation-key.txt is accessible at /validation-key.txt'
      ]
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
