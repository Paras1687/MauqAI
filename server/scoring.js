/**
 * Scoring and normalization engine for Opportunity Radar
 * Evaluates candidate opportunities against user profile and preferences.
 */

export function calculateMatch(opportunity, userProfile) {
  let score = 50; // base score
  const reasons = [];

  const userSkills = (userProfile.skills || [])
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  const oppSkills = (opportunity.skills || []).map(s => s.toLowerCase());

  // 1. Skill overlap
  if (userSkills.length > 0 && oppSkills.length > 0) {
    const matchedSkills = userSkills.filter(skill =>
      oppSkills.some(oppSkill => oppSkill.includes(skill) || skill.includes(oppSkill))
    );
    const skillRatio = matchedSkills.length / Math.max(userSkills.length, 1);
    const skillBonus = Math.round(skillRatio * 25);
    score += skillBonus;
    if (matchedSkills.length > 0) {
      reasons.push(`Matches ${matchedSkills.length} of your target skills (${matchedSkills.slice(0, 3).join(', ')})`);
    }
  }

  // 2. Opportunity Type Match
  if (userProfile.opportunityType && userProfile.opportunityType !== 'all') {
    const targetType = userProfile.opportunityType.toLowerCase();
    const oppType = (opportunity.type || '').toLowerCase();
    if (oppType.includes(targetType) || targetType.includes(oppType)) {
      score += 15;
      reasons.push(`Exact match for desired type: ${opportunity.type}`);
    } else {
      score -= 20;
    }
  }

  // 3. Location / Remote Preference
  const prefLocation = (userProfile.preferredLocation || '').toLowerCase();
  const oppLocation = (opportunity.location || '').toLowerCase();
  const isRemotePref = userProfile.remoteOnly || prefLocation.includes('remote');
  const isOppRemote = oppLocation.includes('remote') || oppLocation.includes('anywhere') || oppLocation.includes('virtual');

  if (isRemotePref) {
    if (isOppRemote) {
      score += 15;
      reasons.push('Supports 100% remote / virtual participation');
    } else {
      score -= 15;
    }
  } else if (prefLocation && prefLocation !== 'any') {
    if (oppLocation.includes(prefLocation) || isOppRemote) {
      score += 10;
      reasons.push(`Located in or accessible from ${opportunity.location}`);
    }
  }

  // 4. Keyword / Company Priority
  const keywords = (userProfile.keywords || [])
    .map(k => k.trim().toLowerCase())
    .filter(Boolean);
  if (keywords.length > 0) {
    const matchedKeywords = keywords.filter(kw => {
      const inTitle = (opportunity.title || '').toLowerCase().includes(kw);
      const inOrg = (opportunity.organization || '').toLowerCase().includes(kw);
      const inDesc = (opportunity.eligibility || '').toLowerCase().includes(kw);
      return inTitle || inOrg || inDesc;
    });
    if (matchedKeywords.length > 0) {
      score += 15;
      reasons.push(`Matches prioritized keywords/companies: ${matchedKeywords.join(', ')}`);
    }
  }

  // 5. Education & Graduation Year
  const gradYear = userProfile.graduationYear;
  const oppEligibility = (opportunity.eligibility || '').toLowerCase();
  if (gradYear && oppEligibility.includes(String(gradYear))) {
    score += 10;
    reasons.push(`Explicitly targets ${gradYear} graduates`);
  } else if (userProfile.educationLevel) {
    const edu = userProfile.educationLevel.toLowerCase();
    if (oppEligibility.includes(edu) || oppEligibility.includes('student') || oppEligibility.includes('undergraduate')) {
      score += 5;
      reasons.push(`Open to ${userProfile.educationLevel} candidates`);
    }
  }

  // 6. Compensation check
  if (userProfile.minStipend && userProfile.minStipend > 0) {
    const compText = opportunity.compensation || '';
    const numericComp = extractNumericAmount(compText);
    if (numericComp && numericComp >= userProfile.minStipend) {
      score += 10;
      reasons.push(`Compensation meets threshold (${compText})`);
    }
  }

  // Cap score between 35 and 99
  const finalScore = Math.max(35, Math.min(98, score));
  const finalReason = reasons.length > 0
    ? reasons.join('. ') + '.'
    : 'Aligns with your general student and technology interests.';

  return {
    match_score: finalScore,
    match_reason: finalReason
  };
}

function extractNumericAmount(text) {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/\$?(\d+[\d\.]*)/);
  return match ? parseFloat(match[1]) : null;
}

export function deduplicateOpportunities(opportunities) {
  const seen = new Set();
  return opportunities.filter(opp => {
    const key = `${(opp.title || '').toLowerCase().trim()}::${(opp.organization || '').toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
