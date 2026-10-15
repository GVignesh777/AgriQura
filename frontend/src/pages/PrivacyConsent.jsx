import React, { useState } from 'react';
import api from '../services/api';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PrivacyConsent() {
  const [agreed, setAgreed] = useState(false);

  const handleAgree = async () => {
    try {
      await api.post('/consent', { consentType: 'DataPrivacy', isGranted: true });
      setAgreed(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-agri-500/20 text-agri-400 rounded-2xl border border-agri-500/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Farmer Data Privacy & Consent</h1>
        <p className="text-xs text-slate-400">Plain-language privacy policy compliant with Indian DPDP regulations.</p>
      </div>

      <div className="glass-card p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-bold text-white">How AgriQura Protects Your Farm Data:</h3>
        <p>1. <strong>Farm Telemetry:</strong> Your location, crop type, and soil data are used exclusively to deliver personalized agricultural advice and smart weather warnings.</p>
        <p>2. <strong>AI Query Storage:</strong> Chat conversations with Groq AI are stored securely to maintain conversation history and allow expert escalation when needed.</p>
        <p>3. <strong>Data Ownership:</strong> You retain complete ownership of your data and can request account deletion at any time.</p>

        {agreed ? (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Consent preferences updated & recorded.
          </div>
        ) : (
          <button onClick={handleAgree} className="btn-primary w-full py-3 text-sm">
            I Understand & Agree to Data Terms
          </button>
        )}
      </div>
    </div>
  );
}
