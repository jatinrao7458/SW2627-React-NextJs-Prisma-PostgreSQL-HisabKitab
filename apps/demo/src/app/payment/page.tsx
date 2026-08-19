'use client';

import { useState } from 'react';

export default function PaymentDemo() {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [amount, setAmount] = useState(999); // $9.99

  const handleCheckout = async () => {
    setLoading(true);
    setPaymentStatus(null);
    try {
      // 1. Create Payment Intent
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'usd' }),
      });
      const data = await res.json();
      
      if (data.success) {
        // 2. Simulate User entering card details and confirming payment
        setPaymentStatus('Payment Intent Created. Awaiting Payment...');
        
        setTimeout(() => {
          setPaymentStatus('Processing Payment via Mocked Gateway...');
          
          setTimeout(() => {
            setPaymentStatus('Payment Successful! Payment ID: ' + data.paymentId);
          }, 1500);
          
        }, 1500);
      }
    } catch (error) {
      console.error('Checkout failed', error);
      setPaymentStatus('Checkout failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Payment Gateway Integration (Mocked)</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-black max-w-md mx-auto border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Checkout</h2>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Premium Plan (Monthly)</span>
            <span className="font-semibold">${(amount / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Taxes</span>
            <span>$0.00</span>
          </div>
          <div className="border-t my-2 pt-2 flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span>${(amount / 100).toFixed(2)}</span>
          </div>
        </div>
        
        <button
          onClick={handleCheckout}
          disabled={loading || paymentStatus?.includes('Successful')}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Initializing...' : 'Pay Now'}
        </button>

        {paymentStatus && (
          <div className={`mt-6 p-4 rounded-lg text-center ${paymentStatus.includes('Successful') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
            <p className="font-medium">{paymentStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
}
