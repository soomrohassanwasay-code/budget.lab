
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  Save,
  Mail,
  Phone,
  MessageSquare,
  Star,
  LogOut,
  Users as UsersIcon,
  Shield,
  CreditCard,
  Calendar,
  Layout,
  Link as LinkIcon
} from 'lucide-react';
import { supabase, supabaseClient } from '../services/supabase';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { Product, Review } from '../types';

type Tab = 'dashboard' | 'products' | 'reviews' | 'users' | 'settings';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState<any>({
    contactEmail: '',
    contactPhone: '',
    adsensePublisherId: '',
    adsenseSlot1: '',
    adsenseSlot2: '',
    paymentPrice: '$19.99'
  });
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadData();
    const profilesSub = supabaseClient.channel('profiles-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, loadData).subscribe();
    return () => {
      supabaseClient.removeChannel(profilesSub);
    };
  }, []);

  const loadData = async () => {
    const [prodsRes, setsRes, revsRes, profsRes] = await Promise.all([
      supabase.getProducts(),
      supabase.getSettings(),
      supabase.getAllReviews(),
      supabase.getProfiles()
    ]);
    
    if (prodsRes.data) setProducts(prodsRes.data);
    if (setsRes.data) setSettings(setsRes.data);
    if (revsRes.data) setReviews(revsRes.data);
    if (profsRes.data) setProfiles(profsRes.data);
    
    setLoading(false);
  };

  const handleTogglePayment = async (email: string, currentPaid: boolean) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const { error } = await supabaseClient
      .from('profiles')
      .update({ 
        is_paid: !currentPaid,
        payment_expiry: !currentPaid ? expiry.toISOString() : null
      })
      .eq('email', email);
    if (error) {
      alert(`Failed to update status: ${error.message}`);
    } else {
      await loadData();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await supabase.deleteProduct(id);
      loadData();
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await supabase.deleteReview(id);
      loadData();
    }
  };

  const handleDeleteProfile = async (email: string) => {
    if (window.confirm('Are you sure?')) {
      await supabase.deleteProfile(email);
      loadData();
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const { error } = await supabase.updateSettings(settings);
      if (error) throw error;
      await refreshSettings();
      alert('Settings saved!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      if (isAdding) {
        await supabase.addProduct(editingProduct);
      } else {
        await supabase.updateProduct(editingProduct.id, editingProduct);
      }
      setEditingProduct(null);
      setIsAdding(false);
      loadData();
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-left">
      <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col sticky top-0 h-screen">
        <div className="mb-10 px-2 flex flex-col items-start leading-none">
          <span className="text-xl font-[900] tracking-tight text-black">BUDGET</span>
          <span className="text-xl font-[900] tracking-[0.15em] text-black">LAB</span>
        </div>
        <div className="flex-grow space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard className="w-4 h-4" /> <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Package className="w-4 h-4" /> <span>Templates</span>
          </button>
          <button onClick={() => setActiveTab('reviews')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'reviews' ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:bg-gray-50'}`}>
            <MessageSquare className="w-4 h-4" /> <span>Reviews</span>
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:bg-gray-50'}`}>
            <UsersIcon className="w-4 h-4" /> <span>Profiles</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Settings className="w-4 h-4" /> <span>Settings</span>
          </button>
        </div>
        <div className="pt-6 border-t border-gray-100">
          <button onClick={handleSignOut} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow p-10 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admin Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
                <h3 className="text-3xl font-black text-gray-900">{profiles.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Templates</p>
                <h3 className="text-3xl font-black text-gray-900">{products.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reviews</p>
                <h3 className="text-3xl font-black text-gray-900">{reviews.length}</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-xl animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Lab Configuration</h2>
            <form onSubmit={handleUpdateSettings} className="space-y-8">
              {/* Payment Settings */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" /> Payment Configuration
                </h3>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Premium Access Price (Display only)</label>
                  <input type="text" value={settings.paymentPrice} onChange={e => setSettings({...settings, paymentPrice: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none" placeholder="e.g. $19.99" />
                </div>
              </div>

              {/* Contact Settings */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                  <Mail className="w-4 h-4 mr-2" /> Support Channels
                </h3>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Support Email</label>
                  <input type="email" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">WhatsApp Phone (International Format)</label>
                  <input type="text" value={settings.contactPhone} onChange={e => setSettings({...settings, contactPhone: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none" placeholder="e.g. 447123456789" />
                </div>
              </div>

              {/* AdSense Settings */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                  <Layout className="w-4 h-4 mr-2" /> Google AdSense
                </h3>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Publisher ID (ca-pub-xxx)</label>
                  <input type="text" value={settings.adsensePublisherId} onChange={e => setSettings({...settings, adsensePublisherId: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none" placeholder="ca-pub-XXXXXXXXXXXXXXXX" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Ad Slot ID 1</label>
                    <input type="text" value={settings.adsenseSlot1} onChange={e => setSettings({...settings, adsenseSlot1: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none" placeholder="XXXXXXXXX" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Ad Slot ID 2</label>
                    <input type="text" value={settings.adsenseSlot2} onChange={e => setSettings({...settings, adsenseSlot2: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none" placeholder="XXXXXXXXX" />
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 font-bold uppercase leading-relaxed italic">
                  Note: Ads will only appear once your domain is approved by Google and the Publisher/Slot IDs are correct.
                </p>
              </div>

              <button disabled={savingSettings} className="w-full bg-brand text-white py-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2 shadow-lg brand-shadow">
                {savingSettings ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save className="w-4 h-4" /> <span>Update Lab Configuration</span></>}
              </button>
            </form>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Templates</h2>
              <button onClick={() => { setIsAdding(true); setEditingProduct({ id: `temp-${Date.now()}`, title: '', category: 'Excel Sheet', price: 0, originalPrice: 0, rating: 5, reviewCount: 0, images: [''], description: '', features: [], downloadUrl: '' }); }} className="bg-brand text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center space-x-2">
                <Plus className="w-4 h-4" /> <span>Add Template</span>
              </button>
            </header>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="px-8 py-4 font-bold text-gray-900">{p.title}</td>
                      <td className="px-8 py-4 text-sm text-gray-500">{p.category}</td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => { setIsAdding(false); setEditingProduct(p); }} className="p-2 text-gray-400 hover:text-brand"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">User Access Management</h2>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status / Expiry</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {profiles.map(p => (
                    <tr key={p.email}>
                      <td className="px-8 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{p.name} {p.role === 'admin' && '👑'}</span>
                          <span className="text-xs text-gray-400">{p.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => handleTogglePayment(p.email, p.is_paid)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                              p.is_paid ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'
                            }`}
                          >
                            {p.is_paid ? 'Paid: Verified' : 'Mark as Paid'}
                          </button>
                          {p.is_paid && p.payment_expiry && (
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                               Exp: {new Date(p.payment_expiry).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => handleDeleteProfile(p.email)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Customer Reviews</h2>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Author</th>
                    <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Review</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reviews.map(r => (
                    <tr key={r.id}>
                      <td className="px-8 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{r.author}</span>
                          <span className="text-[10px] font-black text-yellow-500">{r.rating} / 5 STARS</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="max-w-md">
                          <p className="font-bold text-sm text-gray-900">{r.title}</p>
                          <p className="text-xs text-gray-500 truncate">{r.content}</p>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => handleDeleteReview(r.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
          <form onSubmit={handleSaveProduct} className="relative w-full max-w-lg bg-white rounded-[2rem] p-10 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black">{isAdding ? 'New Template' : 'Edit Template'}</h3>
            
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Title</label>
              <input required placeholder="Template Title" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl" />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Main Image URL</label>
              <input required placeholder="https://..." value={editingProduct.images[0]} onChange={e => setEditingProduct({...editingProduct, images: [e.target.value]})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl" />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 flex items-center">
                <LinkIcon className="w-3 h-3 mr-1" /> Direct Download Link
              </label>
              <input placeholder="Google Drive / File URL" value={editingProduct.downloadUrl || ''} onChange={e => setEditingProduct({...editingProduct, downloadUrl: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-brand" />
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">This link will only be visible to Paid members.</p>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Description</label>
              <textarea required placeholder="Template details..." value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl h-32 resize-none" />
            </div>

            <button className="w-full bg-brand text-white py-4 rounded-xl font-black shadow-lg">Confirm Changes</button>
          </form>
        </div>
      )}
    </div>
  );
};
