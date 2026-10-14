import React, { useRef, useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Globe } from 'lucide-react';

const STAGES = [
  { step: 1, label: '1. Discovering opportunities', desc: 'Querying discovery sources matching criteria' },
  { step: 2, label: '2. Reading official program details', desc: 'Extracting requirements, location, and compensation' },
  { step: 3, label: '3. Checking application pages', desc: 'Verifying deadlines, links, and student eligibility' },
  { step: 4, label: '4. Ranking results', desc: 'Evaluating relevance match and assembling dashboard' }
];

export default function RadarScanner({ 
  currentStep = 1, 
  activityLog = [], 
  activeEndpoint = null, 
  streamingUrl = null, 
  mode = 'live' 
}) {
  const terminalEndRef = useRef(null);
  const [isLogOpen, setIsLogOpen] = useState(true);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activityLog]);

  return (
    <div className="bg-white border border-[#E5E5E2] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
      
      {/* Header: Title and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EBEBE8]">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-[#242424]">
            Research activity
          </h2>
          <span className="text-xs text-[#777777]">
            — Autonomous web agent in progress
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#777777]">Mode:</span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
            mode === 'live'
              ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
              : 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
          }`}>
            {mode === 'live' ? 'TinyFish Cloud Browser' : 'Verified Reference Mode'}
          </span>
        </div>
      </div>

      {/* 4-Stage Timeline Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {STAGES.map((s) => {
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <div
              key={s.step}
              className={`p-3 rounded-lg border text-xs transition-colors ${
                isDone
                  ? 'bg-[#F0F6F3] border-[#D1E5DC] text-[#242424]'
                  : isCurrent
                  ? 'bg-white border-[#237A57] ring-1 ring-[#237A57]/20 text-[#242424]'
                  : 'bg-[#F8F8F6] border-[#E5E5E2] text-[#777777]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-medium ${isCurrent ? 'text-[#237A57]' : ''}`}>
                  {s.label}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#237A57]" />
                ) : isCurrent ? (
                  <div className="w-3 h-3 border-2 border-[#237A57] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5D5D0]" />
                )}
              </div>
              <p className="text-[11px] text-[#777777] line-clamp-1">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Active Endpoint Notice */}
      {activeEndpoint && (
        <div className="flex items-center gap-2 text-xs bg-[#F8F8F6] border border-[#E5E5E2] px-3 py-2 rounded-lg text-[#444444]">
          <Globe className="w-3.5 h-3.5 text-[#237A57] shrink-0" />
          <span className="font-medium shrink-0">Current target:</span>
          <span className="font-mono text-[#242424] truncate flex-1" title={activeEndpoint}>
            {activeEndpoint}
          </span>
        </div>
      )}

      {/* Live Browser Stream (if provided by TinyFish STREAMING_URL) */}
      {streamingUrl && (
        <div className="border border-[#E5E5E2] rounded-lg overflow-hidden bg-white">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#F8F8F6] border-b border-[#E5E5E2] text-xs">
            <span className="font-medium text-[#444444]">Live browser session</span>
            <a
              href={streamingUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#237A57] hover:underline flex items-center gap-1 text-[11px]"
            >
              Open in new tab <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="relative aspect-video w-full bg-slate-900">
            <iframe
              src={streamingUrl}
              title="TinyFish Browser Session"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* Collapsible Activity Log Feed */}
      <div className="border border-[#E5E5E2] rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsLogOpen(!isLogOpen)}
          className="w-full px-3 py-2 bg-[#F8F8F6] border-b border-[#E5E5E2] flex items-center justify-between text-xs text-[#555555] font-medium cursor-pointer hover:bg-[#F2F2F0] transition-colors"
        >
          <span>Activity audit trail ({activityLog.length} events)</span>
          {isLogOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isLogOpen && (
          <div className="p-3 bg-white font-mono text-[11px] max-h-40 overflow-y-auto space-y-1.5 leading-relaxed">
            {activityLog.length === 0 ? (
              <div className="text-[#999999] italic">Initializing agent session...</div>
            ) : (
              activityLog.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[#444444]">
                  <span className="text-[#999999] select-none text-[10px] pt-0.5 whitespace-nowrap">
                    {new Date(log.timestamp || Date.now()).toLocaleTimeString()}
                  </span>
                  <span className="text-[#777777] select-none">›</span>
                  <span className="flex-1 break-words">
                    {log.message || log.purpose || JSON.stringify(log)}
                  </span>
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>

    </div>
  );
}
