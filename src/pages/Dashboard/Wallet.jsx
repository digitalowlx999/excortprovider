import { useState, useEffect } from 'react';
import { Wallet, Info, Copy, CheckCircle2, History, ArrowDownToLine, Bitcoin, Coins, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const PRESET_AMOUNTS = [100, 200, 300, 500, 1000];

export default function WalletView() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'viewer') navigate('/dashboard', { replace: true });
  }, [navigate]);

  const [balance, setBalance] = useState(0);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hash, setHash] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [settings, setSettings] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const cryptos = [
    { id: 'btc', name: 'Bitcoin', icon: Bitcoin, color: 'text-amber-500', border: 'border-amber-500' },
    { id: 'eth', name: 'Ethereum', icon: Coins, color: 'text-blue-500', border: 'border-blue-500' },
    { id: 'usdt', name: 'USDT (TRC20)', icon: DollarSign, color: 'text-emerald-500', border: 'border-emerald-500' },
    { id: 'ltc', name: 'Litecoin', icon: Coins, color: 'text-slate-500', border: 'border-slate-500' },
  ];

  useEffect(() => {
    fetchWalletData();
  }, []);

  async function fetchWalletData() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const profile = await api.get('/auth/profile', token);
      setBalance(profile?.wallet_balance || 0);
      const fetchedSettings = await api.get('/admin/settings');
      setSettings(fetchedSettings);
      const depositHistory = await api.get('/deposits/my', token);
      setDeposits(Array.isArray(depositHistory) ? depositHistory : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getFinalAmount = () => {
    if (isCustom) return parseFloat(customAmount) || 0;
    return selectedAmount;
  };

  const handleCopy = () => {
    const currentAddress = settings[`wallet_address_${selectedCrypto}`] || settings.wallet_address || 'Address not configured';
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalAmount = getFinalAmount();
    if (!hash) return;
    if (finalAmount < 100) {
      setMessage({ type: 'error', text: 'Minimum deposit amount is $100.' });
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      await api.post('/deposits', {
        transaction_hash: hash,
        amount: finalAmount,
        currency: selectedCrypto.toUpperCase()
      }, token);
      setMessage({ type: 'success', text: `Deposit of $${finalAmount} submitted! Admin will verify and credit your account shortly.` });
      setHash('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 6000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
      </div>
    );
  }

  const finalAmount = getFinalAmount();
  const amountValid = finalAmount >= 100;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Wallet</h1>
        <p className="text-slate-500 font-medium">Manage your funds and deposit history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12 xl:col-span-7 space-y-10">
          <div className="card-premium p-10 bg-white border-2 border-primary/5">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary">
                <Wallet size={40} />
              </div>
              <div className="flex-grow flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Balance</p>
                  <p className="text-5xl font-black text-slate-900">${Number(balance || 0).toFixed(2)}</p>
                </div>
                <button
                  onClick={fetchWalletData}
                  disabled={loading}
                  className="p-4 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all flex flex-col items-center gap-1 group"
                  title="Refresh Balance"
                >
                  <Loader2 className={`transition-all ${loading ? 'animate-spin text-primary' : 'group-hover:rotate-180'}`} size={20} />
                  <span className="text-[8px] font-black uppercase">Sync</span>
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-50 rounded-[2.5rem] mb-10 border border-gray-100">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ArrowDownToLine size={20} className="text-primary" />
                Deposit Funds
              </h4>

              {/* Crypto selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {cryptos.map(crypto => (
                  <button
                    key={crypto.id}
                    type="button"
                    onClick={() => setSelectedCrypto(crypto.id)}
                    className={`p-4 rounded-3xl text-center transition-all ${selectedCrypto === crypto.id ? `bg-white border-2 ${crypto.border} shadow-lg shadow-primary/5` : 'bg-white border-2 border-transparent hover:border-gray-100 opacity-60'}`}
                  >
                    <crypto.icon className={`${crypto.color} mx-auto mb-2`} size={24} />
                    <span className={`font-bold text-xs ${selectedCrypto === crypto.id ? 'text-slate-900' : 'text-slate-500'}`}>{crypto.name}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount selector */}
                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">Select an amount</label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {PRESET_AMOUNTS.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setSelectedAmount(amt); setIsCustom(false); setCustomAmount(''); }}
                        className={`py-3 px-4 rounded-2xl font-black text-sm border-2 transition-all ${!isCustom && selectedAmount === amt ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-700 border-gray-200 hover:border-primary/40'}`}
                      >
                        ${amt}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => { setIsCustom(true); setCustomAmount(''); }}
                      className={`py-3 px-4 rounded-2xl font-black text-sm border-2 transition-all ${isCustom ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-700 border-gray-200 hover:border-primary/40'}`}
                    >
                      Custom
                    </button>
                  </div>
                  {isCustom && (
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        min="100"
                        step="1"
                        placeholder="Enter amount (min $100)"
                        value={customAmount}
                        onChange={e => setCustomAmount(e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 rounded-2xl py-3 pl-10 pr-6 text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                      />
                    </div>
                  )}
                  {!amountValid && (isCustom && customAmount !== '') && (
                    <p className="mt-2 text-xs text-red-500 font-bold ml-1">Minimum deposit is $100.</p>
                  )}
                  {amountValid && (
                    <p className="mt-2 text-xs text-emerald-600 font-bold ml-1">You are depositing: <span className="text-slate-900">${finalAmount}</span></p>
                  )}
                </div>

                {/* Wallet address */}
                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2 text-primary">Send {selectedCrypto.toUpperCase()} to this address</label>

                  {(settings[`qr_code_url_${selectedCrypto}`] || settings.qr_code_url) && (
                    <div className="mb-6 flex justify-center">
                      <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-sm inline-block">
                        <img
                          src={settings[`qr_code_url_${selectedCrypto}`] || settings.qr_code_url}
                          alt={`${selectedCrypto.toUpperCase()} QR Code`}
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings[`wallet_address_${selectedCrypto}`] || settings.wallet_address || 'Address not configured'}
                      className="flex-grow bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-mono text-slate-600 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                      {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* TXID */}
                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 ml-2">Enter Transaction Hash (TXID)</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                    placeholder="Paste your transaction ID here..."
                    value={hash}
                    onChange={e => setHash(e.target.value)}
                  />
                  <p className="mt-3 text-[10px] text-slate-400 font-medium italic">
                    * Admin will verify your transaction manually. This usually takes 5–30 minutes.
                  </p>
                </div>

                {message && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <AlertCircle size={20} />
                    <span className="font-bold text-sm tracking-tight">{message.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !hash || !amountValid}
                  className="w-full btn-primary !py-5 font-black text-lg shadow-2xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="animate-spin" size={24} /> : `Submit $${amountValid ? finalAmount : '—'} for Verification`}
                </button>
              </form>
            </div>

            <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-3xl">
              <Info className="text-primary flex-shrink-0 mt-1" size={20} />
              <p className="text-slate-600 text-sm leading-relaxed">
                Minimum deposit: <span className="font-bold text-primary">$100</span>. Deposits below this amount will be rejected. All payments are final.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-5">
          <div className="card-premium p-8 bg-white h-full border border-gray-100">
            <h4 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <History size={22} className="text-primary" />
              Transaction History
            </h4>

            <div className="space-y-4">
              {deposits.map(dep => (
                <div key={dep.id} className="p-5 bg-slate-50 rounded-[2rem] flex items-center justify-between border border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-gray-100 shadow-sm">
                      <Bitcoin size={20} className="text-pink-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        ${parseFloat(dep.amount || 0).toFixed(2)}
                        <span className="ml-2 text-[9px] font-black uppercase text-slate-400">{dep.currency}</span>
                      </p>
                      <p className="text-slate-400 text-[10px] font-medium">{new Date(dep.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${dep.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : dep.status === 'rejected' ? 'bg-red-100 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    {dep.status}
                  </span>
                </div>
              ))}

              {deposits.length === 0 && (
                <div className="py-24 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4">
                    <History size={24} />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No History Yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
