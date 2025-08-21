// Type definitions for Pi SDK
export interface PiUser {
  uid: string;
  username: string;
}

export interface PiAuthResult {
  accessToken: string;
  user: PiUser;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: object;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: any) => void;
}

export interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: object;
  to_address: string;
  created_at: string;
  network: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound?: (payment: PiPayment) => void
      ) => Promise<PiAuthResult>;
      createPayment: (
        paymentData: PiPaymentData,
        callbacks: PiPaymentCallbacks
      ) => Promise<PiPayment>;
      openShareDialog: (title: string, text: string) => Promise<void>;
    };
    __ENV?: {
      backendURL: string;
      sandbox: string;
    };
  }
}

export {};
