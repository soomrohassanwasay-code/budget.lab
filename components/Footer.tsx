
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { PolicyModal } from './PolicyModal';

export const Footer: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-white">
      {/* Privacy Policy Modal */}
      <PolicyModal 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
        title="Privacy Policy"
      >
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">1. Information We Collect</h3>
            <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, and billing information.</p>
          </section>
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">2. How We Use Your Information</h3>
            <p>Your information is used to provide and maintain our services, process transactions, send technical notices, and provide customer support. We never sell your personal data to third parties.</p>
          </section>
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">3. Data Security</h3>
            <p>We use industry-standard security measures to protect your information. Our templates are digital downloads, and we do not store your personal financial data on our servers after the template is downloaded to your device.</p>
          </section>
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">4. Cookies</h3>
            <p>We use cookies to improve your browsing experience and analyze our traffic. You can control cookie settings through your browser at any time.</p>
          </section>
        </div>
      </PolicyModal>

      {/* Refund Policy Modal */}
      <PolicyModal 
        isOpen={isRefundOpen} 
        onClose={() => setIsRefundOpen(false)} 
        title="Refund Policy"
      >
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">1. Digital Nature of Goods</h3>
            <p>Due to the nature of digital templates (Excel, Google Sheets, Notion), all sales are final once the product has been accessed or downloaded. We cannot "return" digital products once they have been delivered.</p>
          </section>
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">2. Exceptions for Refunds</h3>
            <p>Refunds may be granted at our discretion under the following circumstances:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>The digital file is corrupt and cannot be opened.</li>
              <li>There was an accidental duplicate purchase of the exact same product.</li>
              <li>The product has not been downloaded or accessed yet.</li>
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">3. How to Request a Refund</h3>
            <p>If you believe you are eligible for a refund, please contact our support team via WhatsApp with your order details. We aim to review and process all requests within 48 hours.</p>
          </section>
        </div>
      </PolicyModal>

      {/* Terms of Service Modal */}
      <PolicyModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
        title="Terms of Service"
      >
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">1. License for Use</h3>
            <p>By purchasing our templates, you are granted a non-exclusive, non-transferable license for personal or internal business use. You may not resell, redistribute, or share these files with third parties.</p>
          </section>
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">2. Disclaimer of Financial Advice</h3>
            <p>Budget Lab provides tools and templates for financial tracking. We are not financial advisors. The use of our templates does not constitute professional financial advice. Always consult with a certified professional for complex financial decisions.</p>
          </section>
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">3. Limitation of Liability</h3>
            <p>Budget Lab is not liable for any financial losses or errors resulting from the use of our templates. It is the user's responsibility to verify the accuracy of their own data entry and the formulas provided.</p>
          </section>
          <section>
            <h3 className="text-lg font-black text-gray-900 mb-2">4. Account Responsibilities</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </section>
        </div>
      </PolicyModal>

      {/* Curved Background Wrapper */}
      <div className="relative bg-[#bfa4f6] text-white pt-24 pb-12">
        {/* Top Arc Shape */}
        <div className="absolute top-0 left-0 right-0 -translate-y-[98%] overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
            className="relative block w-full h-[40px] text-[#bfa4f6] fill-current"
          >
            <path d="M0,40 Q720,0 1440,40 L1440,40 L0,40 Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-32 mb-16">
            
            {/* Centered Large Logo - BUDGET LAB (Clean Version) */}
            <div className="flex flex-col items-center mb-12 md:mb-0 select-none">
              <div className="flex flex-col items-center leading-[0.85]">
                <span className="text-6xl font-[900] tracking-tighter text-white">BUDGET</span>
                <span className="text-6xl font-[900] tracking-[0.15em] text-white">LAB</span>
              </div>
              <div className="w-16 h-1.5 bg-white/30 rounded-full mt-8"></div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col items-center justify-center space-y-6">
              <Link to="/contact" className="text-lg font-extrabold hover:opacity-80 transition-opacity tracking-wide">Contact</Link>
              <button 
                onClick={() => setIsPrivacyOpen(true)}
                className="text-lg font-extrabold hover:opacity-80 transition-opacity tracking-wide cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setIsRefundOpen(true)}
                className="text-lg font-extrabold hover:opacity-80 transition-opacity tracking-wide cursor-pointer"
              >
                Refund Policy
              </button>
              <button 
                onClick={() => setIsTermsOpen(true)}
                className="text-lg font-extrabold hover:opacity-80 transition-opacity tracking-wide cursor-pointer"
              >
                Terms of Service
              </button>
            </nav>
          </div>

          {/* Payment Icons Section */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 mb-10">
            <div className="bg-[#3b78be] px-4 py-1.5 rounded-md text-[10px] font-black italic text-white shadow-sm flex items-center justify-center h-8 min-w-[68px]">AMEX</div>
            <div className="bg-[#111111] px-4 py-1.5 rounded-md text-[10px] font-bold text-white shadow-sm flex items-center justify-center h-8 min-w-[68px]">Pay</div>
            <div className="bg-white px-3 py-1.5 rounded-md text-[7px] font-black text-black shadow-sm flex items-center justify-center h-8 border border-gray-100 min-w-[68px]">BANCONTACT</div>
            <div className="bg-white px-4 py-1.5 rounded-md text-[10px] font-bold text-gray-500 shadow-sm flex items-center justify-center h-8 border border-gray-100 min-w-[68px]">
              <span className="text-[#4285F4] font-black mr-1">G</span> Pay
            </div>
            <div className="bg-[#fbfcff] px-4 py-1.5 rounded-md text-[10px] font-black italic text-[#cc3366] shadow-sm flex items-center justify-center h-8 border border-gray-100 min-w-[68px]">ideal</div>
            <div className="bg-white px-4 py-1.5 rounded-md shadow-sm flex items-center justify-center h-8 border border-gray-100 min-w-[68px]">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-[#EB001B] opacity-80"></div>
                <div className="w-5 h-5 rounded-full bg-[#00529B] opacity-80"></div>
              </div>
            </div>
            <div className="bg-[#21255c] px-4 py-1.5 rounded-md shadow-sm flex items-center justify-center h-8 min-w-[68px]">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-[#EB001B] opacity-90"></div>
                <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-90"></div>
              </div>
            </div>
            <div className="bg-[#fbfcff] px-4 py-1.5 rounded-md text-[10px] font-black italic text-[#003087] shadow-sm flex items-center justify-center h-8 border border-gray-100 min-w-[68px]">PayPal</div>
            <div className="bg-[#5a31f4] px-4 py-1.5 rounded-md text-[10px] font-bold text-white shadow-sm flex items-center justify-center h-8 min-w-[68px]">shop</div>
            <div className="bg-white px-3 py-1.5 rounded-md text-[10px] font-black text-black shadow-sm flex items-center justify-center h-8 border border-gray-100 min-w-[68px]">
              <div className="flex flex-col items-center scale-75">
                <span className="text-[7px] font-bold leading-none tracking-tighter">UnionPay</span>
                <span className="text-[9px] font-bold leading-none">银联</span>
              </div>
            </div>
            <div className="bg-white px-4 py-1.5 rounded-md text-[10px] font-black italic text-[#1A1F71] shadow-sm flex items-center justify-center h-8 border border-gray-100 min-w-[68px]">VISA</div>
          </div>

          {/* Copyright Text */}
          <div className="text-center text-white/70 text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            © 2025, BUDGET LAB
          </div>
        </div>

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className="absolute bottom-8 right-8 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all shadow-lg group"
        >
          <ChevronUp className="w-6 h-6 text-white group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};
