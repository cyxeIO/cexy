import axios from 'axios';

// Pi Platform API client
const platformAPIClient = axios.create({
  baseURL: 'https://api.minepi.com',
  timeout: 30000,
  headers: { 
    'Authorization': `Key ${process.env.PI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
platformAPIClient.interceptors.response.use(
  response => {
    console.log('✅ Pi API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('❌ Pi API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export interface PiUser {
  uid: string;
  username: string;
}

export interface PiAuthResult {
  accessToken: string;
  user: PiUser;
}

export interface PaymentDTO {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  metadata: object;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export interface PiWalletValidation {
  isValid: boolean;
  address?: string;
  error?: string;
}

export interface PiRegistrationData {
  walletAddress: string;
  userId: string;
  username: string;
  transactionId?: string;
  timestamp: number;
  authResult: PiAuthResult;
  registrationId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface PiRegistrationStatus {
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  message?: string;
  registrationId?: string;
}

// In-memory storage for demo purposes - replace with database in production
const registrations = new Map<string, PiRegistrationData>();
const incompletePayments = new Map<string, PaymentDTO>();

class PiService {
  private isInitialized: boolean = false;

  async initialize(): Promise<void> {
    try {
      if (!process.env.PI_API_KEY) {
        console.warn('Pi API key not configured - using mock implementation');
      }
      
      this.isInitialized = true;
      console.log('Pi Network service initialized');
    } catch (error) {
      console.error('Failed to initialize Pi Network service:', error);
      throw error;
    }
  }

  // Validate Pi wallet address format
  validateWalletAddress(address: string): PiWalletValidation {
    try {
      // Pi wallet addresses are typically 56 characters starting with 'G'
      const piWalletRegex = /^G[A-Z2-7]{55}$/;
      
      if (!address || address.trim().length === 0) {
        return {
          isValid: false,
          error: 'Wallet address is required'
        };
      }

      if (!piWalletRegex.test(address)) {
        return {
          isValid: false,
          error: 'Invalid Pi wallet address format. Must be 56 characters starting with G.'
        };
      }

      return {
        isValid: true,
        address: address
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Failed to validate wallet address'
      };
    }
  }

  // Verify user authentication with Pi Platform API
  async verifyAuthentication(accessToken: string): Promise<PiUser | null> {
    try {
      const response = await platformAPIClient.get('/v2/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      return response.data;
    } catch (error) {
      console.error('Authentication verification failed:', error);
      // Don't fall back - require real authentication
      return null;
    }
  }

  // Register user for beta access
  async registerUser(authResult: PiAuthResult, walletAddress: string): Promise<PiRegistrationData> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Validate wallet address
      const validation = this.validateWalletAddress(walletAddress);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Verify authentication with Pi Platform API
      const verifiedUser = await this.verifyAuthentication(authResult.accessToken);
      if (!verifiedUser) {
        throw new Error('Authentication verification failed - please ensure you are properly authenticated with Pi Network');
      }

      console.log('User verification successful:', verifiedUser);

      // Check if user is already registered
      const existingRegistration = Array.from(registrations.values())
        .find(reg => reg.userId === authResult.user.uid || reg.walletAddress === walletAddress);

      if (existingRegistration) {
        throw new Error('User or wallet address already registered');
      }

      // Create registration
      const registrationData: PiRegistrationData = {
        walletAddress,
        userId: authResult.user.uid,
        username: authResult.user.username,
        timestamp: Date.now(),
        authResult,
        registrationId: this.generateRegistrationId(),
        status: 'pending'
      };

      // Store registration
      registrations.set(authResult.user.uid, registrationData);

      // Simulate blockchain transaction
      setTimeout(() => {
        const reg = registrations.get(authResult.user.uid);
        if (reg) {
          reg.status = 'completed';
          reg.transactionId = this.generateTransactionHash();
          registrations.set(authResult.user.uid, reg);
          console.log(`Registration completed for user: ${authResult.user.username}`);
        }
      }, 3000);

      console.log(`Beta registration created for user: ${authResult.user.username}`);
      return registrationData;
    } catch (error) {
      console.error('User registration failed:', error);
      throw error;
    }
  }

  // Get registration status
  async getRegistrationStatus(userId: string): Promise<PiRegistrationStatus | null> {
    try {
      const registration = registrations.get(userId);
      if (!registration) {
        return null;
      }

      return {
        status: registration.status,
        transactionId: registration.transactionId,
        registrationId: registration.registrationId,
        message: this.getStatusMessage(registration.status)
      };
    } catch (error) {
      console.error('Failed to get registration status:', error);
      return null;
    }
  }

  // Handle incomplete payment
  async handleIncompletePayment(payment: PaymentDTO): Promise<void> {
    try {
      const paymentId = payment.identifier;
      const txid = payment.transaction?.txid;
      const txURL = payment.transaction?._link;

      console.log('Handling incomplete payment:', paymentId);

      if (!txid || !txURL) {
        throw new Error('Payment transaction data missing');
      }

      // Verify transaction on Pi blockchain
      const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL);
      const paymentIdOnBlock = horizonResponse.data.memo;

      if (paymentIdOnBlock !== paymentId) {
        throw new Error('Payment ID mismatch');
      }

      // Complete the payment
      await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, { txid });
      
      console.log(`Completed incomplete payment: ${paymentId}`);
    } catch (error) {
      console.error('Failed to handle incomplete payment:', error);
      throw error;
    }
  }

  // Approve payment
  async approvePayment(paymentId: string, apiKey?: string): Promise<void> {
    try {
      // Determine which API key to use based on environment
      let keyToUse: string;
      if (apiKey) {
        keyToUse = apiKey;
      } else {
        // Default to testnet for development, mainnet for production
        keyToUse = process.env.PI_API_KEY_TESTNET || process.env.PI_API_KEY || '';
      }
      
      if (!keyToUse) {
        throw new Error('Pi API Key not configured. Please check your environment variables.');
      }

      console.log(`🔄 Attempting to approve payment: ${paymentId}`);
      console.log(`🔑 Using API Key: ${keyToUse.substring(0, 10)}...`);
      console.log(`🌐 API Endpoint: https://api.minepi.com/v2/payments/${paymentId}/approve`);
      
      // Create a custom client with the specific API key for this request
      const customClient = axios.create({
        baseURL: 'https://api.minepi.com',
        timeout: 20000, // Reduced timeout for faster failure detection
        headers: { 
          'Authorization': `Key ${keyToUse}`,
          'Content-Type': 'application/json'
        }
      });
      
      const response = await customClient.post(`/v2/payments/${paymentId}/approve`);
      
      console.log(`✅ Successfully approved payment: ${paymentId}`, response.data);
    } catch (error: any) {
      console.error(`❌ Failed to approve payment ${paymentId}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Provide specific error messages for common issues
      if (error.response?.status === 404) {
        const errorData = error.response.data;
        if (errorData?.error === 'payment_not_found') {
          throw new Error('Payment not found - it may have expired or already been processed. Please try creating a new payment.');
        }
      } else if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.error === 'payment_already_approved') {
          console.log('✅ Payment was already approved - this is expected');
          return; // Don't throw error for already approved payments
        }
      } else if (error.response?.status === 401) {
        throw new Error('Invalid API key - please check your Pi Network configuration.');
      }
      
      // Re-throw with more context
      throw new Error(`Payment approval failed: ${error.response?.data?.error_message || error.response?.data?.message || error.message}`);
    }
  }

  // Complete payment
  async completePayment(paymentId: string, txid: string, apiKey?: string): Promise<PaymentDTO | null> {
    try {
      const keyToUse = apiKey || process.env.PI_API_KEY_TESTNET; // Default to testnet if no key provided
      
      if (!keyToUse) {
        throw new Error('Pi API Key not configured for payment completion');
      }

      console.log(`🔄 Attempting to complete payment: ${paymentId} with txid: ${txid}`);
      console.log(`🔑 Using API Key: ${keyToUse.substring(0, 10)}...`);

      // Create a custom client with the specific API key for this request
      const customClient = axios.create({
        baseURL: 'https://api.minepi.com',
        timeout: 30000,
        headers: { 
          'Authorization': `Key ${keyToUse}`,
          'Content-Type': 'application/json'
        }
      });

      const response = await customClient.post(`/v2/payments/${paymentId}/complete`, { txid });
      console.log(`✅ Successfully completed payment: ${paymentId}`);
      
      // Return the payment details from the response
      return response.data?.payment || null;
    } catch (error: any) {
      // Handle "already_completed" as a success case, not an error
      if (error.response?.data?.error === 'already_completed') {
        console.log(`✅ Payment ${paymentId} already completed - this is expected behavior`);
        // Return the payment details from the error response if available
        return error.response?.data?.payment || null;
      }

      console.error('❌ Failed to complete payment:', {
        paymentId,
        txid,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(`Payment completion failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Cancel payment
  async cancelPayment(paymentId: string): Promise<void> {
    try {
      await platformAPIClient.post(`/v2/payments/${paymentId}/cancel`);
      console.log(`Cancelled payment: ${paymentId}`);
    } catch (error) {
      console.error('Failed to cancel payment:', error);
      throw error;
    }
  }

  private generateRegistrationId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `CEXY_${timestamp}_${random}`.toUpperCase();
  }

  private generateTransactionHash(): string {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  private getStatusMessage(status: string): string {
    switch (status) {
      case 'pending':
        return 'Registration is being processed on the Pi blockchain...';
      case 'completed':
        return 'Successfully registered for CEXY beta access!';
      case 'failed':
        return 'Registration failed. Please try again.';
      default:
        return 'Unknown status';
    }
  }

  // Get all registrations (for admin purposes)
  getAllRegistrations(): PiRegistrationData[] {
    return Array.from(registrations.values());
  }

  // Check if user is registered
  isUserRegistered(userId: string): boolean {
    return registrations.has(userId);
  }

  // Get user registration
  getUserRegistration(userId: string): PiRegistrationData | null {
    return registrations.get(userId) || null;
  }
}

// Export singleton instance
export const piService = new PiService();

// Export the platform API client for direct use
export { platformAPIClient };
