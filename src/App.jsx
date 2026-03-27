import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cities from './pages/Cities';
import StateListing from './pages/StateListing';
import CityListing from './pages/CityListing';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import PostAd from './pages/Dashboard/PostAd';
import WalletView from './pages/Dashboard/Wallet';
import MyAds from './pages/Dashboard/MyAds';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DepositManagement from './pages/Admin/DepositManagement';
import AdminSettings from './pages/Admin/AdminSettings';
import ManageCities from './pages/Admin/ManageCities';
import UserManagement from './pages/Admin/UserManagement';
import AdManagement from './pages/Admin/AdManagement';
import AdminSeedImages from './pages/Admin/AdminSeedImages';
import UserSettings from './pages/Dashboard/Settings';
const Placeholder = ({ title }) => <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto"><h1 className="text-4xl font-bold">{title}</h1><p className="mt-4 text-gray-600">This page is under construction.</p></div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/state/:stateCode" element={<StateListing />} />
            <Route path="/escorts/:slug" element={<CityListing />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="ads" element={<MyAds />} />
              <Route path="wallet" element={<WalletView />} />
              <Route path="post-ad" element={<PostAd />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="regions" element={<ManageCities />} />
              <Route path="ads" element={<AdManagement />} />
              <Route path="deposits" element={<DepositManagement />} />
              <Route path="seed-images" element={<AdminSeedImages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
