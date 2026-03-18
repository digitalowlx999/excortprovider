import { useState, useEffect } from 'react';
import { Wallet, QrCode, Save, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    wallet_address: '',
    qr_code_url: ''
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const data = await api.get('/admin/settings');
      setSettings({
        wallet_address: data.wallet_address || '',
        qr_code_url: data.qr_code_url || ''
      });
    } catch (err) {
      console.error("Fetch settings error:", err);
    }
    setLoading(false);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      await api.put('/admin/settings', settings, token);
      setMessage({ type: 'success', text: 'Global settings updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Platform Settings</h1>
        <p className="text-slate-500 font-medium">Configure global payment details and platform defaults.</p>
      </div>

      <form onSubmit={handleSave} className="card-premium p-10 bg-white space-y-8">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <label className="block text-slate-700 font-bold mb-3 ml-1">Company Wallet Address (BTC/ETH)</label>
            <div className="relative">
              <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                className="input-field pl-14 font-mono text-sm" 
                value={settings.wallet_address}
                onChange={e => setSettings({...settings, wallet_address: e.target.value})}
                placeholder="0x... or bc1..." 
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-3 ml-1">QR Code Image URL</label>
            <div className="relative">
              <QrCode className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                className="input-field pl-14" 
                value={settings.qr_code_url}
                onChange={e => setSettings({...settings, qr_code_url: e.target.value})}
                placeholder="https://example.com/qr.png" 
              />
            </div>
            {settings.qr_code_url && (
              <div className="mt-4 p-4 border rounded-2xl inline-block bg-slate-50">
                <img src={settings.qr_code_url} alt="QR Preview" className="h-32 w-32 object-contain" />
              </div>
            )}
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
          Update Global Settings
        </button>
      </form>
    </div>
  );
}
