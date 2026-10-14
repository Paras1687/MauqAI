import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-10 text-center max-w-lg mx-auto backdrop-blur-xl">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 mb-4">
        <AlertOctagon className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Research Scan Failed</h3>
      <p className="text-xs text-rose-300/80 mb-6 font-mono leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-rose-900/50">
        {error || 'An unexpected network error occurred while communicating with the browser worker.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/40 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Retry Scan</span>
      </button>
    </div>
  );
}
