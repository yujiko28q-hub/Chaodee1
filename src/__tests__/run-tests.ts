import { runLoyaltyTests } from './loyalty.test';
import { runAuthTests } from './authService.test';
import { runBookingTests } from './bookingService.test';

export function runAllAppTests() {
  console.log('--- Running SETISTA Enterprise Unit Tests ---');
  
  const loyaltyResult = runLoyaltyTests();
  console.log(`Loyalty Tests: ${loyaltyResult.passed} passed, ${loyaltyResult.failed} failed`);

  const authResult = runAuthTests();
  console.log(`Auth Tests: ${authResult.passed} passed, ${authResult.failed} failed`);

  const bookingResult = runBookingTests();
  console.log(`Booking Tests: ${bookingResult.passed} passed, ${bookingResult.failed} failed`);

  const totalPassed = loyaltyResult.passed + authResult.passed + bookingResult.passed;
  const totalFailed = loyaltyResult.failed + authResult.failed + bookingResult.failed;

  console.log(`--- Total: ${totalPassed} passed, ${totalFailed} failed ---`);
  return totalFailed === 0;
}

// Auto-run if executed directly via tsx
if (import.meta.url.endsWith('run-tests.ts')) {
  const ok = runAllAppTests();
  if (!ok) process.exit(1);
}
