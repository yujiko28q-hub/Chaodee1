import { verifyAccountCredentials } from '../data/mockAccounts';

export function runAuthTests(): { passed: number; failed: number } {
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

  // Test 1: Admin authentication
  const adminLogin = verifyAccountCredentials('admin@setista.com', '1234');
  assert(adminLogin.success === true, 'Admin credentials authenticate successfully');
  assert(adminLogin.account?.role === 'admin', 'Admin account has admin role');

  // Test 2: Customer authentication
  const customerLogin = verifyAccountCredentials('customer@setista.com', '1234');
  assert(customerLogin.success === true, 'Customer credentials authenticate successfully');
  assert(customerLogin.account?.role === 'customer', 'Customer account has customer role');

  // Test 3: Invalid password
  const badPass = verifyAccountCredentials('admin@setista.com', 'wrongpass');
  assert(badPass.success === false, 'Invalid password fails authentication');
  assert(badPass.error !== undefined, 'Returns descriptive Thai error message');

  // Test 4: Non-existent account
  const notFound = verifyAccountCredentials('unknown@domain.com', '1234');
  assert(notFound.success === false, 'Unknown email fails authentication');

  return { passed, failed };
}
