'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CompactMetricsData {
  totalRegistrations: number;
  todayRegistrations: number;
  totalPiVolume: number;
}

export default function CompactMetrics() {
  const [metrics, setMetrics] = useState<CompactMetricsData>({
    totalRegistrations: 0,
    todayRegistrations: 0,
    totalPiVolume: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      const result = await response.json();
      
      if (result.success) {
        setMetrics({
          totalRegistrations: result.data.totalRegistrations,
          todayRegistrations: result.data.todayRegistrations,
          totalPiVolume: result.data.totalPiVolume
        });
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center space-x-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">Loading live data...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between space-x-6">
        {/* Live Indicator */}
        <div className="flex items-center space-x-2">
          <motion.div 
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          <span className="text-xs text-gray-400 font-medium">LIVE</span>
        </div>

        {/* Metrics */}
        <div className="flex items-center space-x-6">
          {/* Total Registrations */}
          <div className="text-center">
            <motion.div 
              className="text-lg font-bold text-white"
              key={metrics.totalRegistrations}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {metrics.totalRegistrations}
            </motion.div>
            <div className="text-xs text-gray-400">Beta Users</div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10"></div>

          {/* Today's Registrations */}
          <div className="text-center">
            <motion.div 
              className="text-lg font-bold text-purple-400"
              key={metrics.todayRegistrations}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {metrics.todayRegistrations}
            </motion.div>
            <div className="text-xs text-gray-400">Today</div>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10"></div>

          {/* Pi Volume */}
          <div className="text-center">
            <motion.div 
              className="text-lg font-bold text-cyan-400"
              key={metrics.totalPiVolume}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {metrics.totalPiVolume} π
            </motion.div>
            <div className="text-xs text-gray-400">Volume</div>
          </div>
        </div>

        {/* Refresh Indicator */}
        <motion.div
          className="text-xs text-gray-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Auto-refresh
        </motion.div>
      </div>
    </motion.div>
  );
}
