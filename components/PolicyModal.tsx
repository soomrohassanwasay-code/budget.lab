
import React from 'react';
import { X } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
          </button>
        </div>

        {/* Content Area */}
        <div className="px-10 py-10 overflow-y-auto">
          <div className="prose prose-sm prose-slate max-w-none text-gray-600 space-y-8 font-medium leading-relaxed">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex justify-end flex-shrink-0">
          <button 
            onClick={onClose}
            className="bg-brand text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg brand-shadow hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};
