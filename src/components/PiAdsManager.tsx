"use client";

import React, { useState, useEffect } from 'react';
import { piAdsService, ShowAdResponse } from '@/lib/pi-ads';

interface PiAdsManagerProps {
  onAdReward?: (reward: any) => void;
  onAdError?: (error: string) => void;
  className?: string;
}

export default function PiAdsManager({ onAdReward, onAdError, className = "" }: PiAdsManagerProps) {
  const [adNetworkSupported, setAdNetworkSupported] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [showingAd, setShowingAd] = useState(false);
  const [interstitialReady, setInterstitialReady] = useState(false);
  const [rewardedReady, setRewardedReady] = useState(false);

  useEffect(() => {
    initializeAds();
  }, []);

  const initializeAds = async () => {
    try {
      setLoading(true);
      const supported = await piAdsService.initialize();
      setAdNetworkSupported(supported);
      
      if (supported) {
        // Check ad readiness
        await checkAdReadiness();
      }
    } catch (error) {
      console.error('Failed to initialize ads:', error);
      onAdError?.('Failed to initialize ads');
    } finally {
      setLoading(false);
    }
  };

  const checkAdReadiness = async () => {
    try {
      const [interstitialStatus, rewardedStatus] = await Promise.all([
        piAdsService.isAdReady("interstitial"),
        piAdsService.isAdReady("rewarded")
      ]);

      setInterstitialReady(interstitialStatus?.ready ?? false);
      setRewardedReady(rewardedStatus?.ready ?? false);
    } catch (error) {
      console.error('Failed to check ad readiness:', error);
    }
  };

  const handleShowInterstitial = async () => {
    if (!adNetworkSupported || showingAd) return;

    try {
      setShowingAd(true);
      const result = await piAdsService.showInterstitialAdAdvanced();
      
      if (result) {
        console.log('Interstitial ad result:', result);
        
        if (result.result === "AD_CLOSED") {
          // Ad was successfully shown and closed
          await checkAdReadiness(); // Refresh ad status
        } else {
          onAdError?.(`Interstitial ad error: ${result.result}`);
        }
      } else {
        onAdError?.('Failed to show interstitial ad');
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      onAdError?.('Error showing interstitial ad');
    } finally {
      setShowingAd(false);
    }
  };

  const handleShowRewarded = async () => {
    if (!adNetworkSupported || showingAd) return;

    try {
      setShowingAd(true);
      const result = await piAdsService.showRewardedAd();
      
      if (result && result.response.result === "AD_REWARDED") {
        console.log('Rewarded ad completed:', result);
        
        // Verify the ad with backend if adId is available
        if (result.adId) {
          const verification = await piAdsService.verifyRewardedAd(result.adId);
          
          if (verification.rewarded) {
            onAdReward?.(verification.reward || { type: 'ad_reward', value: 1 });
          } else {
            onAdError?.(verification.error || 'Ad verification failed');
          }
        } else {
          // No adId means app not approved for ad network, but still reward for testing
          onAdReward?.({ type: 'ad_reward', value: 1, verified: false });
        }
        
        await checkAdReadiness(); // Refresh ad status
      } else if (result) {
        onAdError?.(result.response.result);
      } else {
        onAdError?.('Failed to show rewarded ad');
      }
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      
      if (error instanceof Error && error.message === "ADS_NOT_SUPPORTED") {
        onAdError?.('Please update your Pi Browser to watch ads');
      } else {
        onAdError?.('Error showing rewarded ad');
      }
    } finally {
      setShowingAd(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-gray-300">Loading ads...</span>
      </div>
    );
  }

  if (!adNetworkSupported) {
    return (
      <div className={`p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg ${className}`}>
        <div className="flex items-center">
          <span className="text-yellow-400 text-sm">
            📱 Ads not supported on this Pi Browser version
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Please update your Pi Browser to access ad features
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Pi Ads</h3>
        <button
          onClick={checkAdReadiness}
          className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Interstitial Ad */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">Interstitial Ad</h4>
            <span className={`w-2 h-2 rounded-full ${interstitialReady ? 'bg-green-400' : 'bg-red-400'}`}></span>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Full-screen ad displayed between content
          </p>
          <button
            onClick={handleShowInterstitial}
            disabled={!interstitialReady || showingAd}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {showingAd ? 'Loading...' : 'Show Interstitial'}
          </button>
        </div>

        {/* Rewarded Ad */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">Rewarded Ad</h4>
            <span className={`w-2 h-2 rounded-full ${rewardedReady ? 'bg-green-400' : 'bg-red-400'}`}></span>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Watch ad to earn rewards in the app
          </p>
          <button
            onClick={handleShowRewarded}
            disabled={!rewardedReady || showingAd}
            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {showingAd ? 'Loading...' : 'Watch for Reward'}
          </button>
        </div>
      </div>

      {/* Ad Status */}
      <div className="text-xs text-gray-400 space-y-1">
        <div>Ad Network: {adNetworkSupported ? '✅ Supported' : '❌ Not Supported'}</div>
        <div>Interstitial: {interstitialReady ? '✅ Ready' : '⏳ Loading'}</div>
        <div>Rewarded: {rewardedReady ? '✅ Ready' : '⏳ Loading'}</div>
      </div>
    </div>
  );
}
