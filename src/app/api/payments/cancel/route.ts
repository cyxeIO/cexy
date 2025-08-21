import { NextRequest, NextResponse } from 'next/server';
import { piService } from '@/lib/pi-service';

// Cancel payments
export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    await piService.cancelPayment(paymentId);

    return NextResponse.json({
      success: true,
      message: `Cancelled payment ${paymentId}`
    });

  } catch (error: any) {
    console.error('Payment cancellation error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to cancel payment' },
      { status: 500 }
    );
  }
}
