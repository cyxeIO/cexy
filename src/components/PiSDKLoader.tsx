"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function PiSDKLoader() {
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined') return;
    
    // Check for network preference from localStorage
    const networkPreference = localStorage.getItem('cexy_network_preference');
    const isMainnet = networkPreference ? networkPreference === 'mainnet' : (process.env.NODE_ENV === 'production');
    
    // Get the appropriate API key for the network
    const apiKey = isMainnet 
      ? process.env.NEXT_PUBLIC_PI_API_KEY_MAINNET
      : process.env.NEXT_PUBLIC_PI_API_KEY_TESTNET;
    
    // Set environment variables for Pi SDK with proper sandbox configuration and API key
    (window as any).__ENV = {
      backendURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
      sandbox: !isMainnet,  // sandbox = true for testnet
      testnet: !isMainnet,  // testnet = true for testnet
      apiKey: apiKey       // Use the correct API key for the network
    };
    
    console.log('🔧 Pi SDK Environment Configuration:', {
      network: isMainnet ? 'MAINNET' : 'TESTNET',
      sandbox: !isMainnet,
      testnet: !isMainnet,
      apiKey: apiKey ? `${apiKey.slice(0, 8)}...${apiKey.slice(-8)}` : 'NOT SET',
      config: {
        ...((window as any).__ENV),
        apiKey: apiKey ? `${apiKey.slice(0, 8)}...${apiKey.slice(-8)}` : 'NOT SET'
      }
    });
    
    // Set a timeout to check if Pi SDK is available - NO MOCK FALLBACK
    const checkTimeout = setTimeout(() => {
      if (!(window as any).Pi && isLoading) {
        console.error('❌ Pi SDK not available - REAL Pi Browser required for mainnet!');
        console.error('� Please open this app in the official Pi Browser to access Pi Network features');
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('piSDKError', { 
            detail: { 
              message: 'Pi SDK not available. This app requires the official Pi Browser for mainnet functionality.',
              requiresPiBrowser: true,
              mainnetOnly: true
            }
          }));
        }
      }
    }, 10000); // Increased timeout for real Pi SDK

    return () => clearTimeout(checkTimeout);
  }, [isLoading]);

  const handlePiSDKLoad = () => {
    const env = (window as any).__ENV;
    const isMainnet = !env?.sandbox && !env?.testnet;
    
    console.log(`🔄 Pi SDK script loaded successfully - ${isMainnet ? 'MAINNET' : 'TESTNET'} MODE`);
    console.log('🔍 Environment details:', env);
    setIsLoading(false);
    
    if ((window as any).Pi && (window as any).__ENV) {
      const config = {
        version: process.env.NEXT_PUBLIC_PI_SDK_VERSION || "2.0",
        sandbox: env?.sandbox || false,
        apiKey: env?.apiKey
      };
      
      try {
        const isMainnet = !config.sandbox;
        console.log(`🔄 Initializing Pi SDK for ${isMainnet ? 'MAINNET' : 'TESTNET'}:`, {
          ...config,
          apiKey: config.apiKey ? `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-8)}` : 'NOT SET'
        });
        console.log('🔍 Full configuration:', { 
          env, 
          config: {
            ...config,
            apiKey: config.apiKey ? `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-8)}` : 'NOT SET'
          }, 
          sandbox: config.sandbox 
        });
        
        (window as any).Pi.init(config);
        console.log(`✅ Pi SDK initialized successfully for ${isMainnet ? 'MAINNET' : 'TESTNET'}`);
        console.log('Available Pi methods:', Object.keys((window as any).Pi));
        
        // Dispatch a custom event to notify when Pi SDK is ready
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('piSDKReady', { 
            detail: { 
              config: {
                ...config,
                apiKey: config.apiKey ? `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-8)}` : 'NOT SET'
              }, 
              methods: Object.keys((window as any).Pi),
              ready: true,
              mock: false,
              mainnet: isMainnet,
              testnet: !isMainnet,
              sandbox: config.sandbox,
              network: isMainnet ? "Pi Network Mainnet" : "Pi Network Testnet",
              timestamp: new Date().toISOString()
            } 
          }));
        }
      } catch (error) {
        console.error('❌ Failed to initialize Pi SDK:', error);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('piSDKError', { detail: error }));
        }
      }
    } else {
      console.error('❌ Pi SDK or environment not available after load');
      console.error('� Check sandbox mode configuration and API keys');
    }
  };

  const handlePiSDKError = (error: any) => {
    console.error('❌ Failed to load Pi SDK script:', error);
    console.error('� Check network connection and sandbox configuration');
    setLoadAttempts(prev => prev + 1);
    setIsLoading(false);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('piSDKError', { 
        detail: {
          ...error,
          message: 'Failed to load Pi SDK. Check network connection and configuration.'
        }
      }));
    }
  };

  return (
    <Script 
      src="https://sdk.minepi.com/pi-sdk.js" 
      strategy="afterInteractive"
      onLoad={handlePiSDKLoad}
      onError={handlePiSDKError}
    />
  );
}
