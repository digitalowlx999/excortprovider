import { useState, useEffect } from 'react';
import { Bitcoin, Coins, DollarSign, Database, Shield, Save, Loader2, AlertCircle, QrCode } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [settings, setSettings] = useState({
    wallet_address_btc: '', qr_code_url_btc: '',
    wallet_address_eth: '', qr_code_url_eth: '',
    wallet_address_usdt: '', qr_code_url_usdt: '',
    wallet_address_ltc: '', qr_code_url_ltc: '',
  });

  const cryptos = [
    { id: 'btc', name: 'Bitcoin (BTC)', icon: Bitcoin, color: 'text-amber-500' },
    { id: 'eth', name: 'Ethereum (ETH)', icon: Coins, color: 'text-blue-500' },
    { id: 'usdt', name: 'Tether (USDT TRC20)', icon: DollarSign, color: 'text-emerald-500' },
    { id: 'ltc', name: 'Litecoin (LTC)', icon: Coins, color: 'text-slate-400' },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const data = await api.get('/admin/settings');
      if (data) {
        setSettings({
          wallet_address_btc: data.wallet_address_btc || data.wallet_address || '',
          qr_code_url_btc: data.qr_code_url_btc || data.qr_code_url || '',
          wallet_address_eth: data.wallet_address_eth || '',
          qr_code_url_eth: data.qr_code_url_eth || '',
          wallet_address_usdt: data.wallet_address_usdt || '',
          qr_code_url_usdt: data.qr_code_url_usdt || '',
          wallet_address_ltc: data.wallet_address_ltc || '',
          qr_code_url_ltc: data.qr_code_url_ltc || '',
        });
      }
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
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
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
    <div className="space-y-12 pb-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Platform Settings</h1>
        <p className="text-slate-500 font-medium">Configure global payment details and pricing rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Left: Crypto + QR Config */}
         <div className="lg:col-span-8 space-y-10">
            <form onSubmit={handleSave}>
            <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <Bitcoin size={22} className="text-primary" />
                  Crypto Payment Methods
               </h3>

               {cryptos.map(crypto => (
                 <div key={crypto.id} className="p-6 border border-gray-100 rounded-2xl bg-slate-50/50 space-y-6">
                    <h4 className={`font-bold flex items-center gap-2 ${crypto.color}`}>
                       <crypto.icon size={18} />
                       {crypto.name}
                    </h4>
                    
                    <div>
                       <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">{crypto.name} Wallet Address</label>
                       <input
                         type="text"
                         value={settings[`wallet_address_${crypto.id}`]}
                         onChange={e => setSettings({...settings, [`wallet_address_${crypto.id}`]: e.target.value})}
                         className="input-field font-mono text-sm"
                         placeholder="Address string..."
                       />
                    </div>

                    <div>
                       <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">QR Code Image URL</label>
                       <div className="relative">
                         <QrCode className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                         <input
                           type="text"
                           value={settings[`qr_code_url_${crypto.id}`]}
                           onChange={e => setSettings({...settings, [`qr_code_url_${crypto.id}`]: e.target.value})}
                           className="input-field pl-14"
                           placeholder={`https://yoursite.com/qr-${crypto.id}.png`}
                         />
                       </div>
                       {settings[`qr_code_url_${crypto.id}`] && (
                         <div className="mt-4 p-4 border border-gray-100 rounded-2xl inline-block bg-white shadow-sm">
                           <img src={settings[`qr_code_url_${crypto.id}`]} alt={`${crypto.name} QR Code`} className="h-24 w-24 object-contain" />
                         </div>
                       )}
                    </div>
                 </div>
               ))}

               {message && (
                 <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <AlertCircle size={20} />
                    <span className="font-bold text-sm">{message.text}</span>
                 </div>
               )}

               <div className="pt-6 border-t border-gray-50 text-right">
                  <button disabled={saving} className="btn-primary !py-4 px-12 flex items-center gap-2 ml-auto">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Settings
                  </button>
               </div>
            </section>
            </form>

            <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <Database size={22} className="text-primary" />
                  Pricing & Rules
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">Ad Posting Price ($)</label>
                     <div className="relative">
                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="number" defaultValue="10" className="input-field pl-14 font-bold" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">Min. Deposit Amount ($)</label>
                     <div className="relative">
                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="number" defaultValue="100" className="input-field pl-14 font-bold" />
                     </div>
                  </div>
               </div>
               <div className="pt-6 border-t border-gray-50 text-right">
                  <button className="btn-primary !py-4 px-12">Save Pricing</button>
               </div>
            </section>
         </div>

         {/* Right: Security info */}
         <div className="lg:col-span-4">
            <div className="card-premium p-10 bg-slate-900 text-white">
               <Shield className="text-primary mb-6" size={40} />
               <h4 className="text-xl font-bold mb-4">Security Notice</h4>
               <p className="text-slate-400 text-sm leading-relaxed italic border-l-2 border-primary/20 pl-4">
                 Changing the wallet address will affect all new deposit instructions shown to users. Verify the address carefully before saving.
               </p>
               
               <div className="mt-12 space-y-6">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10"></span>
                     SSL SECURED
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10"></span>
                     MYSQL BACKEND ACTIVE
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
