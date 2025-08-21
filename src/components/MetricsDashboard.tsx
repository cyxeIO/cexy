'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Coins, Clock, Activity } from 'lucide-react';

interface RegistrationMetrics {
  totalRegistrations: number;
  todayRegistrations: number;
  totalPiVolume: number;
  uniqueUsers: number;
  recentRegistrations: Array<{
    registrationId: string;
    username: string;
    timestamp: number;
    amount: number;
  }>;
  hourlyStats: Array<{
    hour: string;
    count: number;
  }>;
}

interface MetricsDashboardProps {
  className?: string;
}

export default function MetricsDashboard({ className = '' }: MetricsDashboardProps) {
  const [metrics, setMetrics] = useState<RegistrationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      const result = await response.json();
      
      if (result.success) {
        setMetrics(result.data);
        setLastUpdated(result.lastUpdated);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Update every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`}>
        <p className="text-gray-400 text-center">Failed to load metrics</p>
      </div>
    );
  }

  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Live Registration Metrics
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Live • Updated {formatTimeAgo(lastUpdated)}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">Total</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics.totalRegistrations.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Registered users</div>
        </motion.div>

        {/* Today's Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-xs font-medium text-green-300">Today</span>
          </div>
          <div className="text-2xl font-bold text-white">
            +{metrics.todayRegistrations}
          </div>
          <div className="text-xs text-gray-400">New today</div>
        </motion.div>

        {/* Pi Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-medium text-yellow-300">Volume</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {metrics.totalPiVolume} π
          </div>
          <div className="text-xs text-gray-400">Total Pi spent</div>
        </motion.div>

        {/* Unique Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border border-cyan-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-300">Active</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {((metrics.uniqueUsers / metrics.totalRegistrations) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">Success rate</div>
        </motion.div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-black/20 border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Recent Registrations</span>
        </div>
        
        <div className="space-y-2">
          {metrics.recentRegistrations.slice(0, 5).map((reg, index) => (
            <motion.div
              key={reg.registrationId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {reg.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">@{reg.username}</div>
                  <div className="text-xs text-gray-400">{reg.registrationId}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-yellow-400">{reg.amount} π</div>
                <div className="text-xs text-gray-400">{formatTimeAgo(reg.timestamp)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Blockchain Transparency Note */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-300">
          📊 All metrics are pulled directly from the Pi blockchain for complete transparency. 
          Registration data is immutable and publicly verifiable.
        </p>
      </div>
    </div>
  );
}
