import React from 'react';

// Test component to verify Tailwind CSS 3.4 features are working
export default function TailwindTest() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Tailwind CSS 3.4 Test</h2>
      
      {/* Test modern gradient features */}
      <div className="bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 p-4 rounded-xl">
        <p className="text-white">Modern gradient with opacity modifiers</p>
      </div>
      
      {/* Test backdrop filters */}
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <p className="text-white">Backdrop blur with glass morphism effect</p>
      </div>
      
      {/* Test container queries support */}
      <div className="@container">
        <div className="@lg:bg-green-500/20 bg-red-500/20 p-4 rounded-xl">
          <p className="text-white">Container query test (should be green on larger containers)</p>
        </div>
      </div>
      
      {/* Test arbitrary value support */}
      <div className="bg-[#ff6b6b]/30 p-4 rounded-[20px] border-[3px] border-[#4ecdc4]/50">
        <p className="text-white">Arbitrary values test</p>
      </div>
      
      {/* Test modern shadows */}
      <div className="bg-white/5 p-4 rounded-xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow">
        <p className="text-white">Modern shadow effects</p>
      </div>
    </div>
  );
}
