import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GlobalVoiceProvider, GlobalVoiceUI } from './voice';
import Navbar from './components/layout/Navbar';
import MobileNav from './components/layout/MobileNav';
import FloatingLanguageToggle from './components/layout/FloatingLanguageToggle';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import './i18n/i18n';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalVoiceProvider>
          <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
            <Navbar />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
            <MobileNav />
            <FloatingLanguageToggle />
            <GlobalVoiceUI />
          </div>
        </GlobalVoiceProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
