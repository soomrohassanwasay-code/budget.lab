
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductDetail } from './pages/ProductDetail';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { CartProvider } from './context/CartContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CreditCard, PlayCircle, Loader2, CheckCircle2, Timer, RefreshCw } from 'lucide-react';
import { supabaseClient } from './services/supabase';
import { User } from './types';

const AdSenseUnit: React.FC<{ slotId: string }> = ({ slotId }) => {
  const { settings } = useSettings();
  
  useEffect(() => {
    if (!settings.adsensePublisherId || !slotId) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, [slotId, settings.adsensePublisherId]);

  if (!settings.adsensePublisherId || !slotId) {
    return (
      <div className="flex justify-center my-4 overflow-hidden rounded-2xl bg-gray-50 border border-dashed border-gray-200 min-h-[250px] items-center text-gray-300 text-[10px] font-black uppercase tracking-widest">
        Ad Display Space
      </div>
    );
  }

  return (
    <div className="flex justify-center my-4 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 min-h-[250px] items-center">
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '300px', minHeight: '250px' }}
        data-ad-client={settings.adsensePublisherId.startsWith('ca-pub-') ? settings.adsensePublisherId : `ca-pub-${settings.adsensePublisherId}`}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  
  const [adState, setAdState] = useState<'none' | 'watching_1' | 'watching_2' | 'finished'>('none');
  const [adTimer, setAdTimer] = useState(30);
  const [tempAccess, setTempAccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (settings.adsensePublisherId) {
      const pubId = settings.adsensePublisherId.startsWith('ca-pub-') 
        ? settings.adsensePublisherId 
        : `ca-pub-${settings.adsensePublisherId}`;
        
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      return () => {
        const scripts = document.head.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].src.includes('adsbygoogle.js')) {
            document.head.removeChild(scripts[i]);
          }
        }
      };
    }
  }, [settings.adsensePublisherId]);

  const hasValidPaidAccess = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const u = user as User;
    if (!u.is_paid) return false;
    
    if (!u.payment_expiry) return true;
    const expiry = new Date(u.payment_expiry);
    return expiry > new Date();
  };

  const refreshUserStatus = async () => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();
      if (data && !error) { login(data); }
    } catch (err) {
      console.error("Status check failed", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (adState === 'watching_1' || adState === 'watching_2') {
      interval = setInterval(() => {
        setAdTimer((prev) => {
          if (prev <= 1) {
            if (adState === 'watching_1') {
              setAdState('watching_2');
              return 30;
            } else {
              setAdState('finished');
              setTempAccess(true);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [adState]);

  const handlePayNow = () => {
    if (!user) return;
    const message = encodeURIComponent(`Hello Budget Lab! 👋\n\nI'm ready to upgrade to Premium Access.\n\n*Name:* ${user.name}\n*Email:* ${user.email}\n\nPlease provide payment details so I can gain full access.`);
    const cleanPhone = settings.contactPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const startAdSequence = () => {
    setAdState('watching_1');
    setAdTimer(30);
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white z-[9999]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-black text-gray-900 tracking-widest uppercase">Verifying Access...</p>
        </div>
      </div>
    );
  }

  const isRegister = location.pathname === '/register';
  const isPaid = hasValidPaidAccess();
  const isLocked = !user || (!isPaid && !tempAccess);

  return (
    <div className="relative min-h-screen">
      <div className={`transition-all duration-700 ${isLocked ? 'blur-[2.5px] brightness-[0.98] saturate-[0.95] pointer-events-none select-none h-screen overflow-hidden' : ''}`}>
        {children}
      </div>

      {isLocked && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-white/5 backdrop-blur-[0.5px] animate-in fade-in duration-700">
          <div className="w-full max-w-[540px] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            
            {!user ? (
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
                {isRegister ? <RegisterPage /> : <LoginPage />}
              </div>
            ) : adState === 'watching_1' || adState === 'watching_2' ? (
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden p-8 md:p-12 text-center">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Watching Ad {adState === 'watching_1' ? '1' : '2'} of 2</h2>
                  <p className="text-gray-500 text-xs mt-1 font-medium italic">Unlocked in {adTimer}s</p>
                </div>

                <AdSenseUnit slotId={adState === 'watching_1' ? settings.adsenseSlot1 : settings.adsenseSlot2} />

                <div className="mt-6 flex items-center justify-center space-x-2">
                  <div className="flex-grow h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand transition-all duration-1000" 
                      style={{ width: `${(30 - adTimer) / 30 * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 w-8">{adTimer}s</span>
                </div>

                <p className="mt-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                  DO NOT CLOSE THIS WINDOW
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden p-10 md:p-14 text-center">
                <div className="flex justify-center mb-10">
                  <div className="flex flex-col items-center leading-none select-none">
                    <span className="text-xl font-[900] tracking-tight text-black">BUDGET</span>
                    <span className="text-xl font-[900] tracking-[0.15em] text-black">LAB</span>
                  </div>
                </div>

                <h2 className="text-3xl font-[900] text-gray-900 mb-4 tracking-tight leading-tight">Lab Access Required</h2>
                <p className="text-gray-500 text-sm mb-10 font-medium italic">Welcome {user.name}! Your account is pending approval.</p>

                <div className="space-y-4">
                  <button onClick={handlePayNow} className="w-full group relative bg-gray-900 text-white p-6 rounded-[1.5rem] flex items-center justify-between hover:bg-black transition-all transform active:scale-[0.98] shadow-xl overflow-hidden">
                    <div className="flex items-center text-left">
                      <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform"><CreditCard className="w-6 h-6" /></div>
                      <div>
                        <p className="text-lg font-black leading-none">Pay Now</p>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">30 Days Unlimited Access</p>
                      </div>
                    </div>
                    <div className="bg-brand text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{settings.paymentPrice}</div>
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center"><span className="bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">OR</span></div>
                  </div>

                  <button onClick={startAdSequence} className="w-full group bg-white border-2 border-gray-100 p-6 rounded-[1.5rem] flex items-center justify-between hover:border-brand hover:bg-brand/5 transition-all transform active:scale-[0.98]">
                    <div className="flex items-center text-left">
                      <div className="bg-brand/10 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform"><PlayCircle className="w-6 h-6 text-brand" /></div>
                      <div>
                        <p className="text-lg font-black leading-none text-gray-900">Watch Ads</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Temporary Session Access</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-gray-200 group-hover:text-brand transition-colors" />
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col items-center">
                  <button onClick={refreshUserStatus} disabled={isRefreshing} className="group text-[11px] font-black text-brand uppercase tracking-widest flex items-center hover:opacity-80 disabled:opacity-50">
                    {isRefreshing ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2 group-hover:rotate-180 transition-transform duration-500" />}
                    Check For Admin Approval
                  </button>
                  <p className="mt-4 text-[9px] text-gray-300 font-bold uppercase tracking-widest max-w-[280px] leading-relaxed">
                    Wait while your payment is being verified
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  return (
    <HashRouter>
      <ScrollToTop />
      <AuthGate>
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/download/:productId" element={<MainLayout><ProductDetail /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout><UserDashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><MainLayout><UserDashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <div />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <div />} />
        </Routes>
      </AuthGate>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
