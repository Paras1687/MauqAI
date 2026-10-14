import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function EmptyState({ onReset }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto backdrop-blur-xl">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center mx-auto text-slate-400 mb-4">
        <SearchX className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">No Matching Opportunities Found</h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        None of the verified opportunities met your exact filters (e.g. stipend threshold or remote exclusivity). Try relaxing your criteria or selecting a different opportunity type.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-4 h-4 text-emerald-400" />
        <span>Reset Filters & Show All</span>
      </button>
    </div>
  );
}
