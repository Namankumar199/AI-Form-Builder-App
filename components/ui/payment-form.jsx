"use client"
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { CreditCard, Lock, DollarSign } from 'lucide-react';
import { LoadingSpinner } from './loading';
import { createPaymentIntent, processPayment, validatePaymentForm } from '@/lib/paymentService';
import { toast } from 'sonner';

export const PaymentForm = ({ 
  amount, 
  formData, 
  formId, 
  onPaymentSuccess, 
  onPaymentError,
  className = "" 
}) => {
  const [paymentData, setPaymentData] = useState({
    name: formData.name || '',
    email: formData.email || '',
    amount: amount
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    const validation = validatePaymentForm(paymentData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create payment intent
      const { paymentIntent } = await createPaymentIntent(amount);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process payment
      const result = await processPayment({
        paymentIntentId: paymentIntent.id,
        amount,
        formId
      }, formData);

      if (result.success) {
        toast.success('Payment successful! Thank you for your submission.');
        onPaymentSuccess?.(result);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      onPaymentError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`max-w-md mx-auto border-2 border-green-200 ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Complete Payment
        </CardTitle>
        <CardDescription>
          Secure payment to submit your form
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount:</span>
              <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
                <DollarSign className="h-5 w-5" />
                {amount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <Input
              type="text"
              value={paymentData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={errors.name ? 'border-red-300' : 'border-gray-300'}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <Input
              type="email"
              value={paymentData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className={errors.email ? 'border-red-300' : 'border-gray-300'}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Mock Card Details */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Payment Details (Demo)
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="1234 5678 9012 3456" disabled />
              <Input placeholder="12/25" disabled />
            </div>
            <Input placeholder="123" disabled />
            
            <p className="text-xs text-gray-500">
              🔒 This is a demo. No real payment will be processed.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Your payment information is secure and encrypted
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};