
import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

export const CartDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, removeFromCart, totalItems } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    document.addEventListener('open-cart', handleOpen);
    return () => document.removeEventListener('open-cart', handleOpen);
  }, []);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const itemsList = cart.map(item => `• ${item.title}`).join('\n');
    const message = encodeURIComponent(
      `Hello Budget Lab! 👋\n\nI would like to download the following templates:\n\n${itemsList}\n\nPlease provide the access links. Thank you!`
    );
    
    // Sanitize phone number for wa.me link
    const cleanPhone = settings.contactPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingBag className="w-6 h-6 text-brand mr-3" />
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Access List</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto px-6 py-8">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your list is empty</h3>
                <p className="text-gray-500 text-sm max-w-[200px]">Select a template to get immediate access.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center group">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1">{item.title}</h4>
                      <p className="text-xs text-brand font-black uppercase tracking-widest">Instant Delivery</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-gray-500 font-bold text-sm">Templates selected</span>
                <span className="text-gray-900 font-black">{totalItems}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-brand text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-dark transition-all flex items-center justify-center shadow-lg brand-shadow group"
              >
                Proceed to Download
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="mt-4 text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
                No payment required • Immediate WhatsApp delivery
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
