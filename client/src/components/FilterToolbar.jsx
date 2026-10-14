import React from 'react';
import { ArrowUpDown } from 'lucide-react';

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
    <div className="bg-white border border-[#E5E5E2] rounded-xl p-3 sm:p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      
      {/* Type Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        <span className="text-xs text-[#777777] font-medium mr-1 shrink-0">
          Filter:
        </span>
        {types.map((type) => {
          const isSelected = typeFilter === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#242424] text-white'
                  : 'bg-[#F8F8F6] border border-[#E5E5E2] text-[#555555] hover:text-[#242424] hover:border-[#D0D0CD]'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Toggles and Sorting */}
      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto text-xs">
        
        {/* Remote Only Toggle */}
        <label className="flex items-center gap-1.5 text-[#555555] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remoteOnlyFilter}
            onChange={(e) => setRemoteOnlyFilter(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-[#E5E5E2] text-[#237A57] focus:ring-[#237A57]"
          />
          <span>Remote only</span>
        </label>

        {/* Verified Only Toggle */}
        <label className="flex items-center gap-1.5 text-[#555555] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={verifiedOnlyFilter}
            onChange={(e) => setVerifiedOnlyFilter(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-[#E5E5E2] text-[#237A57] focus:ring-[#237A57]"
          />
          <span>Verified only</span>
        </label>

        {/* Sort Select */}
        <div className="flex items-center gap-1 bg-[#F8F8F6] border border-[#E5E5E2] rounded-md px-2 py-1">
          <ArrowUpDown className="w-3 h-3 text-[#777777]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs text-[#242424] focus:outline-none cursor-pointer"
          >
            <option value="match_score">Highest match</option>
            <option value="compensation">Highest compensation</option>
            <option value="deadline">Soonest deadline</option>
          </select>
        </div>

        {/* Count Label */}
        <span className="text-xs text-[#777777] font-medium pl-1">
          <strong className="text-[#242424] font-semibold">{totalResults}</strong> {totalResults === 1 ? 'opportunity' : 'opportunities'}
        </span>

      </div>

    </div>
  );
}
