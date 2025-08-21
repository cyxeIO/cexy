'use client';

import { useState, useEffect } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function TestPage() {
  const [piStatus, setPiStatus] = useState<string>('Checking...');
  const [piDetails, setPiDetails] = useState<any>(null);
  const [piConfig, setPiConfig] = useState<any>(null);

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') return;
    
    // Check Pi SDK status
    const checkPiSDK = () => {
      if ((window as any).Pi) {
        setPiStatus('✅ Pi SDK Loaded');
        setPiDetails({
          available: !!(window as any).Pi,
          methods: Object.keys((window as any).Pi || {})
        });
      } else {
        setPiStatus('❌ Pi SDK Not Found');
        setTimeout(checkPiSDK, 1000);
      }
    };

    checkPiSDK();

    // Listen for Pi SDK ready event
    const handlePiSDKReady = (event: any) => {
      setPiStatus('✅ Pi SDK Ready');
      setPiConfig(event.detail);
      checkPiSDK();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('piSDKReady', handlePiSDKReady);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('piSDKReady', handlePiSDKReady);
      }
    };
  }, []);

  const testPiAuth = async () => {
    if (typeof window === 'undefined' || !(window as any).Pi) {
      alert('Pi SDK not available');
      return;
    }

    try {
      const result = await (window as any).Pi.authenticate(['username'], () => {});
      alert(`Success! Username: ${result.user.username}`);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center gradient-text mb-8">
          Tailwind CSS Test Page
        </h1>
        
        {/* Basic Tailwind Classes Test */}
        <div className="glass p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">
            Basic Tailwind Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-purple-600 p-4 rounded">Purple Background</div>
            <div className="bg-pink-500 p-4 rounded">Pink Background</div>
            <div className="bg-blue-500 p-4 rounded">Blue Background</div>
          </div>
        </div>

        {/* Custom Classes Test */}
        <div className="card-glass p-6">
          <h2 className="text-2xl font-semibold mb-4 gradient-text-purple">
            Custom Glass Card
          </h2>
          <p className="text-gray-300 mb-4">
            This card should have a glass morphism effect with backdrop blur.
          </p>
          <button className="btn-primary px-6 py-3 rounded-lg">
            Primary Button
          </button>
        </div>

        {/* Input Test */}
        <div className="glass-dark p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Input Components
          </h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Test input with glass effect"
              className="input-glass w-full px-4 py-3 rounded-lg"
            />
            <textarea 
              placeholder="Test textarea"
              className="input-glass w-full px-4 py-3 rounded-lg h-24 resize-none"
            />
          </div>
        </div>

        {/* Gradient Text Test */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold gradient-text">
            Gradient Text Effect
          </h2>
          <p className="text-xl gradient-text-purple">
            Purple Gradient Text
          </p>
        </div>

        {/* Animation Test */}
        <div className="glass p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Animation Tests
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-purple-600 p-4 rounded animate-pulse">
              Pulse Animation
            </div>
            <div className="bg-pink-500 p-4 rounded animate-bounce">
              Bounce Animation
            </div>
            <div className="bg-blue-500 p-4 rounded animate-spin">
              Spin Animation
            </div>
          </div>
        </div>

        {/* Responsive Test */}
        <div className="glass p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Responsive Test
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-green-500 p-4 rounded text-center">1</div>
            <div className="bg-yellow-500 p-4 rounded text-center">2</div>
            <div className="bg-red-500 p-4 rounded text-center">3</div>
            <div className="bg-indigo-500 p-4 rounded text-center">4</div>
          </div>
        </div>

        {/* Pi SDK Test */}
        <div className="glass p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
            Pi SDK Test
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Status:</span>
              <span className={piStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}>
                {piStatus}
              </span>
            </div>
            
            {piDetails && (
              <div className="bg-gray-800 p-4 rounded text-sm space-y-2">
                <div><strong>Available:</strong> {piDetails.available ? 'Yes' : 'No'}</div>
                <div><strong>Methods:</strong> {piDetails.methods.join(', ')}</div>
                {piConfig && (
                  <>
                    <div><strong>Sandbox Mode:</strong> {piConfig.config?.sandbox ? 'Yes' : 'No'}</div>
                    <div><strong>SDK Version:</strong> {piConfig.config?.version || 'Unknown'}</div>
                    <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
                    <div><strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL}</div>
                  </>
                )}
              </div>
            )}
            
            <button 
              onClick={testPiAuth}
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={typeof window === 'undefined' ? true : !(window as any).Pi}
            >
              <img src="/pi_logo.png" alt="Pi Network" className="w-5 h-5" />
              Test Pi Authentication
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-center">
          <div className="inline-block bg-green-500 text-black px-4 py-2 rounded-full font-semibold">
            ✅ If you can see this styled correctly, Tailwind is working!
          </div>
        </div>
      </div>
    </div>
  );
}
