import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Registration from '../pages/Registration';
import FarmerDashboard from '../pages/FarmerDashboard';
import AIAssistant from '../pages/AIAssistant';
import CropAdvisory from '../pages/CropAdvisory';
import DiseaseDetection from '../pages/DiseaseDetection';
import Weather from '../pages/Weather';
import MarketIntelligence from '../pages/MarketIntelligence';
import GovernmentSchemes from '../pages/GovernmentSchemes';
import SoilHealth from '../pages/SoilHealth';
import MyFarm from '../pages/MyFarm';
import AlertsPage from '../pages/AlertsPage';
import AdvisoryHistory from '../pages/AdvisoryHistory';
import KnowledgeHub from '../pages/KnowledgeHub';
import Community from '../pages/Community';
import ExpertConnect from '../pages/ExpertConnect';
import Profile from '../pages/Profile';
import OnboardingTutorial from '../pages/OnboardingTutorial';
import PrivacyConsent from '../pages/PrivacyConsent';
import ExpertDashboard from '../pages/ExpertDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import FAQ from '../pages/FAQ';
import HelpDesk from '../pages/HelpDesk/HelpDesk';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      
      {/* Protected Farmer Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path="/voice" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path="/crop-advisory" element={<ProtectedRoute><CropAdvisory /></ProtectedRoute>} />
      <Route path="/disease" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
      <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
      <Route path="/market" element={<ProtectedRoute><MarketIntelligence /></ProtectedRoute>} />
      <Route path="/schemes" element={<ProtectedRoute><GovernmentSchemes /></ProtectedRoute>} />
      <Route path="/soil" element={<ProtectedRoute><SoilHealth /></ProtectedRoute>} />
      <Route path="/my-farm" element={<ProtectedRoute><MyFarm /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><AdvisoryHistory /></ProtectedRoute>} />
      <Route path="/knowledge" element={<ProtectedRoute><KnowledgeHub /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/expert" element={<ProtectedRoute><ExpertConnect /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/tutorial" element={<OnboardingTutorial />} />
      <Route path="/privacy" element={<PrivacyConsent />} />

      {/* Role Dashboards */}
      <Route path="/expert-dashboard" element={<ProtectedRoute><ExpertDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

      {/* Public Pages */}
      <Route path="/faq" element={<FAQ />} />
      <Route path="/help-desk" element={<HelpDesk />} />
      <Route path="/contact" element={<Contact />} />

      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
