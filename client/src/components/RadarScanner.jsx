import React, { useRef, useEffect } from 'react';
import { 
  Radar, 
  Terminal, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Play
} from 'lucide-react';

const STEPS = [
  { step: 1, label: 'Endpoint 1: Discovery', desc: 'Querying TinyFish Search / Public Opportunity Index' },
  { step: 2, label: 'Endpoint 2: Extraction', desc: 'Navigating to Official Program & Career Portals' },
  { step: 3, label: 'Endpoint 3: Verification', desc: 'Verifying Deadlines, Application Links & Stipends' },
  { step: 4, label: 'Step 4: Normalization', desc: 'Scoring Relevance, Deduplicating & Dashboard Assembly' }
];

export default function RadarScanner({ 
  currentStep = 1, 
  activityLog = [], 
  activeEndpoint = null, 
  streamingUrl = null, 
  mode = 'live' 
}) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activityLog]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* Top Banner: Status and Live Radar Animation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-slate-800">
        
        {/* Radar Graphic */}
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-full border-2 border-emerald-500/40 bg-slate-950 flex items-center justify-center overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            {/* Concentric rings */}
            <div className="absolute inset-2 rounded-full border border-emerald-500/20" />
            <div className="absolute inset-5 rounded-full border border-emerald-500/20" />
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-emerald-500/20" />
            <div className="absolute h-full w-[1px] bg-emerald-500/20" />
            {/* Radar Sweep Needle */}
            <div className="absolute inset-0 animate-radar-sweep origin-center">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-400/40 to-transparent clip-path-polygon" />
            </div>
            {/* Blips */}
            <div className="absolute top-4 right-5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="absolute bottom-5 left-6 w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <Radar className="w-6 h-6 text-emerald-400 relative z-10" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                TinyFish Agent in Action
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                mode === 'live' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              }`}>
                {mode === 'live' ? 'Live Cloud Browser' : 'Explicit Fallback Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Executing autonomous browser operations across 3+ endpoints to uncover and verify live opportunities.
            </p>
          </div>
        </div>

        {/* Active Target Endpoint Display */}
        {activeEndpoint && (
          <div className="w-full md:w-auto bg-slate-950 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Globe className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold tracking-wider block">
                Active Browser Target
              </span>
              <span className="text-xs font-mono text-slate-200 truncate block max-w-xs md:max-w-sm">
                {activeEndpoint}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4-Step Progress Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STEPS.map((s) => {
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          return (
            <div
              key={s.step}
              className={`p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-slate-800/80 border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  {s.label}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-xs font-mono text-slate-600">Step {s.step}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Live TinyFish Browser Stream (if STREAMING_URL provided by API) */}
      {streamingUrl && (
        <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
              <Play className="w-3.5 h-3.5" />
              Live TinyFish Browser Stream
            </span>
            <a
              href={streamingUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              Open in window <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-800 bg-black">
            <iframe
              src={streamingUrl}
              title="TinyFish Browser Live Stream"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* Live Agent Terminal Log */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-300">Live Agent Stream Activity</span>
          </div>
          <span className="text-[10px] text-slate-500">
            {activityLog.length} events emitted
          </span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {activityLog.length === 0 ? (
            <div className="text-slate-600 italic py-2">
              Agent initialized. Connecting to web workers...
            </div>
          ) : (
            activityLog.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-emerald-500 select-none">›</span>
                <span className="text-slate-500 select-none text-[10px] pt-0.5 whitespace-nowrap">
                  {new Date(log.timestamp || Date.now()).toLocaleTimeString()}
                </span>
                <span className={`flex-1 ${log.phase === 'NORMALIZATION' ? 'text-emerald-300 font-semibold' : ''}`}>
                  {log.message || log.purpose || JSON.stringify(log)}
                </span>
              </div>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>

    </div>
  );
}
