import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import schemesService from '../services/schemes.service';
import SchemesHero from '../components/GovernmentSchemes/SchemesHero';
import SchemeFinderWizard from '../components/GovernmentSchemes/SchemeFinderWizard';
import SchemeMatchResults from '../components/GovernmentSchemes/SchemeMatchResults';
import SchemeCard from '../components/GovernmentSchemes/SchemeCard';
import SchemeFilters from '../components/GovernmentSchemes/SchemeFilters';
import SchemeDetails from '../components/GovernmentSchemes/SchemeDetails';
import AskAgriQuraSchemeExplainer from '../components/GovernmentSchemes/AskAgriQuraSchemeExplainer';
import VoiceSchemeSearch from '../components/GovernmentSchemes/VoiceSchemeSearch';
import SavedSchemes from '../components/GovernmentSchemes/SavedSchemes';
import ApplicationTracker from '../components/GovernmentSchemes/ApplicationTracker';
import {
  SchemesLoadingSkeleton,
  SchemesEmptyState,
  SchemesErrorState
} from '../components/GovernmentSchemes/SchemesEmptyErrorStates';
import {
  Landmark,
  Sparkles,
  Bookmark,
  ListChecks,
  ShieldCheck,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function GovernmentSchemes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  // Main Data States
  const [schemes, setSchemes] = useState([]);
  const [states, setStates] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [syncInfo, setSyncInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All'); // 'All' | 'Central' | 'State'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFarmerType, setSelectedFarmerType] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [sortOption, setSortOption] = useState('recommended');

  // Navigation View Tab: 'all' | 'recommended' | 'saved' | 'tracker'
  const [activeViewTab, setActiveViewTab] = useState('all');

  // Recommendation & Wizard States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [matchedResults, setMatchedResults] = useState([]);
  const [matchedProfile, setMatchedProfile] = useState(null);

  // Modals
  const [selectedSchemeForDetails, setSelectedSchemeForDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSchemeForAI, setSelectedSchemeForAI] = useState(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Saved Schemes & Tracker
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [savedSchemeIds, setSavedSchemeIds] = useState(new Set());

  const schemesGridRef = useRef(null);

  // Initial Load
  useEffect(() => {
    loadStates();
    loadSavedSchemes();
  }, []);

  // Synchronize when URL search changes
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl !== null && searchFromUrl !== undefined) {
      setSearchQuery(searchFromUrl);
      setActiveViewTab('all');
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Listen for in-page voice scheme search events
  useEffect(() => {
    const handleVoiceSearch = (e) => {
      if (e.detail?.query) {
        setSearchQuery(e.detail.query);
        setActiveViewTab('all');
        setCurrentPage(1);
      }
    };
    window.addEventListener('agriqura-scheme-search', handleVoiceSearch);
    return () => window.removeEventListener('agriqura-scheme-search', handleVoiceSearch);
  }, []);

  // Fetch schemes when filters change
  useEffect(() => {
    loadSchemes();
  }, [
    searchQuery,
    selectedState,
    selectedLevel,
    selectedCategory,
    selectedFarmerType,
    selectedCrop,
    sortOption,
    currentPage
  ]);

  const loadStates = async () => {
    try {
      const res = await schemesService.getStates();
      if (res.success && res.states) {
        setStates(res.states);
      }
    } catch (err) {
      console.warn('Failed to fetch states list:', err.message);
    }
  };

  const loadSavedSchemes = async () => {
    try {
      const res = await schemesService.getSavedSchemes();
      if (res.success && res.savedSchemes) {
        setSavedSchemes(res.savedSchemes);
        setSavedSchemeIds(new Set(res.savedSchemes.map((s) => s.schemeId)));
      }
    } catch (err) {
      // Ignore if not logged in
    }
  };

  const loadSchemes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await schemesService.getSchemes({
        search: searchQuery,
        state: selectedState,
        governmentLevel: selectedLevel,
        category: selectedCategory,
        farmerType: selectedFarmerType,
        crop: selectedCrop,
        sort: sortOption,
        page: currentPage,
        limit: 12
      });

      if (res.success) {
        setSchemes(res.schemes || []);
        setTotalCount(res.totalCount || 0);
        setTotalPages(res.totalPages || 1);
        if (res.syncInfo) setSyncInfo(res.syncInfo);
      } else {
        setError(res.error || 'Failed to retrieve schemes');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to Government Schemes API. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit 5-Step Wizard
  const handleWizardSubmit = async (formData) => {
    setIsMatchingLoading(true);
    try {
      const res = await schemesService.matchSchemes(formData);
      if (res.success) {
        setMatchedResults(res.recommendedSchemes || []);
        setMatchedProfile(formData);
        setIsWizardOpen(false);
        setActiveViewTab('recommended');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsMatchingLoading(false);
    }
  };

  // Open Details Modal
  const handleOpenDetails = async (schemeItem) => {
    const id = schemeItem.schemeId || schemeItem.id;
    try {
      const res = await schemesService.getSchemeById(id);
      if (res.success && res.scheme) {
        setSelectedSchemeForDetails(res.scheme);
        setIsDetailsOpen(true);
      } else {
        setSelectedSchemeForDetails(schemeItem);
        setIsDetailsOpen(true);
      }
    } catch (err) {
      setSelectedSchemeForDetails(schemeItem);
      setIsDetailsOpen(true);
    }
  };

  // Open AI Explainer
  const handleOpenAIExplainer = (schemeItem) => {
    setSelectedSchemeForAI(schemeItem);
    setIsAIOpen(true);
  };

  // Save / Bookmark Scheme
  const handleSaveScheme = async (schemeItem) => {
    const schemeId = schemeItem.schemeId || schemeItem.id;
    const isAlreadySaved = savedSchemeIds.has(schemeId);

    if (isAlreadySaved) {
      // Remove
      try {
        await schemesService.removeSavedScheme(schemeId);
        setSavedSchemes((prev) => prev.filter((s) => s.schemeId !== schemeId));
        setSavedSchemeIds((prev) => {
          const next = new Set(prev);
          next.delete(schemeId);
          return next;
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      // Save
      try {
        const res = await schemesService.saveScheme({
          schemeId,
          schemeName: schemeItem.name,
          category: schemeItem.category,
          state: schemeItem.state,
          governmentLevel: schemeItem.governmentLevel,
          applicationUrl: schemeItem.applicationUrl
        });
        if (res.success && res.savedScheme) {
          setSavedSchemes((prev) => [res.savedScheme, ...prev]);
          setSavedSchemeIds((prev) => new Set([...prev, schemeId]));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Update Application Tracker Status
  const handleUpdateApplicationStatus = async (schemeId, newStatus, newNotes) => {
    try {
      const updatePayload = {};
      if (newStatus) updatePayload.applicationStatus = newStatus;
      if (newNotes !== undefined) updatePayload.personalNotes = newNotes;

      const res = await schemesService.updateApplicationStatus(schemeId, updatePayload);
      if (res.success && res.savedScheme) {
        setSavedSchemes((prev) =>
          prev.map((s) => (s.schemeId === schemeId ? res.savedScheme : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Apply Voice Query
  const handleApplyVoiceQuery = (voiceText) => {
    setSearchQuery(voiceText);
    setCurrentPage(1);
    setActiveViewTab('all');
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedState('All');
    setSelectedLevel('All');
    setSelectedCategory('All');
    setSelectedFarmerType('All');
    setSelectedCrop('All');
    setSortOption('recommended');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedState !== 'All' ||
    selectedLevel !== 'All' ||
    selectedCategory !== 'All' ||
    sortOption !== 'recommended';

  const scrollToSchemes = () => {
    if (schemesGridRef.current) {
      schemesGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">

      {/* ───── Hero Section ───── */}
      <SchemesHero
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedState={selectedState}
        onStateChange={(st) => {
          setSelectedState(st);
          setCurrentPage(1);
        }}
        states={states}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onScrollToSchemes={scrollToSchemes}
        totalSchemes={totalCount}
        syncInfo={syncInfo}
      />

      {/* ───── Main Navigation Tabs (All, Recommended, Saved, Tracker) ───── */}
      <div ref={schemesGridRef} className="flex items-center justify-between border-b border-slate-800 pb-1 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveViewTab('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeViewTab === 'all'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>All Government Schemes ({totalCount})</span>
          </button>

          {matchedResults.length > 0 && (
            <button
              onClick={() => setActiveViewTab('recommended')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeViewTab === 'recommended'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Recommended For You ({matchedResults.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveViewTab('saved')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeViewTab === 'saved'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Schemes ({savedSchemes.length})</span>
          </button>

          <button
            onClick={() => setActiveViewTab('tracker')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeViewTab === 'tracker'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            <span>Application Tracker</span>
          </button>
        </div>
      </div>

      {/* ───── TAB 1: ALL SCHEMES (BROWSE & FILTER) ───── */}
      {activeViewTab === 'all' && (
        <div className="space-y-6">
          <SchemeFilters
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            selectedLevel={selectedLevel}
            onSelectLevel={(lvl) => {
              setSelectedLevel(lvl);
              setCurrentPage(1);
            }}
            selectedState={selectedState}
            onSelectState={(st) => {
              setSelectedState(st);
              setCurrentPage(1);
            }}
            states={states}
            selectedFarmerType={selectedFarmerType}
            onSelectFarmerType={setSelectedFarmerType}
            selectedCrop={selectedCrop}
            onSelectCrop={setSelectedCrop}
            sortOption={sortOption}
            onSelectSort={setSortOption}
            onResetFilters={handleResetFilters}
            totalResultCount={totalCount}
            hasActiveFilters={hasActiveFilters}
          />

          {isLoading ? (
            <SchemesLoadingSkeleton count={6} />
          ) : error ? (
            <SchemesErrorState error={error} onRetry={loadSchemes} />
          ) : schemes.length === 0 ? (
            <SchemesEmptyState onResetFilters={handleResetFilters} searchQuery={searchQuery} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schemes.map((scheme) => (
                <SchemeCard
                  key={scheme.schemeId || scheme.id}
                  scheme={scheme}
                  onViewDetails={handleOpenDetails}
                  onSaveScheme={handleSaveScheme}
                  isSaved={savedSchemeIds.has(scheme.schemeId || scheme.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 disabled:opacity-40 hover:text-white flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="text-xs text-slate-400 px-3">
                Page <strong className="text-white">{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 disabled:opacity-40 hover:text-white flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ───── TAB 2: RECOMMENDED SCHEMES (WIZARD RESULTS) ───── */}
      {activeViewTab === 'recommended' && (
        <SchemeMatchResults
          results={matchedResults}
          profile={matchedProfile}
          onResetMatch={() => setIsWizardOpen(true)}
          onViewDetails={handleOpenDetails}
          onSaveScheme={handleSaveScheme}
          savedSchemeIds={savedSchemeIds}
        />
      )}

      {/* ───── TAB 3: SAVED SCHEMES ───── */}
      {activeViewTab === 'saved' && (
        <SavedSchemes
          savedSchemes={savedSchemes}
          onViewDetails={handleOpenDetails}
          onRemoveSaved={handleSaveScheme}
          onUpdateStatus={handleUpdateApplicationStatus}
        />
      )}

      {/* ───── TAB 4: APPLICATION TRACKER ───── */}
      {activeViewTab === 'tracker' && (
        <ApplicationTracker
          savedSchemes={savedSchemes}
          onUpdateStatus={handleUpdateApplicationStatus}
          onViewDetails={handleOpenDetails}
        />
      )}

      {/* ───── Mandatory Core Trust & Safety Notice Footer Banner ───── */}
      <section className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 max-w-3xl">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-agri-400" />
            <span>Official Government Source & Advisory Trust Standard</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Scheme information on AgriQura is aggregated from official government portals (myScheme.gov.in, agricoop.nic.in, and respective State Department notifications). AgriQura does not determine eligibility. Official approval is governed by the designated authority.
          </p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl whitespace-nowrap shadow-md"
        >
          Re-check Eligibility
        </button>
      </section>

      {/* ───── Modals ───── */}

      {/* 5-Step Matching Wizard */}
      <SchemeFinderWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmitWizard={handleWizardSubmit}
        isLoading={isMatchingLoading}
      />

      {/* Scheme Full Details Modal */}
      <SchemeDetails
        scheme={selectedSchemeForDetails}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onOpenAIExplainer={(scheme) => {
          setIsDetailsOpen(false);
          handleOpenAIExplainer(scheme);
        }}
        onSaveScheme={handleSaveScheme}
        isSaved={
          selectedSchemeForDetails
            ? savedSchemeIds.has(selectedSchemeForDetails.schemeId || selectedSchemeForDetails.id)
            : false
        }
      />

      {/* AI Explainer Modal (Groq Llama 3) */}
      <AskAgriQuraSchemeExplainer
        scheme={selectedSchemeForAI}
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Voice Search Modal */}
      <VoiceSchemeSearch
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onApplyVoiceQuery={handleApplyVoiceQuery}
      />

    </div>
  );
}
