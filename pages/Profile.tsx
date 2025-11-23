import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Package, User, Settings, LogOut, Save, Loader2, ShoppingBag, Truck, ExternalLink } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, orders, updateUser, logout } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  
  // Settings Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        password: currentUser.password
      });
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const myOrders = orders.filter(o => o.customerEmail === currentUser.email);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
        await updateUser(currentUser.id, formData);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
        setMessage({ text: 'Failed to update profile.', type: 'error' });
    } finally {
        setIsSaving(false);
    }
  };

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden sticky top-24">
                    <div className="p-6 bg-tea-900 text-white text-center">
                        <div className="w-16 h-16 bg-tea-700 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                            {currentUser.name.charAt(0)}
                        </div>
                        <h2 className="font-serif font-bold text-lg">{currentUser.name}</h2>
                        <p className="text-tea-300 text-xs">{currentUser.email}</p>
                    </div>
                    <nav className="p-2 space-y-1">
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === 'orders' ? 'bg-tea-50 text-tea-800' : 'text-stone-600 hover:bg-stone-50'}`}
                        >
                            <Package className="w-4 h-4" /> My Orders
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === 'settings' ? 'bg-tea-50 text-tea-800' : 'text-stone-600 hover:bg-stone-50'}`}
                        >
                            <Settings className="w-4 h-4" /> Account Settings
                        </button>
                        <div className="border-t border-stone-100 my-2 pt-2">
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-serif font-bold text-tea-900">Order History</h1>
                        {myOrders.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center border border-stone-100 shadow-sm">
                                <ShoppingBag className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-stone-800">No orders yet</h3>
                                <p className="text-stone-500 mb-6">You haven't placed any orders yet. Discover our collection!</p>
                                <button onClick={() => navigate('/shop')} className="bg-tea-600 text-white px-6 py-2 rounded-full font-bold hover:bg-tea-700 transition-colors">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myOrders.map(order => (
                                    <div key={order.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                                        <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex justify-between items-center flex-wrap gap-4">
                                            <div className="flex gap-6">
                                                <div>
                                                    <p className="text-xs text-stone-500 uppercase tracking-wider">Order Placed</p>
                                                    <p className="text-sm font-bold text-stone-700">{new Date(order.date).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-stone-500 uppercase tracking-wider">Total</p>
                                                    <p className="text-sm font-bold text-stone-700">${order.total.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                     <p className="text-xs text-stone-500 uppercase tracking-wider">Order #</p>
                                                     <p className="text-sm font-mono text-stone-700">{order.id}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                    order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="flex items-center gap-4">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md bg-stone-100" />
                                                        <div className="flex-grow">
                                                            <h4 className="font-bold text-stone-800 text-sm">{item.name}</h4>
                                                            <p className="text-stone-500 text-xs">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-medium text-stone-800">${item.price.toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {order.status === 'Shipped' && (
                                                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-3 text-blue-600">
                                                        <Truck className="w-5 h-5" />
                                                        <div className="text-sm">
                                                            <p className="font-bold">Package on the way</p>
                                                            <p className="text-xs opacity-80">Expected delivery: 3-5 days</p>
                                                        </div>
                                                    </div>
                                                    <a 
                                                        href={`https://www.google.com/search?q=track+package+${order.id}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                                                    >
                                                        Track Package ({`TRK-${order.id.toUpperCase().substring(0, 6)}`}) <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <h1 className="text-2xl font-serif font-bold text-tea-900 mb-6">Account Settings</h1>
                        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8">
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                {message.text && (
                                    <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {message.text}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-tea-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email} 
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-tea-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={formData.password} 
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        className="w-full p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-tea-500 outline-none"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={isSaving}
                                        className="flex items-center gap-2 bg-tea-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-tea-800 transition-colors disabled:opacity-70"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;