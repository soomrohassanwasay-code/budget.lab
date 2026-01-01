
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { 
  Package, 
  Shield, 
  Mail, 
  Phone, 
  ArrowRight, 
  MessageSquare, 
  Star,
  Clock,
  Settings as SettingsIcon,
  Save,
  User as UserIcon,
  Lock,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { Review, User } from '../types';

export const UserDashboard: React.FC = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  const isSettingsView = location.pathname === '/dashboard/settings';

  // Settings form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    password: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserReviews = async () => {
        const { data } = await supabase.getAllReviews();
        if (data) {
          // Filter reviews by user's current identification fields
          const filtered = data.filter(r => r.author === user.name || r.author === user.email);
          setUserReviews(filtered);
        }
        setLoadingReviews(false);
      };
      fetchUserReviews();
      
      setFormData({
        name: user.name,
        phone: user.phone || '',
        avatar: user.avatar || '',
        password: ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);

    // Prepare update payload
    const updates: Partial<User> = {
      name: formData.name,
      phone: formData.phone,
      avatar: formData.avatar
    };
    
    if (formData.password && formData.password.trim() !== '') {
      updates.password = formData.password;
    }

    try {
      const { data, error } = await supabase.updateProfile(user.email, updates);
      
      if (!error && data) {
        // Sync global auth state immediately
        login(data);
        setSaveSuccess(true);
        // Clear password field after success
        setFormData(prev => ({ ...prev, password: '' }));
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        // Extract a readable error message
        const errorMsg = error ? (typeof error === 'object' ? (error as any).message || JSON.stringify(error) : String(error)) : 'Unknown database error';
        console.error('Sync Error Details:', error); 
        alert(`Failed to sync changes: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error('Critical Error:', err);
      const catchMsg = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      alert(`A system error occurred: ${catchMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  // Live preview in sidebar
  const currentAvatarPreview = isSettingsView ? formData.avatar : user.avatar;

  return (
    <div className="bg-white min-h-screen py-20 px-4 animate-in fade-in duration-500 text-left">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            {isSettingsView ? 'Account Settings' : 'My Account'}
          </h1>
          <p className="text-gray-500 font-medium">
            {isSettingsView ? 'Customize your lab profile and security.' : 'Manage your template access and review history.'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Profile Card Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 text-center sticky top-32 transition-all duration-300">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-full bg-brand/10 border-4 border-white shadow-lg flex items-center justify-center text-brand font-black text-3xl overflow-hidden transition-all duration-300">
                  {currentAvatarPreview && currentAvatarPreview.trim() !== '' ? (
                    <img 
                      key={currentAvatarPreview}
                      src={currentAvatarPreview} 
                      alt={formData.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.classList.add('bg-brand/10');
                          parent.innerText = formData.name.charAt(0);
                        }
                      }}
                    />
                  ) : (
                    formData.name.charAt(0)
                  )}
                </div>
                {isSettingsView && (
                  <div className="absolute bottom-0 right-0 p-2 bg-brand text-white rounded-full shadow-lg border-2 border-white">
                    <Camera className="w-3 h-3" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-1 leading-tight truncate px-2">{formData.name}</h2>
              <p className="text-xs font-black text-brand uppercase tracking-widest mb-6">Verified Member</p>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-bold text-gray-600 truncate">{user.email}</span>
                </div>
                
                <Link 
                  to={isSettingsView ? "/dashboard" : "/dashboard/settings"}
                  className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold text-sm transition-all shadow-md ${
                    isSettingsView 
                      ? 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50' 
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  {isSettingsView ? (
                    <><Package className="w-4 h-4" /> <span>Back to Dashboard</span></>
                  ) : (
                    <><SettingsIcon className="w-4 h-4" /> <span>Account Settings</span></>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {isSettingsView ? (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center space-x-3 mb-8">
                  <SettingsIcon className="w-6 h-6 text-brand" />
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Profile & Security</h3>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Full Name</label>
                      <div className="relative group">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Your full name"
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white outline-none transition-all" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">WhatsApp / Phone</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                          <input 
                            type="text" 
                            placeholder="+1 234 567 890"
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white outline-none transition-all" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Avatar URL</label>
                        <div className="relative group">
                          <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                          <input 
                            type="text" 
                            placeholder="https://images.com/user.jpg"
                            value={formData.avatar} 
                            onChange={e => setFormData({...formData, avatar: e.target.value})}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white outline-none transition-all" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50 space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">New Password (Optional)</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand transition-colors" />
                        <input 
                          type="password" 
                          placeholder="Leave blank to keep current"
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={isSaving}
                    className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-lg transition-all flex items-center justify-center space-x-3 ${
                      saveSuccess 
                        ? 'bg-green-500 text-white' 
                        : 'bg-brand text-white brand-shadow hover:opacity-90 active:scale-[0.98]'
                    }`}
                  >
                    {isSaving ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : saveSuccess ? (
                      <><CheckCircle2 className="w-5 h-5" /> <span>Profile Synced!</span></>
                    ) : (
                      <><Save className="w-5 h-5" /> <span>Save Changes</span></>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Standard Dashboard View */
              <>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center space-x-3 mb-8">
                    <Package className="w-6 h-6 text-brand" />
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Access History</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-3xl p-12 text-center border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                      <Package className="w-8 h-8 text-gray-200" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">No downloads yet</h4>
                    <p className="text-gray-500 text-sm mb-8">Browse the Budget Lab to find templates for your needs.</p>
                    <Link 
                      to="/"
                      className="inline-flex items-center bg-brand text-white px-8 py-3 rounded-2xl font-black text-sm hover:opacity-90 transition-all brand-shadow"
                    >
                      Explore Lab <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 animate-in slide-in-from-bottom-4 duration-400">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-6 h-6 text-brand" />
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Your Reviews</h3>
                    </div>
                  </div>
                  
                  {loadingReviews ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-3 border-brand border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Syncing reviews...</p>
                    </div>
                  ) : userReviews.length === 0 ? (
                    <div className="bg-gray-50 rounded-3xl p-12 text-center border border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-gray-200" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">No reviews shared</h4>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userReviews.map((review) => (
                        <div key={review.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                          <h4 className="font-bold text-gray-900 mb-1">"{review.title}"</h4>
                          <p className="text-sm text-gray-500">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
