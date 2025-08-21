import { NextRequest, NextResponse } from 'next/server';
import { piService, type PaymentDTO } from '@/lib/pi-service';

// Handle incomplete payments
export async function POST(request: NextRequest) {
  try {
    const { payment } = await request.json();

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment data is required' },
        { status: 400 }
      );
    }

    await piService.handleIncompletePayment(payment as PaymentDTO);

    return NextResponse.json({
      success: true,
      message: `Handled incomplete payment ${payment.identifier}`
    });

  } catch (error: any) {
    console.error('Incomplete payment error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to handle incomplete payment' },
      { status: 500 }
    );
  }
}
