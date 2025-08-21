import { NextRequest, NextResponse } from 'next/server';
import { getMetrics } from '@/lib/metricsService';

export async function GET(request: NextRequest) {
  try {
    // Get real metrics from the metrics service
    console.log('📊 Fetching metrics from service...');
    const metricsData = getMetrics();
    console.log('📊 Metrics data:', metricsData);
    
    return NextResponse.json({
      success: true,
      data: {
        totalRegistrations: metricsData.totalRegistrations,
        todayRegistrations: metricsData.todayRegistrations,
        totalPiVolume: metricsData.totalPiVolume,
        recentRegistrations: metricsData.recentRegistrations
      },
      lastUpdated: Date.now()
    });
    
  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch registration metrics' 
      },
      { status: 500 }
    );
  }
}
