import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await login(formData.email, formData.password, 'admin');
    
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid admin credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-slate-800 rounded-full">
                <ShieldCheck className="h-10 w-10 text-tea-400" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-serif font-bold text-white">Admin Portal</h2>
          <p className="mt-2 text-sm text-slate-400">
            Authorized personnel only
          </p>
        </div>

        <div className="bg-slate-800 py-8 px-4 shadow-2xl border border-slate-700 rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email address</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-500 bg-slate-900 text-white focus:outline-none focus:ring-tea-500 focus:border-tea-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-500 bg-slate-900 text-white focus:outline-none focus:ring-tea-500 focus:border-tea-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tea-600 hover:bg-tea-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tea-500 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Dashboard'}
              </button>
            </div>
          </form>

           <div className="mt-6">
            <Link
                to="/"
                className="w-full flex justify-center items-center gap-2 py-2 px-4 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                 <ArrowLeft className="w-4 h-4" /> Back to Store
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
