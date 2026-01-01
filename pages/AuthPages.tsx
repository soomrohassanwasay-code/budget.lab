
import React, { useState } from 'react';
import { User as UserIcon, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: loginError } = await supabase.login(email, password);
      
      if (loginError) {
        setError(typeof loginError === 'string' ? loginError : (loginError as any).message || 'Login failed');
        setIsSubmitting(false);
        return;
      }

      if (activeTab === 'admin' && data?.role !== 'admin') {
        setError('Unauthorized access.');
        setIsSubmitting(false);
        return;
      }

      if (data) {
        login(data);
        if (activeTab === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'System error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-8 md:p-12 text-center animate-in fade-in duration-500">
      {/* Branding Logo */}
      <div className="flex justify-center mb-10">
        <div className="flex flex-col items-center leading-none select-none">
          <span className="text-xl font-[900] tracking-tight text-black">BUDGET</span>
          <span className="text-xl font-[900] tracking-[0.15em] text-black">LAB</span>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Sign in to proceed further</h1>

      {/* Tabs */}
      <div className="flex bg-[#f4f6f8] rounded-xl p-1.5 mb-8">
        <button 
          onClick={() => { setActiveTab('user'); setError(''); }}
          className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'user' ? 'bg-brand text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserIcon className="w-4 h-4 mr-2" /> User
        </button>
        <button 
          onClick={() => { setActiveTab('admin'); setError(''); }}
          className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'admin' ? 'bg-brand text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mr-2" /> Admin
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if(error) setError(''); }}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none transition-all"
          required
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if(error) setError(''); }}
          className={`w-full px-5 py-4 bg-gray-50 border rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none transition-all ${
            error ? 'border-red-500' : 'border-gray-200'
          }`}
          required
        />
        
        {error && <p className="text-red-500 text-xs font-bold text-left px-1">{error}</p>}
        
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand text-white py-4 rounded-xl font-black text-sm hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50 mt-2 shadow-lg brand-shadow"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><ArrowRight className="w-4 h-4 mr-2" /> {activeTab === 'admin' ? 'Admin Access' : 'Sign in'}</>
          )}
        </button>
      </form>

      {activeTab === 'user' && (
        <p className="mt-8 text-sm text-gray-400 font-bold">
          Don't have an account? <Link to="/register" className="text-brand hover:underline">Sign up</Link>
        </p>
      )}
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: regError } = await supabase.register({
        email,
        name,
        phone,
        password
      });

      if (regError) {
        // Display the actual error message string returned from the service
        setError(typeof regError === 'string' ? regError : (regError as any).message || 'Registration failed');
        setIsSubmitting(false);
        return;
      }
      
      if (data) {
        login(data);
        // After login, the AuthGate in App.tsx handles showing the next step
        navigate('/');
      }
    } catch (err: any) {
      console.error('Catch-all Register Error:', err);
      setError(err.message || 'A system error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-8 md:p-12 text-center animate-in fade-in duration-500">
      {/* Branding Logo */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center leading-none select-none">
          <span className="text-xl font-[900] tracking-tight text-black">BUDGET</span>
          <span className="text-xl font-[900] tracking-[0.15em] text-black">LAB</span>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create account</h1>
      <p className="text-gray-500 text-sm mb-8 font-medium">Get started with your template</p>

      <form onSubmit={handleRegister} className="space-y-4 text-left">
        <div className="space-y-1">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none transition-all" 
            required 
          />
        </div>
        <div className="space-y-1">
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none transition-all" 
            required 
          />
        </div>
        <div className="space-y-1">
          <input 
            type="tel" 
            placeholder="WhatsApp Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none transition-all" 
          />
        </div>
        <div className="space-y-1">
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-1 focus:ring-brand outline-none transition-all" 
            required 
          />
        </div>
        
        {error && <p className="text-red-500 text-xs font-black px-1 mt-1">{error}</p>}
        
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-brand text-white py-4 rounded-xl font-black text-sm hover:opacity-90 transition-all flex items-center justify-center shadow-lg brand-shadow disabled:opacity-50 mt-4 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><ArrowRight className="w-4 h-4 mr-2" /> Create Account</>
          )}
        </button>
      </form>
      <p className="mt-8 text-sm text-gray-400 font-bold">
        Already have an account? <Link to="/login" className="text-brand hover:underline">Sign in</Link>
      </p>
    </div>
  );
};
