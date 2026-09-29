import { calculatePointsEarned, getLoyaltyTier, LOYALTY_TIERS, getTierProgress } from '../utils/loyalty';

export function runLoyaltyTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      console.error(`[FAIL] ${desc}`);
    }
  }

  // Test 1: Tier assignment
  assert(getLoyaltyTier(0) === 'Silver', '0 points should be Silver tier');
  assert(getLoyaltyTier(499) === 'Silver', '499 points should still be Silver tier');
  assert(getLoyaltyTier(500) === 'Gold', '500 points should upgrade to Gold tier');
  assert(getLoyaltyTier(1499) === 'Gold', '1499 points should be Gold tier');
  assert(getLoyaltyTier(1500) === 'Platinum', '1500 points should upgrade to Platinum tier');

  // Test 2: Point calculation with tier multipliers
  // 1 point per 10 THB
  // Silver multiplier: 1.0x -> 1000 THB = 100 points
  assert(calculatePointsEarned(1000, 'Silver') === 100, 'Silver tier gets 1x multiplier on 1000 THB (100 pts)');
  // Gold multiplier: 1.2x -> 1000 THB = 120 points
  assert(calculatePointsEarned(1000, 'Gold') === 120, 'Gold tier gets 1.2x multiplier on 1000 THB (120 pts)');
  // Platinum multiplier: 1.5x -> 1000 THB = 150 points
  assert(calculatePointsEarned(1000, 'Platinum') === 150, 'Platinum tier gets 1.5x multiplier on 1000 THB (150 pts)');

  // Test 3: Tier progress calculation
  const progressSilver = getTierProgress(250);
  assert(progressSilver.currentTier === 'Silver', 'Current tier is Silver at 250 pts');
  assert(progressSilver.nextTier === 'Gold', 'Next tier is Gold from Silver');
  assert(progressSilver.neededForNext === 250, 'Needs 250 more points for Gold');

  return { passed, failed };
}
