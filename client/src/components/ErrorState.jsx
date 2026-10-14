import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="bg-white border border-[#FECACA] rounded-xl p-7 text-center max-w-md mx-auto shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center mx-auto text-[#DC2626] mb-3">
        <AlertCircle className="w-5 h-5 text-[#DC2626]" />
      </div>
      <h3 className="text-base font-semibold text-[#242424] mb-1">
        Research search failed
      </h3>
      <p className="text-xs text-[#666666] mb-4 font-mono leading-relaxed bg-[#F8F8F6] p-2.5 rounded border border-[#E5E5E2] break-words">
        {error || 'An unexpected error occurred while communicating with the agent server.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#237A57] hover:bg-[#1c6347] text-white text-xs font-medium transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Retry search</span>
      </button>
    </div>
  );
}
