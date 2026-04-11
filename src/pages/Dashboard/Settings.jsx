import { useState, useEffect } from 'react';
import { User, Shield, Wallet, Save, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

export default function UserSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ alias: '', role: 'escort' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const data = await api.get('/auth/profile', token);
      if (data) setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
    setLoading(false);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      await api.put('/auth/profile', { alias: profile.alias }, token);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your public identity and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8">
           <form onSubmit={handleSave} className="card-premium p-10 bg-white space-y-8">
              <div className="grid grid-cols-1 gap-6">
                 <div>
                    <label className="block text-slate-700 font-bold mb-2 ml-1">Display Name / Alias</label>
                    <div className="relative">
                       <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                       <input 
                         type="text" 
                         className="input-field pl-14" 
                         value={profile.alias || ''}
                         onChange={e => setProfile({...profile, alias: e.target.value})}
                         placeholder="e.g. Elena Miami" 
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-slate-700 font-bold mb-2 ml-1">Account Role</label>
                    <div className="relative">
                       <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                       <input 
                         type="text" 
                         className="input-field pl-14 bg-slate-50 cursor-not-allowed" 
                         value={profile.role}
                         readOnly
                       />
                    </div>
                 </div>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                   <AlertCircle size={20} />
                   <span className="font-bold text-sm">{message.text}</span>
                </div>
              )}

              <button 
                disabled={saving}
                className="btn-primary w-full !py-4 flex items-center justify-center gap-2 shadow-2xl shadow-primary/20"
              >
                 {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 Save Profile Changes
              </button>
           </form>
        </div>

        {profile.role !== 'viewer' && (
          <div className="md:col-span-4 space-y-8">
             <div className="card-premium p-8 bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/20">
                <h4 className="font-bold mb-6 flex items-center gap-2">
                   <Wallet size={18} className="text-primary" />
                   Wallet Status
                </h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Available Funds</p>
                <p className="text-3xl font-black mb-6">${Number(profile.wallet_balance || 0).toFixed(2)}</p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-primary w-1/3"></div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
