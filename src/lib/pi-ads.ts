/**
 * Pi Ads Service for CEXY
 * Handles interstitial and rewarded ads integration with Pi Network
 */

export interface ShowAdResponse {
  type: "interstitial" | "rewarded";
  result: "AD_CLOSED" | "AD_DISPLAY_ERROR" | "AD_NETWORK_ERROR" | "AD_NOT_AVAILABLE" | "AD_REWARDED" | "ADS_NOT_SUPPORTED" | "USER_UNAUTHENTICATED";
  adId?: string;
}

export interface IsAdReadyResponse {
  type: "interstitial" | "rewarded";
  ready: boolean;
}

export interface RequestAdResponse {
  type: "interstitial" | "rewarded";
  result: "AD_LOADED" | "AD_FAILED_TO_LOAD" | "AD_NOT_AVAILABLE";
}

export type AdType = "interstitial" | "rewarded";

export class PiAdsService {
  private static instance: PiAdsService;
  private adNetworkSupported: boolean | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): PiAdsService {
    if (!PiAdsService.instance) {
      PiAdsService.instance = new PiAdsService();
    }
    return PiAdsService.instance;
  }

  /**
   * Initialize the Pi Ads service and check for ad network support
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return this.adNetworkSupported === true;
    }

    try {
      // Check if Pi SDK is available
      if (typeof window === 'undefined' || !(window as any).Pi) {
        console.warn('⚠️ Pi SDK not available for ads');
        this.adNetworkSupported = false;
        return false;
      }

      // Check if ad network is supported on user's Pi Browser
      const nativeFeaturesList = await (window as any).Pi.nativeFeaturesList();
      this.adNetworkSupported = nativeFeaturesList.includes("ad_network");
      this.initialized = true;

      console.log('🔧 Pi Ads initialized:', {
        supported: this.adNetworkSupported,
        features: nativeFeaturesList
      });

      return this.adNetworkSupported === true;
    } catch (error) {
      console.error('❌ Failed to initialize Pi Ads:', error);
      this.adNetworkSupported = false;
      this.initialized = true;
      return false;
    }
  }

  /**
   * Check if ads are supported on the current Pi Browser
   */
  isAdNetworkSupported(): boolean {
    return this.adNetworkSupported === true;
  }

  /**
   * Check if a specific ad type is ready to display
   */
  async isAdReady(adType: AdType): Promise<IsAdReadyResponse | null> {
    if (!this.isAdNetworkSupported()) {
      return null;
    }

    try {
      return await (window as any).Pi.Ads.isAdReady(adType);
    } catch (error) {
      console.error(`❌ Failed to check if ${adType} ad is ready:`, error);
      return null;
    }
  }

  /**
   * Request an ad to be loaded
   */
  async requestAd(adType: AdType): Promise<RequestAdResponse | null> {
    if (!this.isAdNetworkSupported()) {
      return null;
    }

    try {
      return await (window as any).Pi.Ads.requestAd(adType);
    } catch (error) {
      console.error(`❌ Failed to request ${adType} ad:`, error);
      return null;
    }
  }

  /**
   * Show an interstitial ad (simple implementation)
   */
  async showInterstitialAd(): Promise<ShowAdResponse | null> {
    if (!this.isAdNetworkSupported()) {
      console.warn('⚠️ Ad network not supported');
      return null;
    }

    try {
      return await (window as any).Pi.Ads.showAd("interstitial");
    } catch (error) {
      console.error('❌ Failed to show interstitial ad:', error);
      return null;
    }
  }

  /**
   * Show an interstitial ad with advanced error handling
   */
  async showInterstitialAdAdvanced(): Promise<ShowAdResponse | null> {
    if (!this.isAdNetworkSupported()) {
      console.warn('⚠️ Ad network not supported');
      return null;
    }

    try {
      // Check if ad is ready
      const isReadyResponse = await this.isAdReady("interstitial");
      
      if (!isReadyResponse || !isReadyResponse.ready) {
        console.log('🔄 Interstitial ad not ready, requesting...');
        
        // Request new ad
        const requestResponse = await this.requestAd("interstitial");
        
        if (!requestResponse || requestResponse.result !== "AD_LOADED") {
          console.warn('⚠️ Failed to load interstitial ad:', requestResponse?.result);
          return null;
        }
      }

      // Show the ad
      const showResponse = await (window as any).Pi.Ads.showAd("interstitial");
      console.log('✅ Interstitial ad shown:', showResponse);
      
      return showResponse;
    } catch (error) {
      console.error('❌ Failed to show interstitial ad (advanced):', error);
      return null;
    }
  }

  /**
   * Show a rewarded ad and return the ad ID for verification
   */
  async showRewardedAd(): Promise<{ response: ShowAdResponse; adId?: string } | null> {
    if (!this.isAdNetworkSupported()) {
      console.warn('⚠️ Ad network not supported');
      return null;
    }

    try {
      // Check if ad is ready
      const isReadyResponse = await this.isAdReady("rewarded");
      
      if (!isReadyResponse || !isReadyResponse.ready) {
        console.log('🔄 Rewarded ad not ready, requesting...');
        
        // Request new ad
        const requestResponse = await this.requestAd("rewarded");
        
        if (!requestResponse) {
          return null;
        }
        
        if (requestResponse.result !== "AD_LOADED") {
          console.warn('⚠️ Failed to load rewarded ad:', requestResponse.result);
          return null;
        }
      }

      // Show the ad
      const showResponse = await (window as any).Pi.Ads.showAd("rewarded");
      console.log('✅ Rewarded ad shown:', showResponse);
      
      return {
        response: showResponse,
        adId: showResponse.adId
      };
    } catch (error) {
      console.error('❌ Failed to show rewarded ad:', error);
      return null;
    }
  }

  /**
   * Verify a rewarded ad with your backend
   * This should be implemented to call your backend verification endpoint
   */
  async verifyRewardedAd(adId: string): Promise<{ rewarded: boolean; reward?: any; error?: string }> {
    try {
      // Call your backend API to verify the ad
      const response = await fetch('/api/ads/verify-rewarded', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adId }),
      });

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Failed to verify rewarded ad:', error);
      return {
        rewarded: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const piAdsService = PiAdsService.getInstance();
