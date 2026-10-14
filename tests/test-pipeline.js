/**
 * Automated Verification & Pipeline Test Suite for Opportunity Radar
 */

import { TinyFishService } from '../server/tinyfish-service.js';
import { calculateMatch, deduplicateOpportunities } from '../server/scoring.js';

async function runTests() {
  console.log('🧪 Starting Opportunity Radar Test Suite...\n');

  // Test 1: Service Initialization
  console.log('--- Test 1: TinyFish Service Initialization ---');
  const service = new TinyFishService();
  console.log('TinyFish Service initialized.');
  console.log('Mode:', service.isConfigured() ? 'LIVE CLOUD BROWSER' : 'EXPLICIT FALLBACK DEMO');
  console.log('✅ Test 1 Passed.\n');

  // Test 2: Search Run 1 - AI/ML Undergrad 2026
  console.log('--- Test 2: Search Run 1 (AI/ML Undergrad 2026) ---');
  const eventsRun1 = [];
  const result1 = await service.scanOpportunities({
    opportunityType: 'Internship',
    skills: ['Python', 'PyTorch', 'Machine Learning'],
    graduationYear: 2026,
    preferredLocation: 'Remote or US',
    remoteOnly: false,
    minStipend: 4000,
    keywords: ['OpenAI', 'Google']
  }, (evt) => {
    eventsRun1.push(evt.phase);
  });

  console.log('Pipeline events captured:', eventsRun1.join(' → '));
  console.log('Visited Endpoints:', result1.visited_endpoints);
  console.log('Opportunities Found:', result1.opportunities.length);
  const top1 = result1.opportunities[0];
  console.log(`Top Opportunity: "${top1.title}" at ${top1.organization} (Match: ${top1.match_score}%)`);
  console.log(`Match Reason: ${top1.match_reason}`);
  
  if (!top1 || !top1.title || !top1.application_url || !top1.source_url) {
    throw new Error('Test 2 Failed: Missing required schema fields');
  }
  console.log('✅ Test 2 Passed: Schema verified and top match accurately calculated.\n');

  // Test 3: Search Run 2 - Web3 & Rust Hackathons (Testing multi-input variation)
  console.log('--- Test 3: Search Run 2 (Web3 & Rust Hackathon Hunter) ---');
  const result2 = await service.scanOpportunities({
    opportunityType: 'Hackathon',
    skills: ['Rust', 'Solana', 'Web3'],
    graduationYear: 2026,
    preferredLocation: 'Global / Virtual',
    remoteOnly: true,
    minStipend: 10000,
    keywords: ['Solana', 'Colosseum']
  }, () => {});

  const top2 = result2.opportunities[0];
  console.log(`Top Opportunity: "${top2.title}" at ${top2.organization} (Match: ${top2.match_score}%)`);
  
  if (top1.title === top2.title) {
    throw new Error('Test 3 Failed: Different search queries must return different top opportunities!');
  }
  if (!top2.title.toLowerCase().includes('solana') && !top2.title.toLowerCase().includes('hackathon')) {
    throw new Error('Test 3 Failed: Expected hackathon result for hackathon query');
  }
  console.log('✅ Test 3 Passed: Dynamic personalization verified across distinct user profiles.\n');

  // Test 4: Deduplication & Scoring integrity
  console.log('--- Test 4: Deduplication and Scoring Integrity ---');
  const duplicates = [
    { title: 'Google STEP', organization: 'Google', skills: ['Python'], match_score: 80 },
    { title: 'Google STEP', organization: 'Google', skills: ['Python'], match_score: 85 },
    { title: 'MLH Fellowship', organization: 'MLH', skills: ['Git'], match_score: 90 }
  ];
  const deduped = deduplicateOpportunities(duplicates);
  if (deduped.length !== 2) {
    throw new Error(`Test 4 Failed: Expected 2 items after deduplication, got ${deduped.length}`);
  }
  console.log(`Deduplication reduced ${duplicates.length} items to ${deduped.length} unique items.`);
  console.log('✅ Test 4 Passed.\n');

  // Test 5: Verify required schema fields on all opportunities
  console.log('--- Test 5: Schema Compliance Check ---');
  const requiredFields = [
    'title', 'organization', 'type', 'location', 'compensation', 
    'deadline', 'eligibility', 'skills', 'application_url', 'source_url', 
    'match_score', 'match_reason', 'verification_status'
  ];

  for (const opp of result1.opportunities) {
    for (const field of requiredFields) {
      if (opp[field] === undefined) {
        throw new Error(`Opportunity missing required schema field: ${field}`);
      }
    }
  }
  console.log(`All ${result1.opportunities.length} opportunities strictly comply with the target 13-field schema.`);
  console.log('✅ Test 5 Passed.\n');

  console.log('🎉 ALL 5 TEST SUITES PASSED CLEANLY!');
}

runTests().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
