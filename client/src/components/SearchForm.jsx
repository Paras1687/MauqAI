import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PRESETS = [
  {
    name: 'AI/ML internships',
    profile: {
      opportunityType: 'Internship',
      skills: ['Python', 'PyTorch', 'Machine Learning', 'Data Structures'],
      educationLevel: 'Undergraduate',
      graduationYear: 2026,
      preferredLocation: 'Remote or US',
      remoteOnly: false,
      minStipend: 4000,
      keywords: ['Google', 'OpenAI', 'Research', 'AI'],
      deadline: ''
    }
  },
  {
    name: 'Web3 & AI hackathons',
    profile: {
      opportunityType: 'Hackathon',
      skills: ['Rust', 'TypeScript', 'Solana', 'Web3', 'React'],
      educationLevel: 'Undergraduate',
      graduationYear: 2026,
      preferredLocation: 'Global / Virtual',
      remoteOnly: true,
      minStipend: 10000,
      keywords: ['Solana', 'Colosseum', 'CalHacks', 'Bounty'],
      deadline: ''
    }
  },
  {
    name: 'Remote software internships',
    profile: {
      opportunityType: 'Internship',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Go'],
      educationLevel: 'Undergraduate',
      graduationYear: 2027,
      preferredLocation: 'Remote',
      remoteOnly: true,
      minStipend: 3000,
      keywords: ['GitHub', 'Palantir', 'Software Engineer'],
      deadline: ''
    }
  },
  {
    name: 'Open-source fellowships',
    profile: {
      opportunityType: 'Student Program',
      skills: ['Python', 'Go', 'Linux', 'Git', 'Kubernetes'],
      educationLevel: 'Undergraduate',
      graduationYear: 2026,
      preferredLocation: 'Remote',
      remoteOnly: true,
      minStipend: 2000,
      keywords: ['MLH', 'Linux Foundation', 'LFX', 'Mentorship'],
      deadline: ''
    }
  }
];

