import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Link2,
  RefreshCw,
  Globe
} from 'lucide-react';

export default function OpportunityCard({ opportunity }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState(null);
  const [showEndpoints, setShowEndpoints] = useState(false);

  const handleDeepVerify = async () => {
    setIsVerifying(true);
    setVerificationFeedback(null);
    try {
      const res = await fetch('/api/verify-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: opportunity.application_url || opportunity.source_url })
      });
      const data = await res.json();
      if (data.verified) {
        setVerificationFeedback({
          status: 'verified',
          text: `Endpoint reached (HTTP ${data.status_code || 200}) at ${new Date(data.last_checked).toLocaleTimeString()}`
        });
      } else {
        setVerificationFeedback({
          status: 'unverified',
          text: data.error || 'Unable to confirm reachability.'
        });
      }
    } catch (err) {
      setVerificationFeedback({
        status: 'unverified',
        text: 'Network timeout verifying link.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const isVerified = opportunity.verification_status === 'Verified';
  const matchScore = opportunity.match_score || 75;

  // Determine score color
  const scoreColor = matchScore >= 90 
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    : matchScore >= 75
    ? 'text-teal-400 border-teal-500/40 bg-teal-500/10'
    : 'text-amber-400 border-amber-500/40 bg-amber-500/10';

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 backdrop-blur-xl transition-all hover:shadow-[0_4px_25px_rgba(0,0,0,0.4)] flex flex-col justify-between group">
      
      <div>
        {/* Top Header: Organization & Match Score Badge */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-emerald-400">
              {opportunity.organization ? opportunity.organization.substring(0, 2).toUpperCase() : 'OP'}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                {opportunity.organization || 'Organization'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                {opportunity.type || 'Program'}
              </span>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs tracking-tight ${scoreColor}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        {/* Opportunity Title */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
          {opportunity.title}
        </h3>

        {/* Metadata Grid (Location, Compensation, Deadline) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs">
          
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{opportunity.location || 'Location unverified'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate font-medium">{opportunity.compensation || 'Stipend not disclosed'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{opportunity.deadline || 'Deadline rolling / unknown'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Source</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Partially Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Match Reason Box */}
        {opportunity.match_reason && (
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 my-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
              Why This Fits Your Profile
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {opportunity.match_reason}
            </p>
          </div>
        )}

        {/* Target Skills Tags */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-3">
            {opportunity.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Verification Warnings & Unverified notes */}
        {opportunity.verification_notes && (
          <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 my-2 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
            <span>{opportunity.verification_notes}</span>
          </div>
        )}

        {/* Verified Endpoints Accordion Toggle */}
        {opportunity.verified_endpoints && opportunity.verified_endpoints.length > 0 && (
          <div className="my-2">
            <button
              onClick={() => setShowEndpoints(!showEndpoints)}
              className="text-[11px] font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Globe className="w-3 h-3 text-emerald-500" />
              <span>{showEndpoints ? 'Hide verified endpoints' : `View ${opportunity.verified_endpoints.length} browser endpoints`}</span>
            </button>

            {showEndpoints && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono space-y-1">
                {opportunity.verified_endpoints.map((ep, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-400 truncate">
                    <span className="text-emerald-400 font-bold">[{i + 1}]</span>
                    <a href={ep} target="_blank" rel="noreferrer" className="hover:text-emerald-300 truncate">
                      {ep}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Live on-demand verification feedback */}
        {verificationFeedback && (
          <div className={`text-[11px] font-mono p-2 rounded-lg my-2 border ${
            verificationFeedback.status === 'verified'
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
          }`}>
            {verificationFeedback.text}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-2">
        
        {/* On-demand Re-Verification Button */}
        <button
          onClick={handleDeepVerify}
          disabled={isVerifying}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          title="Verify live endpoint reachability now"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin text-emerald-400' : ''}`} />
          <span className="hidden sm:inline">Verify Link</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Source Link */}
          {opportunity.source_url && (
            <a
              href={opportunity.source_url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 transition-colors"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Direct Application Link */}
          {opportunity.application_url && (
            <a
              href={opportunity.application_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md hover:shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

      </div>

    </div>
  );
}
