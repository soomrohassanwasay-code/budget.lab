
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface Settings {
  contactEmail: string;
  contactPhone: string;
  adsensePublisherId: string;
  adsenseSlot1: string;
  adsenseSlot2: string;
  paymentPrice: string;
}

interface SettingsContextType {
  settings: Settings;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    contactEmail: 'support@budgetlab.com',
    contactPhone: '15550123',
    adsensePublisherId: '',
    adsenseSlot1: '',
    adsenseSlot2: '',
    paymentPrice: '$19.99'
  });
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const { data } = await supabase.getSettings();
      if (data) {
        setSettings({
          contactEmail: data.contactEmail || 'support@budgetlab.com',
          contactPhone: data.contactPhone || '15550123',
          adsensePublisherId: data.adsensePublisherId || '',
          adsenseSlot1: data.adsenseSlot1 || '',
          adsenseSlot2: data.adsenseSlot2 || '',
          paymentPrice: data.paymentPrice || '$19.99'
        });
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
