
import React, { useState } from 'react';
import { Send, Mail, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });

  // Helper to sanitize phone number for WhatsApp links (remove everything but digits)
  const sanitizePhone = (phone: string) => phone.replace(/\D/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the WhatsApp message
    const message = encodeURIComponent(
      `New Contact Inquiry from Budget Lab! 📬\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone || 'Not provided'}\n\n` +
      `*Message:* \n${formData.comment}`
    );

    const cleanPhone = sanitizePhone(settings.contactPhone);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppClick = () => {
    const cleanPhone = sanitizePhone(settings.contactPhone);
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white py-20 min-h-[60vh] animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-[900] text-gray-900 tracking-tight">
            Contact Us
          </h1>
        </div>

        <div className="relative">
          {submitted ? (
            <div className="text-center py-12 bg-gray-50 rounded-[40px] border border-gray-100">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
              <p className="text-gray-500">Thanks for reaching out. We've redirected your message to our support team on WhatsApp.</p>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', comment: '' });
                }} 
                className="mt-8 text-brand font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      required 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-5 bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white rounded-[20px] transition-all text-gray-800 placeholder-gray-400 font-bold outline-none" 
                      placeholder="Name" 
                    />
                  </div>
                  <div className="relative">
                    <input 
                      required 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-5 bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white rounded-[20px] transition-all text-gray-800 placeholder-gray-400 font-bold outline-none" 
                      placeholder="Email" 
                    />
                  </div>
                </div>

                <div className="relative">
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-5 bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white rounded-[20px] transition-all text-gray-800 placeholder-gray-400 font-bold outline-none" 
                    placeholder="Phone number" 
                  />
                </div>

                <div className="relative">
                  <textarea 
                    required 
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={6} 
                    className="w-full p-5 bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white rounded-[20px] transition-all text-gray-800 placeholder-gray-400 font-bold outline-none resize-none" 
                    placeholder="Comment"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand text-white py-5 rounded-[20px] font-black text-xl hover:bg-brand-dark transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center brand-shadow"
                >
                  Send Message
                </button>
              </form>

              {/* Direct Contact Icons Section */}
              <div className="mt-20 pt-12 border-t border-gray-50">
                <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Or reach us directly</p>
                <div className="flex justify-center items-center">
                  <button 
                    onClick={handleWhatsAppClick}
                    className="group flex flex-col items-center space-y-3 transition-transform hover:scale-110"
                    title="WhatsApp"
                  >
                    <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center border border-green-100 group-hover:bg-green-500 group-hover:border-green-500 transition-all duration-300">
                      <MessageCircle className="w-7 h-7 text-green-500 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-green-500">WhatsApp</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