export default function SearchForm({ profile, setProfile, onSearch, isLoading }) {
  const [skillInput, setSkillInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [activePreset, setActivePreset] = useState(null);

  const handlePresetClick = (preset) => {
    setActivePreset(preset.name);
    setProfile(preset.profile);
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = skillInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !profile.skills.includes(trimmed)) {
        setProfile({ ...profile, skills: [...profile.skills, trimmed] });
        setSkillInput('');
        setActivePreset(null);
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
    setActivePreset(null);
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = keywordInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !profile.keywords.includes(trimmed)) {
        setProfile({ ...profile, keywords: [...profile.keywords, trimmed] });
        setKeywordInput('');
        setActivePreset(null);
      }
    }
  };

  const handleRemoveKeyword = (kwToRemove) => {
    setProfile({
      ...profile,
      keywords: profile.keywords.filter(k => k !== kwToRemove)
    });
    setActivePreset(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      
      {/* Heading & Subtitle */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#242424]">
          Find your next opportunity
        </h1>
        <p className="text-sm text-[#777777] mt-1 leading-normal max-w-2xl">
          Search internships, hackathons, and fellowships. We'll check the official sources and show you which opportunities are worth pursuing.
        </p>

        {/* Compact Presets Bar */}
        <div className="mt-4 pt-4 border-t border-[#EBEBE8] flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#777777] font-medium mr-1">
            Common searches:
          </span>
          {PRESETS.map((preset) => {
            const isSelected = activePreset === preset.name;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-[#F0F6F3] border-[#237A57] text-[#237A57]'
                    : 'bg-[#F8F8F6] border-[#E5E5E2] text-[#555555] hover:text-[#242424] hover:border-[#D5D5D0]'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Row 1: Type, Education, Graduation Year */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-[#444444] mb-1.5">
              Opportunity type
            </label>
            <select
              value={profile.opportunityType}
              onChange={(e) => {
                setProfile({ ...profile, opportunityType: e.target.value });
                setActivePreset(null);
              }}
              className="w-full bg-white border border-[#E5E5E2] rounded-lg px-3 py-2 text-sm text-[#242424] focus:outline-none focus:border-[#237A57] focus:ring-1 focus:ring-[#237A57] transition-colors"
            >
              <option value="Internship">Internship</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Student Program">Student program / fellowship</option>
              <option value="Scholarship">Scholarship</option>
              <option value="all">Any / all opportunities</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#444444] mb-1.5">
              Education level
            </label>
            <select
              value={profile.educationLevel}
              onChange={(e) => {
                setProfile({ ...profile, educationLevel: e.target.value });
                setActivePreset(null);
              }}
              className="w-full bg-white border border-[#E5E5E2] rounded-lg px-3 py-2 text-sm text-[#242424] focus:outline-none focus:border-[#237A57] focus:ring-1 focus:ring-[#237A57] transition-colors"
            >
              <option value="Undergraduate">Undergraduate (B.Tech / B.S.)</option>
              <option value="Master's / Graduate">Master's / Graduate (M.Tech / M.S.)</option>
              <option value="PhD Candidate">PhD candidate</option>
              <option value="High School">High school</option>
              <option value="Recent Graduate">Recent graduate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#444444] mb-1.5">
              Graduation year
            </label>
            <select
              value={profile.graduationYear}
              onChange={(e) => {
                setProfile({ ...profile, graduationYear: Number(e.target.value) });
                setActivePreset(null);
              }}
              className="w-full bg-white border border-[#E5E5E2] rounded-lg px-3 py-2 text-sm text-[#242424] focus:outline-none focus:border-[#237A57] focus:ring-1 focus:ring-[#237A57] transition-colors"
            >
              <option value={2025}>Class of 2025</option>
              <option value={2026}>Class of 2026</option>
              <option value={2027}>Class of 2027</option>
              <option value={2028}>Class of 2028 or later</option>
            </select>
          </div>
        </div>

        {/* Row 2: Target Skills */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[#444444]">
              Target skills and technologies
            </label>
            <span className="text-[11px] text-[#777777]">
              Press Enter or comma to add
            </span>
          </div>
          <div className="bg-white border border-[#E5E5E2] rounded-lg p-2 flex flex-wrap items-center gap-1.5 min-h-[42px] focus-within:border-[#237A57] focus-within:ring-1 focus-within:ring-[#237A57] transition-colors">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F4F4F2] border border-[#E5E5E2] text-xs text-[#242424]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-[#777777] hover:text-[#242424] text-xs leading-none"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={profile.skills.length === 0 ? "e.g. Python, React, PyTorch, Go..." : "Add skill..."}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              className="flex-1 min-w-[120px] bg-transparent text-sm text-[#242424] placeholder-[#999999] focus:outline-none py-0.5 px-1"
            />
          </div>
        </div>

        {/* Row 3: Location, Min Stipend, Companies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-[#444444] mb-1.5">
              Preferred location
            </label>
            <input
              type="text"
              placeholder="e.g. Remote, San Francisco, India"
              value={profile.preferredLocation}
              onChange={(e) => {
                setProfile({ ...profile, preferredLocation: e.target.value });
                setActivePreset(null);
              }}
              className="w-full bg-white border border-[#E5E5E2] rounded-lg px-3 py-2 text-sm text-[#242424] focus:outline-none focus:border-[#237A57] focus:ring-1 focus:ring-[#237A57] transition-colors"
            />
            <label className="mt-2 flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={profile.remoteOnly}
                onChange={(e) => {
                  setProfile({ ...profile, remoteOnly: e.target.checked });
                  setActivePreset(null);
                }}
                className="w-4 h-4 rounded border-[#E5E5E2] text-[#237A57] focus:ring-[#237A57]"
              />
              <span className="text-xs text-[#666666]">
                100% remote / virtual only
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#444444] mb-1.5">
              Minimum stipend or prize ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 2000"
              value={profile.minStipend || ''}
              onChange={(e) => {
                setProfile({ ...profile, minStipend: e.target.value ? Number(e.target.value) : 0 });
                setActivePreset(null);
              }}
              className="w-full bg-white border border-[#E5E5E2] rounded-lg px-3 py-2 text-sm text-[#242424] focus:outline-none focus:border-[#237A57] focus:ring-1 focus:ring-[#237A57] transition-colors"
            />
            <span className="text-[11px] text-[#777777] mt-1 block">
              Monthly stipend or total prize pool
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#444444] mb-1.5">
              Companies or keywords to prioritize
            </label>
            <div className="bg-white border border-[#E5E5E2] rounded-lg p-1.5 flex flex-wrap items-center gap-1.5 min-h-[42px] focus-within:border-[#237A57] focus-within:ring-1 focus-within:ring-[#237A57] transition-colors">
              {profile.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F4F4F2] border border-[#E5E5E2] text-xs text-[#242424]"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-[#777777] hover:text-[#242424] text-xs leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={profile.keywords.length === 0 ? "e.g. Google, OpenAI..." : "+keyword"}
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                className="flex-1 min-w-[80px] bg-transparent text-sm text-[#242424] placeholder-[#999999] focus:outline-none py-0.5 px-1"
              />
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EBEBE8]">
          <p className="text-xs text-[#777777] order-2 sm:order-1">
            Checks discovery, official details, and application pages.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer order-1 sm:order-2 ${
              isLoading
                ? 'bg-[#E5E5E2] text-[#777777] cursor-not-allowed'
                : 'bg-[#237A57] hover:bg-[#1c6347] text-white shadow-xs'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Searching live web...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Find opportunities</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
