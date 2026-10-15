import React, { useState, useRef } from 'react';
import ContactHero from '../components/ContactPage/ContactHero';
import ContactMethods from '../components/ContactPage/ContactMethods';
import ContactForm from '../components/ContactPage/ContactForm';
import SmartContactAssistant from '../components/ContactPage/SmartContactAssistant';
import VoiceContact from '../components/ContactPage/VoiceContact';
import FarmerSupportCard from '../components/ContactPage/FarmerSupportCard';
import ExpertSupport from '../components/ContactPage/ExpertSupport';
import DeveloperCard from '../components/ContactPage/DeveloperCard';
import ContactCTA from '../components/ContactPage/ContactCTA';

export default function Contact() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const formRef = useRef(null);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPartnership = () => {
    setSelectedSubject('Partnership / Institutional');
    scrollToForm();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 min-h-screen">

      {/* ───── 1. Hero Section ───── */}
      <ContactHero onScrollToForm={scrollToForm} />

      {/* ───── 2. Direct Contact Channels ───── */}
      <ContactMethods onSelectPartnership={handleSelectPartnership} />

      {/* ───── 3. Two-Column Workspace (Form + Smart Tools) ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Centerpiece Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <ContactForm
            selectedSubject={selectedSubject}
            onResetSubject={() => setSelectedSubject('')}
            formRef={formRef}
          />
        </div>

        {/* Right Column: AI Assistant, Voice Contact, Farmer Links & Expert Connect (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <DeveloperCard />
          <SmartContactAssistant />
          <VoiceContact />
          <FarmerSupportCard />
          <ExpertSupport />
        </div>

      </div>

      {/* ───── 4. Trust & Security Section ───── */}
      <ContactCTA />

    </div>
  );
}
