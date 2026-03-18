import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const data = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
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
          <h2 className="text-3xl font-bold text-slate-900 mt-4">Reset Password</h2>
          <p className="text-slate-500 mt-2">Enter your email and we'll send you reset instructions.</p>
        </div>

        <div className="card-premium p-10 bg-white">
          {message ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Email Sent!</h3>
                <p className="text-slate-500 leading-relaxed">
                  {message}
                </p>
              </div>
              <Link 
                to="/login" 
                className="w-full btn-primary !py-4 font-bold text-lg flex items-center justify-center gap-2 mt-8"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 italic">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <button 
                  disabled={loading}
                  className="w-full btn-primary !py-4 font-bold text-lg flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? 'Sending email...' : 'Send Reset Link'}
                  {!loading && <ArrowRight size={20} />}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                <p className="text-slate-500 font-medium">
                  Remembered your password? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-slate-400">
          <Shield size={16} />
          <span className="text-sm font-medium italic">Secure SSL encrypted connection</span>
        </div>
      </div>
    </div>
  );
}
