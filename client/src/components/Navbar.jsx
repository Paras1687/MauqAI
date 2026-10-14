import React from 'react';
import { Radar, Key, Sparkles, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';

export default function Navbar({ mode, isConfigured, onOpenKeyModal }) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Opportunity Radar
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold uppercase tracking-wider">
                v1.0 TinyFish Agent
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Endpoint Autonomous Web Agent for Student Opportunities
            </p>
          </div>
        </div>

        {/* Challenge & Status Badges */}
        <div className="flex items-center gap-3">
          
          {/* DTU Bounty Tag */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>DTU Bounty Drop 001</span>
          </div>

          {/* 3+ Endpoints Tier Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-700/40 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>3+ Browser Endpoints</span>
          </div>

          {/* Live vs Fallback Mode Pill */}
          <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
            isConfigured 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="hidden sm:inline">
              {isConfigured ? 'TinyFish Cloud Live' : 'Demo / Fallback Mode'}
            </span>
            <span className="sm:hidden">
              {isConfigured ? 'Live' : 'Demo'}
            </span>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenKeyModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Configure TinyFish API Key"
          >
            <Key className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{isConfigured ? 'Key Configured' : 'Set API Key'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
