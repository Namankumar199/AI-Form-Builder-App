import { NextResponse } from 'next/server';
import { db } from '@/configs';
import { userResponse } from '@/configs/schema';
import moment from 'moment';

export async function POST(request) {
  try {
    const { paymentIntentId, amount, formData, formId } = await request.json();
    
    // Validate payment (in production, verify with payment provider)
    if (!paymentIntentId || !amount || !formData) {
      return NextResponse.json(
        { error: 'Missing required payment data' },
        { status: 400 }
      );
    }

    // Mock payment verification
    const paymentVerified = true; // In production: verify with Stripe/PayPal/etc.
    
    if (!paymentVerified) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Save form response with payment info
    const result = await db.insert(userResponse).values({
      jsonResponse: JSON.stringify({
        ...formData,
        paymentInfo: {
          paymentIntentId,
          amount,
          currency: 'usd',
          status: 'paid',
          paidAt: new Date().toISOString()
        }
      }),
      createdBy: formData.email || 'anonymous',
      createdAt: moment().format('DD/MM/YYYY'),
      formRef: formId
    });

    console.log('💰 Payment Processed:', { paymentIntentId, amount, formId });
    
    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      responseId: result[0]?.id
    });
    
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}