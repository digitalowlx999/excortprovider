import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-primary">
              Escort<span className="text-slate-900">Provider</span>
            </Link>
            <p className="mt-4 text-slate-500 max-w-sm leading-relaxed">
              The premium classified ads platform for independent escorts and agencies across the US and Canada. Fast, secure, and modern.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/cities" className="text-slate-500 hover:text-primary transition-colors">Browse Cities</Link></li>
              <li><Link to="/register" className="text-slate-500 hover:text-primary transition-colors">Post an Ad</Link></li>
              <li><Link to="/login" className="text-slate-500 hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-500 hover:text-primary transition-colors">Safety Guide</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2026 Escort Provider. All rights reserved.</p>
          <div className="flex gap-6">
             <span className="text-xs text-slate-300">Minimum Deposit: $100</span>
             <span className="text-xs text-slate-300">Ad Cost: $10</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
