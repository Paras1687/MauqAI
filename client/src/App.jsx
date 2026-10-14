import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import SearchForm from './components/SearchForm.jsx';
import RadarScanner from './components/RadarScanner.jsx';
import OpportunityCard from './components/OpportunityCard.jsx';
import FilterToolbar from './components/FilterToolbar.jsx';
import EmptyState from './components/EmptyState.jsx';
import ErrorState from './components/ErrorState.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';
import { Info, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Candidate Profile State
  const [profile, setProfile] = useState({
    opportunityType: 'Internship',
    skills: ['Python', 'Machine Learning', 'Data Structures'],
    educationLevel: 'Undergraduate',
    graduationYear: 2026,
    preferredLocation: 'Remote or US',
    remoteOnly: false,
    minStipend: 0,
    keywords: ['Google', 'Research', 'AI'],
    deadline: ''
  });

  // App Execution State
  const [status, setStatus] = useState('idle'); // 'idle' | 'scanning' | 'complete' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [visitedEndpoints, setVisitedEndpoints] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeEndpoint, setActiveEndpoint] = useState(null);
  const [streamingUrl, setStreamingUrl] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [mode, setMode] = useState('fallback');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Filters & Sorting State
  const [typeFilter, setTypeFilter] = useState('All');
  const [remoteOnlyFilter, setRemoteOnlyFilter] = useState(false);
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState(false);
  const [sortBy, setSortBy] = useState('match_score');

  // Verify backend and TinyFish status on mount
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setIsConfigured(data.tinyfish_configured);
        setMode(data.mode);
      })
      .catch(err => {
        console.warn('Backend status check failed:', err.message);
      });
  }, []);

  // Handle Search using SSE streaming
  const handleSearch = async () => {
    setStatus('scanning');
    setErrorMessage(null);
    setActivityLog([]);
    setCurrentStep(1);
    setActiveEndpoint(null);
    setStreamingUrl(null);
    setOpportunities([]);

    try {
      const response = await fetch('/api/scan-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // keep remainder

        for (const block of lines) {
          const matchEvent = block.match(/^event: (.+)$/m);
          const matchData = block.match(/^data: (.+)$/m);

          if (matchEvent && matchData) {
            const eventType = matchEvent[1].trim();
            const payload = JSON.parse(matchData[1]);

            if (eventType === 'progress') {
              if (payload.step) setCurrentStep(payload.step);
              if (payload.endpoint) setActiveEndpoint(payload.endpoint);
              if (payload.streamingUrl) setStreamingUrl(payload.streamingUrl);
              setActivityLog(prev => [...prev, payload]);
            } else if (eventType === 'complete') {
              setOpportunities(payload.opportunities || []);
              setVisitedEndpoints(payload.visited_endpoints || []);
              setMode(payload.mode || 'fallback');
              setStatus('complete');
            } else if (eventType === 'error') {
              throw new Error(payload.message || 'Stream processing error');
            }
          }
        }
      }
    } catch (err) {
      console.error('Scan stream error:', err);
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  // Filtered & Sorted Opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(opp => {
        // Type filter
        if (typeFilter !== 'All') {
          const t = (opp.type || '').toLowerCase();
          if (!t.includes(typeFilter.toLowerCase())) return false;
        }
        // Remote only filter
        if (remoteOnlyFilter) {
          const loc = (opp.location || '').toLowerCase();
          if (!loc.includes('remote') && !loc.includes('virtual')) return false;
        }
        // Verified only filter
        if (verifiedOnlyFilter) {
          if (opp.verification_status !== 'Verified') return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match_score') {
          return (b.match_score || 0) - (a.match_score || 0);
        }
        if (sortBy === 'compensation') {
          const compA = extractNumeric(a.compensation);
          const compB = extractNumeric(b.compensation);
          return compB - compA;
        }
        if (sortBy === 'deadline') {
          return (a.deadline || '').localeCompare(b.deadline || '');
        }
        return 0;
      });
  }, [opportunities, typeFilter, remoteOnlyFilter, verifiedOnlyFilter, sortBy]);

  function extractNumeric(text) {
    if (!text) return 0;
    const match = text.replace(/,/g, '').match(/\$?(\d+[\d\.]*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  // Real statistics derived from actual opportunity data
  const stats = useMemo(() => {
    const total = opportunities.length;
    const verified = opportunities.filter(o => o.verification_status === 'Verified').length;
    const remote = opportunities.filter(o => {
      const loc = (o.location || '').toLowerCase();
      return loc.includes('remote') || loc.includes('virtual') || loc.includes('anywhere');
    }).length;
    return { total, verified, remote };
  }, [opportunities]);

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#242424] flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        mode={mode}
        isConfigured={isConfigured}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Restrained Fallback Notice Banner */}
      {!isConfigured && (
        <div className="bg-[#FFFBEB] border-b border-[#FDE68A] text-[#92400E] px-4 py-2 text-xs">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
              <span>
                <strong>Demo mode:</strong> Simulating browser research with reference student opportunities.
              </span>
            </div>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="text-[#92400E] hover:text-[#78350F] underline font-medium cursor-pointer"
            >
              Configure API key for live browser →
            </button>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* Search & Criteria Form */}
        <SearchForm
          profile={profile}
          setProfile={setProfile}
          onSearch={handleSearch}
          isLoading={status === 'scanning'}
        />

        {/* Live Research Activity Section */}
        {status === 'scanning' && (
          <RadarScanner
            currentStep={currentStep}
            activityLog={activityLog}
            activeEndpoint={activeEndpoint}
            streamingUrl={streamingUrl}
            mode={mode}
          />
        )}

        {/* Error State */}
        {status === 'error' && (
          <ErrorState
            error={errorMessage}
            onRetry={handleSearch}
          />
        )}

        {/* Opportunities Results Dashboard */}
        {status === 'complete' && (
          <div className="space-y-4">
            
            {/* Dashboard Header & Compact Summary */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-[#E5E5E2]">
              <div>
                <h2 className="text-lg font-semibold text-[#242424]">
                  Your opportunities
                </h2>
                <p className="text-xs text-[#777777]">
                  Evaluated and verified against your profile preferences.
                </p>
              </div>

              {/* Real Data Metrics */}
              <div className="flex items-center gap-3 text-xs text-[#666666]">
                <div>
                  <span className="font-semibold text-[#242424]">{stats.total}</span> found
                </div>
                <span className="text-[#D5D5D0]">·</span>
                <div>
                  <span className="font-semibold text-[#065F46]">{stats.verified}</span> verified
                </div>
                <span className="text-[#D5D5D0]">·</span>
                <div>
                  <span className="font-semibold text-[#242424]">{stats.remote}</span> remote
                </div>
              </div>
            </div>

            {/* Filter and Sort Toolbar */}
            <FilterToolbar
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              remoteOnlyFilter={remoteOnlyFilter}
              setRemoteOnlyFilter={setRemoteOnlyFilter}
              verifiedOnlyFilter={verifiedOnlyFilter}
              setVerifiedOnlyFilter={setVerifiedOnlyFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalResults={filteredOpportunities.length}
            />

            {/* Opportunities List Grid */}
            {filteredOpportunities.length === 0 ? (
              <EmptyState
                onReset={() => {
                  setTypeFilter('All');
                  setRemoteOnlyFilter(false);
                  setVerifiedOnlyFilter(false);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOpportunities.map((opp, idx) => (
                  <OpportunityCard key={idx} opportunity={opp} />
                ))}
              </div>
            )}

            {/* Endpoints Audit Trail */}
            {visitedEndpoints.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#777777]">
                <span className="font-medium text-[#555555]">Endpoints checked ({visitedEndpoints.length}):</span>
                {visitedEndpoints.map((ep, i) => (
                  <span
                    key={i}
                    className="font-mono bg-white border border-[#E5E5E2] px-2 py-0.5 rounded text-[#555555] max-w-xs truncate"
                    title={ep}
                  >
                    {ep}
                  </span>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E2] bg-white py-4 text-xs text-[#777777]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Opportunity Radar — Autonomous Student Opportunity Research</span>
          <span>Powered by TinyFish Web Agent & Browser Automation</span>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        isConfigured={isConfigured}
        onKeyConfigured={(configured) => {
          setIsConfigured(configured);
          setMode(configured ? 'live' : 'fallback');
        }}
      />
    </div>
  );
}
