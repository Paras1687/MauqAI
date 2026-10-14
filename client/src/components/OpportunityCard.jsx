import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw,
  ChevronDown,
  ChevronUp
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
          text: `Endpoint verified (HTTP ${data.status_code || 200}) at ${new Date(data.last_checked).toLocaleTimeString()}`
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

  return (
    <div className="bg-white border border-[#E5E5E2] hover:border-[#D0D0CD] rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors flex flex-col justify-between">
      
      <div>
        {/* Top Line: Organization, Type Pill, Match Score */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#555555]">
              {opportunity.organization || 'Organization'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#F4F4F2] text-[#666666] border border-[#E5E5E2]">
              {opportunity.type || 'Program'}
            </span>
          </div>

          {/* Restrained Match Score */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-12 h-1.5 bg-[#EBEBE8] rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-[#237A57] rounded-full" 
                style={{ width: `${matchScore}%` }} 
              />
            </div>
            <span className="text-xs font-semibold text-[#237A57] font-mono">
              {matchScore}% match
            </span>
          </div>
        </div>

        {/* Opportunity Title */}
        <h3 className="text-base font-semibold text-[#242424] leading-snug mb-2.5">
          {opportunity.title}
        </h3>

        {/* Metadata Details Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#555555] mb-3">
          {/* Location */}
          <div className="flex items-center gap-1">
            <span className="text-[#888888]">Location:</span>
            <span className="font-medium text-[#333333]">{opportunity.location || 'Not specified'}</span>
          </div>

          {/* Compensation */}
          <div className="flex items-center gap-1">
            <span className="text-[#888888]">Stipend:</span>
            <span className="font-medium text-[#237A57]">{opportunity.compensation || 'Not disclosed'}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1">
            <span className="text-[#888888]">Deadline:</span>
            <span className="font-medium text-[#333333]">{opportunity.deadline || 'Rolling / unknown'}</span>
          </div>

          {/* Verification Pill */}
          <div className="flex items-center">
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded">
                <CheckCircle className="w-3 h-3 text-[#10B981]" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] px-2 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                <span>Partially verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Match Reason Callout */}
        {opportunity.match_reason && (
          <div className="bg-[#F8F8F6] border-l-2 border-[#237A57] p-2.5 rounded-r-md text-xs text-[#444444] mb-3 leading-relaxed">
            <span className="font-medium text-[#242424] block mb-0.5">
              Why this matches:
            </span>
            {opportunity.match_reason}
          </div>
        )}

        {/* Skills Chips */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {opportunity.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-[#F4F4F2] text-[#555555] border border-[#E5E5E2]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Verification Warnings if any */}
        {opportunity.verification_notes && (
          <div className="text-[11px] text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] rounded p-2 mb-3">
            {opportunity.verification_notes}
          </div>
        )}

        {/* Verified Endpoints Toggle */}
        {opportunity.verified_endpoints && opportunity.verified_endpoints.length > 0 && (
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setShowEndpoints(!showEndpoints)}
              className="text-[11px] text-[#777777] hover:text-[#242424] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{showEndpoints ? 'Hide verified sources' : `Show ${opportunity.verified_endpoints.length} checked sources`}</span>
              {showEndpoints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showEndpoints && (
              <div className="mt-1.5 p-2 rounded bg-[#F8F8F6] border border-[#E5E5E2] font-mono text-[10px] space-y-1">
                {opportunity.verified_endpoints.map((ep, i) => (
                  <div key={i} className="flex items-center gap-1 text-[#666666] truncate">
                    <span className="text-[#237A57]">[{i + 1}]</span>
                    <a href={ep} target="_blank" rel="noreferrer" className="hover:underline truncate text-[#444444]">
                      {ep}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* On-demand Verification Feedback */}
        {verificationFeedback && (
          <div className={`text-[11px] p-2 rounded mb-2 border ${
            verificationFeedback.status === 'verified'
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
          }`}>
            {verificationFeedback.text}
          </div>
        )}

      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-[#EBEBE8] flex items-center justify-between gap-2 mt-2">
        
        {/* On-demand Re-Verification Button */}
        <button
          onClick={handleDeepVerify}
          disabled={isVerifying}
          className="text-xs text-[#777777] hover:text-[#242424] inline-flex items-center gap-1 py-1 px-2 rounded hover:bg-[#F4F4F2] transition-colors cursor-pointer"
          title="Re-verify endpoint reachability"
        >
          <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin text-[#237A57]' : ''}`} />
          <span>Verify link</span>
        </button>

        {/* Link Actions */}
        <div className="flex items-center gap-2">
          {opportunity.source_url && (
            <a
              href={opportunity.source_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#555555] hover:text-[#242424] px-2.5 py-1.5 rounded border border-[#E5E5E2] bg-white hover:bg-[#F8F8F6] font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3 text-[#888888]" />
            </a>
          )}

          {opportunity.application_url && (
            <a
              href={opportunity.application_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#237A57] hover:bg-[#1c6347] text-white inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

      </div>

    </div>
  );
}
