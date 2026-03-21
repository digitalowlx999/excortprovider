import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [role, setRole] = useState('viewer'); // Default to viewer
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/auth/register', {
        email,
        password,
        alias,
        role
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent-light flex items-center justify-center p-4 pt-32 pb-12">
       <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="hidden lg:block">
                <h1 className="text-6xl font-black text-slate-900 leading-tight">
                   The Home for <br/> <span className="text-primary">Elite Escorts</span>
                </h1>
                <p className="text-slate-500 mt-6 text-lg leading-relaxed">
                   Join thousands of professional companions across North America. Get access to:
                </p>
                
                <ul className="mt-10 space-y-6">
                   {[
                     'Stunning profile layouts',
                     'Low cost ad posting ($10)',
                     'Real-time ad analytics',
                     'Secure crypto payments',
                     'Premium 24/7 support'
                   ].map((item, idx) => (
                     <li key={idx} className="flex items-center gap-4 text-slate-700 font-bold">
                        <CheckCircle2 className="text-primary" size={24} />
                        {item}
                     </li>
                   ))}
                </ul>
             </div>

             <div>
                <div className="card-premium p-10 bg-white">
                   <div className="mb-10 text-center lg:text-left">
                      <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                      <p className="text-slate-500 mt-2">Start your premium journey today.</p>
                   </div>

                   {error && (
                     <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 italic">
                       {error}
                     </div>
                   )}

                   <form onSubmit={handleRegister} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <button 
                           type="button"
                           onClick={() => setRole('viewer')}
                           className={`p-4 rounded-2xl border-2 transition-all text-left ${role === 'viewer' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 bg-slate-50 text-slate-400 hover:border-gray-200'}`}
                         >
                            <User size={24} className="mb-2" />
                            <p className="font-bold text-sm">Visitor</p>
                            <p className="text-[10px] opacity-70">I want to browse ads</p>
                         </button>
                         <button 
                           type="button"
                           onClick={() => setRole('escort')}
                           className={`p-4 rounded-2xl border-2 transition-all text-left ${role === 'escort' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 bg-slate-50 text-slate-400 hover:border-gray-200'}`}
                         >
                            <PlusCircle size={24} className="mb-2" />
                            <p className="font-bold text-sm">Provider</p>
                            <p className="text-[10px] opacity-70">I want to post ads</p>
                         </button>
                      </div>

                      <div>
                         <label className="block text-slate-700 font-bold mb-2 ml-1">Display Name / Alias</label>
                         <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input 
                              type="text" 
                              required 
                              className="input-field pl-14" 
                              placeholder="e.g. Elena Miami"
                              value={alias}
                              onChange={(e) => setAlias(e.target.value)}
                            />
                         </div>
                      </div>

                      <div>
                         <label className="block text-slate-700 font-bold mb-2 ml-1">Email Address</label>
                         <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input 
                              type="email" 
                              required 
                              className="input-field pl-14" 
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                         </div>
                      </div>

                      <div>
                         <label className="block text-slate-700 font-bold mb-2 ml-1">Password</label>
                         <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input 
                              type="password" 
                              required 
                              className="input-field pl-14" 
                              placeholder="Min 8 characters"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                         </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed px-1">
                        By clicking "Create Account", you agree to our Terms of Service and Privacy Policy. You must be at least 18+ to use this platform.
                      </p>

                      <button 
                        disabled={loading}
                        className="w-full btn-primary !py-4 font-bold text-lg flex items-center justify-center gap-2 mt-4"
                      >
                        {loading ? 'Creating account...' : <><span className="flex items-center gap-2">Create Account <ArrowRight size={20} /></span></>}
                      </button>
                   </form>

                   <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                      <p className="text-slate-500 font-medium">
                        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
