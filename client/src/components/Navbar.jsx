import React from 'react';
import { Compass, Key } from 'lucide-react';

export default function Navbar({ mode, isConfigured, onOpenKeyModal }) {
  return (
    <header className="border-b border-[#E5E5E2] bg-white sticky top-0 z-40 h-15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Left: Understated product mark, Name, Version */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#F0F6F3] text-[#237A57]">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm sm:text-base tracking-tight text-[#242424]">
              Opportunity Radar
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-[#F4F4F2] text-[#777777] border border-[#E5E5E2]">
              v1.0
            </span>
          </div>
        </div>

        {/* Right: Connection status & API key button */}
        <div className="flex items-center gap-3">
          
          {/* Connection status */}
          <div className="flex items-center gap-1.5 text-xs text-[#555555]">
            <span
              className={`w-2 h-2 rounded-full ${
                isConfigured ? 'bg-[#237A57]' : 'bg-[#D97706]'
              }`}
            />
            <span className="hidden sm:inline">
              {isConfigured ? 'TinyFish connected' : 'Demo mode'}
            </span>
            <span className="sm:hidden">
              {isConfigured ? 'Live' : 'Demo'}
            </span>
          </div>

          {/* Simple Settings / Key Button */}
          <button
            onClick={onOpenKeyModal}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border border-[#E5E5E2] bg-white text-[#242424] hover:bg-[#F8F8F6] transition-colors cursor-pointer"
            title="Configure API key"
          >
            <Key className="w-3.5 h-3.5 text-[#777777]" />
            <span>API key</span>
          </button>

        </div>

      </div>
    </header>
  );
}
