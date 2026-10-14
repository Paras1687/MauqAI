import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import SearchForm from './components/SearchForm.jsx';
import RadarScanner from './components/RadarScanner.jsx';
import OpportunityCard from './components/OpportunityCard.jsx';
import FilterToolbar from './components/FilterToolbar.jsx';
import EmptyState from './components/EmptyState.jsx';
import ErrorState from './components/ErrorState.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';
import { 
  Radar, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // State
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

  // Filters
  const [typeFilter, setTypeFilter] = useState('All');
  const [remoteOnlyFilter, setRemoteOnlyFilter] = useState(false);
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState(false);
  const [sortBy, setSortBy] = useState('match_score');

  // Check backend and TinyFish status on mount
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

  return (
    <div className="min-h-screen bg-slate-950 bg-radar-grid text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        mode={mode}
        isConfigured={isConfigured}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Explicit Fallback Mode Notice Banner */}
      {!isConfigured && (
        <div className="bg-gradient-to-r from-amber-950/70 via-amber-900/40 to-amber-950/70 border-b border-amber-600/30 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Explicit Fallback / Demo Mode:</strong> No <code className="bg-amber-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">TINYFISH_API_KEY</code> detected. Simulating multi-endpoint pipeline with verified real-world opportunities.
              </span>
            </div>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="text-xs font-semibold text-amber-300 hover:text-white underline underline-offset-2 shrink-0 cursor-pointer"
            >
              Add API Key for Live Cloud Browser →
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TinyFish × DTU Student Bounty Drop 001</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Autonomous Opportunity Radar
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Personal AI Agent that searches the live web, navigates 3+ browser endpoints, verifies deadlines and compensation, and matches student opportunities to your exact preferences.
          </p>
        </div>

        {/* Search & Configuration Form */}
        <SearchForm
          profile={profile}
          setProfile={setProfile}
          onSearch={handleSearch}
          isLoading={status === 'scanning'}
        />

        {/* Live Radar Scanner / Progress Section */}
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

        {/* Completed Results Dashboard */}
        {status === 'complete' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Endpoints & Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Verified Opportunities Dashboard
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multi-step research completed across <strong>{visitedEndpoints.length} endpoints</strong>.
                </p>
              </div>

              {/* Endpoints Visited Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {visitedEndpoints.map((ep, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 max-w-xs truncate"
                    title={ep}
                  >
                    <span className="text-emerald-400 font-bold mr-1">EP{i+1}:</span>
                    {ep}
                  </span>
                ))}
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

            {/* Cards Grid */}
            {filteredOpportunities.length === 0 ? (
              <EmptyState
                onReset={() => {
                  setTypeFilter('All');
                  setRemoteOnlyFilter(false);
                  setVerifiedOnlyFilter(false);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpportunities.map((opp, idx) => (
                  <OpportunityCard key={idx} opportunity={opp} />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Opportunity Radar — Powered by TinyFish Web Agent & Browser Automation</span>
          <span>Targeting 200-Point Bounty Drop 001 Tier</span>
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
