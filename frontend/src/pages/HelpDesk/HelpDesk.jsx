import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { helpDeskService } from './helpDesk.service';

import HelpHero from './HelpHero';
import AskAgriQura from './AskAgriQura';
import KnowledgeCenter from './KnowledgeCenter';
import ReportProblem from './ReportProblem';
import ExpertAssistance from './ExpertAssistance';
import NearbyServices from './NearbyServices';
import HelpHistory from './HelpHistory';
import HelpFooterCTA from './HelpFooterCTA';

export default function HelpDesk() {
  const { user, isAuthenticated } = useAuth();

  const [language, setLanguage] = useState('en');

  // Dynamic Data States
  const [resources, setResources] = useState([]);
  const [services, setServices] = useState([]);
  const [history, setHistory] = useState([]);

  // Loading & Error States
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [resourcesError, setResourcesError] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    loadAllData();
  }, []);

  // Fetch History whenever auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      loadHistoryData();
    } else {
      setHistory([]);
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    // 1. Knowledge Resources
    loadResourcesData();

    // 2. Services
    setLoadingServices(true);
    const srvRes = await helpDeskService.getNearbyServices();
    setServices(srvRes.data || []);
    setLoadingServices(false);
  };

  const loadResourcesData = async () => {
    setLoadingResources(true);
    setResourcesError(null);
    const resRes = await helpDeskService.getResources();
    if (resRes.error) {
      setResourcesError(resRes.error);
    }
    setResources(resRes.data || []);
    setLoadingResources(false);
  };

  const loadHistoryData = async () => {
    setLoadingHistory(true);
    const histRes = await helpDeskService.getHelpHistory();
    setHistory(histRes.data || []);
    setLoadingHistory(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-agri-500 selection:text-white">
      {/* 1. Clean Help Hero with Regional Language Switcher */}
      <HelpHero
        language={language}
        setLanguage={setLanguage}
      />

      {/* 2. Report a Problem / Advisory Issue Form */}
      <ReportProblem
        user={user}
        onReportSubmitted={loadHistoryData}
      />

      {/* 4. Connect with Agricultural Expert Network */}
      <div id="expert-assistance">
        <ExpertAssistance />
      </div>

      {/* 5. Agronomy Knowledge Center (Best Practice Guides) */}
      <div id="knowledge-center">
        <KnowledgeCenter
          resources={resources}
          loading={loadingResources}
          error={resourcesError}
          onRetry={loadResourcesData}
        />
      </div>

      {/* 6. Nearby Agricultural Services & KVK Directory */}
      <div id="nearby-services">
        <NearbyServices
          services={services}
          loading={loadingServices}
        />
      </div>

      {/* 7. Direct AI Agricultural Advisory Highlight Banner */}
      <AskAgriQura />

      {/* 8. Help & Support Ticket History (Auth-Gated) */}
      <HelpHistory
        isAuthenticated={isAuthenticated}
        history={history}
        loading={loadingHistory}
      />

      {/* 9. Closing Support Footer CTA */}
      <HelpFooterCTA />
    </div>
  );
}
