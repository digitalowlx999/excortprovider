import { Wallet, History, Search, Filter, Check, X, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function DepositManagement() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  async function fetchDeposits() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const data = await api.get('/deposits', token);
      setDeposits(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (id, action) => {
    setProcessing(id);
    const token = localStorage.getItem('token');
    try {
      if (action === 'approve') {
        const amount = prompt('Enter the amount in USD to credit the user:', '100');
        if (amount === null) return;
        await api.put(`/deposits/${id}/approve`, { amount: parseFloat(amount) }, token);
      } else {
        if (!confirm('Are you sure you want to reject this deposit?')) return;
        await api.put(`/deposits/${id}/reject`, {}, token);
      }
      fetchDeposits();
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const filteredDeposits = Array.isArray(deposits) ? deposits.filter(dep => 
    dep.status === 'pending' && (
      (dep.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (dep.transaction_hash || '').toLowerCase().includes(search.toLowerCase())
    )
  ) : [];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Deposit Approvals</h1>
          <p className="text-slate-500 font-medium">Verify blockchain transactions and fund user wallets.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center px-6 gap-3 min-w-[300px]">
              <Search className="text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search hash, email..." 
                className="text-sm outline-none w-full" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>
      </div>

      <div className="card-premium !p-0 bg-white border border-gray-100 overflow-hidden shadow-sm">
         <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-gray-100">
               <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Escort / User</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount / Crypto</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Hash</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Time</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr>
                    <td colSpan="5" className="px-10 py-20 text-center">
                       <Loader2 className="animate-spin text-primary mx-auto mb-2" size={24} />
                       <span className="text-slate-400 font-medium">Loading pending deposits...</span>
                    </td>
                 </tr>
               ) : filteredDeposits.map((dep) => (
                 <tr key={dep.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-8">
                       <p className="font-bold text-slate-900">{dep.alias || 'User'}</p>
                       <p className="text-slate-400 text-xs font-medium">{dep.email}</p>
                    </td>
                    <td className="px-6 py-8">
                       <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">${parseFloat(dep.amount).toFixed(2)}</span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase">{dep.currency}</span>
                       </div>
                    </td>
                    <td className="px-6 py-8">
                       <div className="flex items-center gap-2 text-slate-500 font-mono text-xs max-w-[150px] truncate">
                          {dep.transaction_hash}
                          <button className="text-blue-500 hover:text-blue-700" onClick={() => window.open(`https://www.blockchain.com/explorer/transactions/btc/${dep.transaction_hash}`, '_blank')}><ExternalLink size={12} /></button>
                       </div>
                    </td>
                    <td className="px-6 py-8">
                       <span className="text-slate-500 text-sm font-medium">{new Date(dep.created_at).toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-3">
                          <button 
                            disabled={processing === dep.id}
                            onClick={() => handleAction(dep.id, 'reject')}
                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-500/10 disabled:opacity-50"
                          >
                             <X size={18} />
                          </button>
                          <button 
                            disabled={processing === dep.id}
                            onClick={() => handleAction(dep.id, 'approve')}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
                          >
                             {processing === dep.id ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                             Approve
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
         
         {!loading && filteredDeposits.length === 0 && (
           <div className="py-32 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
                 <Check size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">No Pending Deposits</h3>
              <p className="text-slate-400 mt-2 font-medium italic">All transaction hashes have been processed.</p>
           </div>
         )}
      </div>

      {/* Manual Fund Addition */}
      <div className="card-premium p-10 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-5">
            <Wallet size={120} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
               <h3 className="text-2xl font-bold mb-2">Manual Wallet Adjustment</h3>
               <p className="text-slate-400 text-sm">Transfer funds to a specific user manually for compensations or bonuses.</p>
            </div>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all shadow-xl">
               Adjust Balance
            </button>
         </div>
      </div>
    </div>
  );
}
