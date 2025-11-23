import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Checkout: React.FC = () => {
  const { cartTotal, placeOrder, clearCart } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    card: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await placeOrder({
        name: formData.name,
        email: formData.email,
        address: formData.address
    });
    
    setLoading(false);
    setSuccess(true);
    
    setTimeout(() => {
      navigate('/');
    }, 4000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-tea-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-stone-600 mb-6">Thank you for your purchase. Your soothing blends are on their way to {formData.address}.</p>
          <p className="text-sm text-stone-400">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-tea-900 mb-8 text-center">Secure Checkout</h1>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
            <div className="mb-8 pb-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-lg font-medium text-stone-700">Order Total</h3>
                <span className="text-2xl font-bold text-tea-800">${cartTotal.toFixed(2)}</span>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-tea-500 outline-none" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-tea-500 outline-none" placeholder="john@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Shipping Address</label>
              <input required name="address" value={formData.address} onChange={handleChange} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-tea-500 outline-none" placeholder="123 Tea Leaf Lane, Green City" />
            </div>

            <div className="pt-6 border-t border-stone-100">
              <h4 className="font-serif text-lg font-bold text-stone-800 mb-4">Payment Details</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Card Number</label>
                  <input required name="card" value={formData.card} onChange={handleChange} maxLength={19} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-tea-500 outline-none" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Expiry Date</label>
                    <input required name="expiry" value={formData.expiry} onChange={handleChange} maxLength={5} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-tea-500 outline-none" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">CVV</label>
                    <input required name="cvv" value={formData.cvv} onChange={handleChange} maxLength={3} className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-tea-500 outline-none" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-tea-700 text-white py-4 rounded-lg font-bold hover:bg-tea-800 transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...
                </>
              ) : (
                `Pay $${cartTotal.toFixed(2)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;