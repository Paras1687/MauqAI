import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Compass, 
  MapPin, 
  DollarSign, 
  GraduationCap, 
  Building2, 
  Calendar,
  Layers,
  Check
} from 'lucide-react';

const PRESETS = [
  {
    name: 'AI/ML Undergrad 2026',
    icon: '🤖',
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
    name: 'Global Web3 & AI Hackathons',
    icon: '⚡',
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
    name: 'Remote Full-Stack Intern',
    icon: '💻',
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
    name: 'Open Source Fellowship',
    icon: '🌐',
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

  const handlePresetClick = (preset) => {
    setProfile(preset.profile);
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = skillInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !profile.skills.includes(trimmed)) {
        setProfile({ ...profile, skills: [...profile.skills, trimmed] });
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = keywordInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !profile.keywords.includes(trimmed)) {
        setProfile({ ...profile, keywords: [...profile.keywords, trimmed] });
        setKeywordInput('');
      }
    }
  };

  const handleRemoveKeyword = (kwToRemove) => {
    setProfile({
      ...profile,
      keywords: profile.keywords.filter(k => k !== kwToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Decorative subtle radar glow in corner */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Presets */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Configure Candidate Profile & Search Goals
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Specify your target criteria. TinyFish will autonomously search, visit, and verify live endpoints.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400 self-start sm:self-auto px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/50">
            Quick 1-Click Presets:
          </span>
        </div>

        {/* Presets Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all text-left cursor-pointer"
            >
              <span className="text-base">{preset.icon}</span>
              <span className="truncate">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Row 1: Type, Education, Graduation Year */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Opportunity Type
            </label>
            <select
              value={profile.opportunityType}
              onChange={(e) => setProfile({ ...profile, opportunityType: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="Internship">Internship</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Student Program">Student Program / Fellowship</option>
              <option value="Scholarship">Scholarship</option>
              <option value="all">Any / All Opportunities</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              Education Level
            </label>
            <select
              value={profile.educationLevel}
              onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="Undergraduate">Undergraduate (B.Tech / B.S. / B.E.)</option>
              <option value="Master's / Graduate">Master's / Graduate (M.Tech / M.S.)</option>
              <option value="PhD Candidate">PhD Candidate / Researcher</option>
              <option value="High School">High School / Pre-College</option>
              <option value="Recent Graduate">Recent Graduate / Bootcamper</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Graduation Year
            </label>
            <select
              value={profile.graduationYear}
              onChange={(e) => setProfile({ ...profile, graduationYear: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value={2025}>Class of 2025</option>
              <option value={2026}>Class of 2026</option>
              <option value={2027}>Class of 2027</option>
              <option value={2028}>Class of 2028+</option>
            </select>
          </div>
        </div>

        {/* Row 2: Skills & Interests */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Target Skills & Technologies
            </span>
            <span className="text-[11px] font-normal text-slate-400 lowercase font-mono">
              Press Enter or comma to add
            </span>
          </label>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center gap-2 focus-within:border-emerald-500 transition-colors">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-emerald-100 hover:bg-emerald-500/20 rounded-full w-4 h-4 inline-flex items-center justify-center text-emerald-400"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={profile.skills.length === 0 ? "e.g. Python, Machine Learning, React, Rust, Go..." : "Add another skill..."}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none py-1"
            />
          </div>
        </div>

        {/* Row 3: Location, Remote Toggle, Min Stipend, Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Preferred Location
            </label>
            <input
              type="text"
              placeholder="e.g. Remote, San Francisco, India, New York"
              value={profile.preferredLocation}
              onChange={(e) => setProfile({ ...profile, preferredLocation: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="remoteOnlyToggle"
                checked={profile.remoteOnly}
                onChange={(e) => setProfile({ ...profile, remoteOnly: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500/20"
              />
              <label htmlFor="remoteOnlyToggle" className="text-xs text-slate-400 cursor-pointer select-none">
                Require 100% Remote / Virtual only
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Min Stipend / Prize ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 2000"
              value={profile.minStipend || ''}
              onChange={(e) => setProfile({ ...profile, minStipend: e.target.value ? Number(e.target.value) : 0 })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Optional minimum monthly stipend or prize pool
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Prioritize Companies / Tags
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-1.5 flex flex-wrap items-center gap-1.5 min-h-[44px]">
              {profile.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={profile.keywords.length === 0 ? "e.g. Google, Solana, OpenAI..." : "+tag"}
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                className="flex-1 min-w-[100px] bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* Action Button: Find Opportunities */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Real-time multi-step verification across 3+ endpoints (Search + Detail + Application)</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
              isLoading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>TinyFish Agent Scanning Live Web...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Launch Opportunity Radar</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
