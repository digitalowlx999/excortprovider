import { useState, useEffect } from 'react';
import { Search, User, Mail, Shield, ShieldAlert, Trash2, Loader2, Calendar } from 'lucide-react';
import { api } from '../../lib/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const data = await api.get('/admin/users', token);
      setUsers(data || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
    setLoading(false);
  }
  
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/admin/users/${id}`, token);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  }

  const filteredUsers = users.filter(u => 
    u.alias?.toLowerCase().includes(search.toLowerCase()) || 
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">User Management</h1>
          <p className="text-slate-500 font-medium">Manage platform access, roles, and security.</p>
        </div>
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center px-6 gap-3 min-w-[300px]">
           <Search className="text-slate-300" size={18} />
           <input 
             type="text" 
             placeholder="Search by alias or role..." 
             className="text-sm outline-none w-full py-2" 
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="card-premium !p-0 bg-white border border-gray-100 overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-gray-100">
               <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Balance</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <Loader2 className="animate-spin text-primary mx-auto mb-2" size={32} />
                       <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing User Base...</span>
                    </td>
                 </tr>
               ) : filteredUsers.map(user => (
                 <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                             {user.alias?.[0] || 'U'}
                          </div>
                          <div>
                             <p className="font-bold text-slate-900">{user.alias || 'Guest User'}</p>
                              <p className="text-slate-400 text-xs font-medium">ID: #{String(user.id).padStart(4, '0')}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-500'}`}>
                          {user.role || 'user'}
                       </span>
                    </td>
                    <td className="px-6 py-6 font-bold text-slate-800">
                       ${Number(user.wallet_balance || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Calendar size={14} /> {new Date(user.created_at).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="p-2 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                             <Shield size={18} />
                          </button>
                           <button 
                             onClick={() => handleDelete(user.id)}
                             className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                           >
                              <Trash2 size={18} />
                           </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
