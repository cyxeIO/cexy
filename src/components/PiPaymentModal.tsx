'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Shield, Clock, CheckCircle, XCircle, Copy, ExternalLink, Eye, EyeOff } from 'lucide-react';
import CexyLogo from './CexyLogo';

// Payment status type
type PaymentStatus = 'idle' | 'creating' | 'approving' | 'waiting' | 'completing' | 'success' | 'error';

interface PiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void; // Add retry handler
  amount: number;
  memo: string;
  status: PaymentStatus;
  error?: string;
  transactionDetails?: {
    transactionId?: string;
    paymentId?: string;
    registrationId?: string;
    walletAddress?: string;
    timestamp?: number;
    transactionHistory?: Array<{
      hash: string;
      status: string;
      timestamp: number;
      fee: number;
      blockHeight?: number;
      explorerUrl: string;
    }>;
    blockchainStatus?: string;
    blockchainVerified?: boolean;
    lastVerified?: string;
  };
}

export default function PiPaymentModal({ 
  isOpen, 
  onClose, 
  onRetry,
  amount, 
  memo, 
  status, 
  error,
  transactionDetails
}: PiPaymentModalProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showFullTxId, setShowFullTxId] = useState(false);
  const [showFullWallet, setShowFullWallet] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here if you have access to toast
    console.log('📋 Copied to clipboard:', text.slice(0, 50) + '...');
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return showFullWallet ? address : `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatTransactionId = (txId: string) => {
    if (!txId) return '';
    return showFullTxId ? txId : `${txId.slice(0, 8)}...${txId.slice(-8)}`;
  };

  useEffect(() => {
    if (status === 'waiting' || status === 'completing') {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeElapsed(0);
    }
  }, [status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'idle':
        return <Wallet className="w-8 h-8 text-gray-400" />;
      case 'creating':
        return <Wallet className="w-8 h-8 text-yellow-400 animate-pulse" />;
      case 'approving':
        return <Shield className="w-8 h-8 text-blue-400 animate-spin" />;
      case 'waiting':
        return <Clock className="w-8 h-8 text-orange-400 animate-pulse" />;
      case 'completing':
        return <Shield className="w-8 h-8 text-green-400 animate-spin" />;
      case 'success':
        return <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">✓</div>;
      case 'error':
        return <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">✗</div>;
      default:
        return <Wallet className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'idle':
        return 'Ready to create payment...';
      case 'creating':
        return 'Creating payment request...';
      case 'approving':
        return 'Approving payment on server...';
      case 'waiting':
        return 'Waiting for payment confirmation in Pi Wallet...';
      case 'completing':
        return 'Completing registration...';
      case 'success':
        return 'CEXY registration completed successfully!';
      case 'error':
        return error || 'Payment failed';
      default:
        return 'Processing payment...';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-gray-900 rounded-2xl border border-yellow-400/30 p-8 max-w-md w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 16, 16, 0.98), rgba(32, 32, 32, 0.98))',
              boxShadow: '0 20px 60px rgba(255, 215, 0, 0.2), 0 0 0 1px rgba(255, 215, 0, 0.1)'
            }}
          >
            {/* Close Button */}
            {(status === 'success' || status === 'error') && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            {/* CEXY + Pi Network Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <CexyLogo size="sm" animated={true} showText={false} />
                <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-yellow-400 rounded-full"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">π</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-yellow-400 to-orange-500 mb-1">
                CEXY Registration
              </h2>
              <p className="text-sm text-gray-400">Pi Network Payment</p>
            </div>

            {/* Payment Details */}
            <div className="bg-black/30 border border-yellow-400/20 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Amount:</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {amount} {process.env.NEXT_PUBLIC_PI_SANDBOX_MODE === 'true' ? 'Test-Pi' : 'Pi'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Memo:</span>
                <span className="text-white text-right max-w-48 break-words">{memo}</span>
              </div>
            </div>

            {/* Status Section */}
            <div className="text-center mb-6">
              <div className="mb-4">
                {getStatusIcon()}
              </div>
              
              <p className="text-lg text-white mb-2">
                {getStatusMessage()}
              </p>

              {(status === 'waiting' || status === 'completing') && (
                <div className="text-sm text-gray-400">
                  Elapsed: {formatTime(timeElapsed)}
                </div>
              )}

              {status === 'waiting' && (
                <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <p className="text-sm text-orange-300">
                    Please complete the payment in your Pi Wallet app. 
                    This window will automatically update when the payment is confirmed.
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-300">
                    {error || 'An error occurred during payment processing.'}
                  </p>
                </div>
              )}

              {status === 'success' && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-300 mb-3">
                      🎉 Your CEXY beta registration is now complete!
                    </p>
                  </div>

                  {transactionDetails && (
                    <div className="bg-black/40 border border-yellow-400/20 rounded-xl p-4 space-y-3">
                      <h4 className="text-lg font-semibold text-yellow-400 mb-3">Transaction Details</h4>
                      
                      {/* Registration ID */}
                      {transactionDetails.registrationId && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Registration ID:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-green-300 font-mono text-sm">{transactionDetails.registrationId}</span>
                            <button 
                              onClick={() => copyToClipboard(transactionDetails.registrationId!)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Payment ID */}
                      {transactionDetails.paymentId && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Payment ID:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-300 font-mono text-sm">{transactionDetails.paymentId}</span>
                            <button 
                              onClick={() => copyToClipboard(transactionDetails.paymentId!)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Transaction ID */}
                      {transactionDetails.transactionId && (
                        <div className="flex justify-between items-start">
                          <span className="text-gray-400 text-sm">Transaction ID:</span>
                          <div className="flex items-center gap-2 max-w-48">
                            <span className="text-yellow-300 font-mono text-sm break-all">
                              {formatTransactionId(transactionDetails.transactionId)}
                            </span>
                            <button 
                              onClick={() => setShowFullTxId(!showFullTxId)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {showFullTxId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => copyToClipboard(transactionDetails.transactionId!)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Wallet Address */}
                      {transactionDetails.walletAddress && (
                        <div className="flex justify-between items-start">
                          <span className="text-gray-400 text-sm">Wallet:</span>
                          <div className="flex items-center gap-2 max-w-48">
                            <span className="text-purple-300 font-mono text-sm break-all">
                              {formatAddress(transactionDetails.walletAddress)}
                            </span>
                            <button 
                              onClick={() => setShowFullWallet(!showFullWallet)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              {showFullWallet ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => copyToClipboard(transactionDetails.walletAddress!)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      {transactionDetails.timestamp && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Completed:</span>
                          <span className="text-gray-300 text-sm">
                            {new Date(transactionDetails.timestamp).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Blockchain Verification Status */}
                      {transactionDetails.blockchainVerified !== undefined && (
                        <div className="border-t border-gray-700/50 pt-4 mt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400 text-sm">Blockchain Status:</span>
                            <div className="flex items-center gap-2">
                              {transactionDetails.blockchainVerified ? (
                                <>
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <span className="text-green-400 font-semibold text-sm">Verified</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                  <span className="text-yellow-400 font-semibold text-sm">Pending</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {transactionDetails.lastVerified && (
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-500 text-xs">Last Verified:</span>
                              <span className="text-gray-300 text-xs">
                                {new Date(transactionDetails.lastVerified).toLocaleString()}
                              </span>
                            </div>
                          )}
                          
                          {transactionDetails.blockchainStatus && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 text-xs">Chain Status:</span>
                              <span className="text-cyan-300 text-xs capitalize">
                                {transactionDetails.blockchainStatus}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Transaction History */}
                      {transactionDetails.transactionHistory && transactionDetails.transactionHistory.length > 0 && (
                        <div className="border-t border-gray-700/50 pt-4 mt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400 text-sm">Blockchain History:</span>
                            <span className="text-gray-500 text-xs">
                              {transactionDetails.transactionHistory.length} transaction{transactionDetails.transactionHistory.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {transactionDetails.transactionHistory.slice(0, 3).map((tx, index) => (
                              <div key={tx.hash} className="bg-gray-800/50 rounded-lg p-3 text-xs">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-gray-400">#{index + 1}</span>
                                  <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                      tx.status === 'confirmed' ? 'bg-green-400' :
                                      tx.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                                    }`}></div>
                                    <span className={`text-xs capitalize ${
                                      tx.status === 'confirmed' ? 'text-green-400' :
                                      tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                      {tx.status}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-gray-500">Hash:</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-cyan-300 font-mono">
                                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                                    </span>
                                    <button 
                                      onClick={() => copyToClipboard(tx.hash)}
                                      className="text-gray-400 hover:text-white transition-colors"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                    <button 
                                      onClick={() => window.open(tx.explorerUrl, '_blank')}
                                      className="text-gray-400 hover:text-white transition-colors"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500">Time:</span>
                                  <span className="text-gray-300">
                                    {new Date(tx.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                
                                {tx.blockHeight && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Block:</span>
                                    <span className="text-gray-300">#{tx.blockHeight}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                            {transactionDetails.transactionHistory.length > 3 && (
                              <div className="text-center py-2">
                                <span className="text-gray-500 text-xs">
                                  +{transactionDetails.transactionHistory.length - 3} more transactions
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-700">
                        <div className="flex gap-2 mb-3">
                          {transactionDetails.transactionId && (
                            <a
                              href={`https://blockexplorer.minepi.com/tx/${transactionDetails.transactionId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-purple-300 text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View on Pi Explorer
                            </a>
                          )}
                          <button
                            onClick={() => {
                              const details = `Registration Details:\n\nRegistration ID: ${transactionDetails.registrationId}\nPayment ID: ${transactionDetails.paymentId}\nTransaction ID: ${transactionDetails.transactionId}\nWallet: ${transactionDetails.walletAddress}\nTimestamp: ${new Date(transactionDetails.timestamp || 0).toLocaleString()}\n\nPi Blockchain Explorer: https://blockexplorer.minepi.com/tx/${transactionDetails.transactionId}`;
                              copyToClipboard(details);
                            }}
                            className="flex-1 bg-gradient-to-r from-gray-600/20 to-gray-700/20 hover:from-gray-600/30 hover:to-gray-700/30 border border-gray-500/30 text-gray-300 text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <Copy className="w-3 h-3" />
                            Copy All Details
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          Save these details for your records. Your registration is permanently stored on the Pi blockchain.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {status !== 'success' && status !== 'error' && (
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <motion.div
                  className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: status === 'idle' ? '0%' :
                           status === 'creating' ? '25%' :
                           status === 'approving' ? '50%' :
                           status === 'waiting' ? '75%' :
                           status === 'completing' ? '95%' : '100%'
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            )}

            {/* Action Buttons */}
            {status === 'error' && (
              <div className="flex gap-3">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`${onRetry ? 'flex-1' : 'w-full'} bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors`}
                >
                  Close
                </button>
              </div>
            )}

            {status === 'success' && (
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105"
              >
                Continue to CEXY
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
