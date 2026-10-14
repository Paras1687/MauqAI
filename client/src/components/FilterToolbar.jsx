import React from 'react';
import { Filter, ArrowUpDown, CheckSquare, Square, Globe } from 'lucide-react';

export default function FilterToolbar({
  typeFilter,
  setTypeFilter,
  remoteOnlyFilter,
  setRemoteOnlyFilter,
  verifiedOnlyFilter,
  setVerifiedOnlyFilter,
  sortBy,
  setSortBy,
  totalResults
}) {
  const types = ['All', 'Internship', 'Hackathon', 'Student Program', 'Scholarship'];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          Filter:
        </span>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              typeFilter === type
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Toggles and Sort Options */}
      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
        
        {/* Remote Only Toggle */}
        <button
          onClick={() => setRemoteOnlyFilter(!remoteOnlyFilter)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            remoteOnlyFilter
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
          }`}
        >
          {remoteOnlyFilter ? (
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
          <span>Remote Only</span>
        </button>

        {/* Verified Only Toggle */}
        <button
          onClick={() => setVerifiedOnlyFilter(!verifiedOnlyFilter)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            verifiedOnlyFilter
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
          }`}
        >
          {verifiedOnlyFilter ? (
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
          <span>Verified Only</span>
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="match_score">Highest Match</option>
            <option value="compensation">Highest Compensation</option>
            <option value="deadline">Soonest Deadline</option>
          </select>
        </div>

        {/* Total Count */}
        <span className="text-xs font-mono text-slate-400 px-2 py-1 rounded bg-slate-950 border border-slate-800/80">
          <strong className="text-emerald-400">{totalResults}</strong> found
        </span>

      </div>

    </div>
  );
}
