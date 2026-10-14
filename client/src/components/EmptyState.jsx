import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function EmptyState({ onReset }) {
  return (
    <div className="bg-white border border-[#E5E5E2] rounded-xl p-8 text-center max-w-md mx-auto shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="w-10 h-10 rounded-lg bg-[#F8F8F6] border border-[#E5E5E2] flex items-center justify-center mx-auto text-[#777777] mb-3">
        <SearchX className="w-5 h-5 text-[#777777]" />
      </div>
      <h3 className="text-base font-semibold text-[#242424] mb-1">
        No matching opportunities found
      </h3>
      <p className="text-xs text-[#777777] mb-5 leading-normal">
        None of the verified opportunities met your exact filters (e.g. stipend threshold or remote requirements). Try relaxing your criteria or selecting a different opportunity type.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E5E5E2] hover:bg-[#F8F8F6] text-xs font-medium text-[#242424] transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5 text-[#237A57]" />
        <span>Reset filters</span>
      </button>
    </div>
  );
}
