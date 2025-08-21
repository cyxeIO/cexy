import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Registration interface
interface Registration {
  registrationId: string;
  username: string;
  userId: string;
  walletAddress: string;
  transactionId: string;
  paymentId: string;
  amount: number;
  timestamp?: number;
}

// Clear user registrations (development only)
export async function POST(request: NextRequest) {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { userId, walletAddress, clearAll } = body;

    console.log('🧹 Clearing registration data:', { userId, walletAddress, clearAll });

    const registrationsPath = join(process.cwd(), 'registrations.json');
    
    if (!existsSync(registrationsPath)) {
      console.log('📁 No registrations file found, nothing to clear');
      return NextResponse.json({ 
        success: true, 
        message: 'No registrations file found',
        cleared: 0
      });
    }

    // Read current registrations
    const registrationsData = readFileSync(registrationsPath, 'utf8');
    let registrations = JSON.parse(registrationsData);
    const originalCount = registrations.length;

    if (clearAll) {
      // Clear all registrations (for dev reset)
      registrations = [];
      console.log(`🗑️ Cleared all ${originalCount} registrations`);
    } else {
      // Clear specific user registrations
      const beforeCount = registrations.length;
      registrations = registrations.filter((reg: Registration) => {
        // Remove registrations that match userId or walletAddress
        const shouldRemove = (userId && reg.userId === userId) || 
                           (walletAddress && reg.walletAddress === walletAddress);
        return !shouldRemove;
      });
      const clearedCount = beforeCount - registrations.length;
      console.log(`🗑️ Cleared ${clearedCount} registrations for user`);
    }

    // Write updated registrations back to file
    writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));

    return NextResponse.json({
      success: true,
      message: clearAll ? 'All registrations cleared' : 'User registrations cleared',
      originalCount,
      remainingCount: registrations.length,
      cleared: originalCount - registrations.length
    });

  } catch (error: any) {
    console.error('❌ Error clearing registrations:', error);
    return NextResponse.json(
      { error: `Failed to clear registrations: ${error.message}` },
      { status: 500 }
    );
  }
}
