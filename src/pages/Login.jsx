import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent-light flex items-center justify-center p-4 pt-32">
       <div className="max-w-md w-full">
          <div className="text-center mb-10">
             <Link to="/" className="text-3xl font-black text-primary tracking-tighter mb-4 inline-block">
                Escort<span className="text-slate-900">Provider</span>
             </Link>
             <h2 className="text-3xl font-bold text-slate-900 mt-4">Welcome Back</h2>
             <p className="text-slate-500 mt-2">Log in to manage your ads and wallet.</p>
          </div>

          <div className="card-premium p-10 bg-white">
             {error && (
               <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 italic">
                 {error}
               </div>
             )}

             <form onSubmit={handleLogin} className="space-y-6">
                <div>
                   <label className="block text-slate-700 font-bold mb-2 ml-1">Email Address</label>
                   <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="email" 
                        required 
                        autoComplete="email"
                        className="input-field pl-14" 
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2 ml-1">
                      <label className="block text-slate-700 font-bold">Password</label>
                      <Link to="/forgot-password" title="Go to Forgot Password" className="text-sm font-bold text-primary hover:underline">Forgot?</Link>
                   </div>
                   <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="password" 
                        required 
                        autoComplete="current-password"
                        className="input-field pl-14" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                   </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full btn-primary !py-4 font-bold text-lg flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                  {!loading && <ArrowRight size={20} />}
                </button>
             </form>

             <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                <p className="text-slate-500 font-medium">
                  Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign up for free</Link>
                </p>
             </div>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-3 text-slate-400">
             <Shield size={16} />
             <span className="text-sm font-medium italic">Secure SSL encrypted connection</span>
          </div>
       </div>
    </div>
  );
}
