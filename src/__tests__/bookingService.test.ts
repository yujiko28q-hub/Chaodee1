import { SetBooking } from '../types/rental';

export function runBookingTests(): { passed: number; failed: number } {
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

  // Sample mock bookings with user attribution
  const sampleBookings: SetBooking[] = [
    {
      id: 'ORD-001',
      itemId: 'set-01',
      itemTitle: 'Pearl Tweed Set',
      brand: 'Maison Tweed',
      imageUrl: 'https://example.com/item.jpg',
      rentalDays: 3,
      startDate: '2026-10-01',
      endDate: '2026-10-04',
      selectedSize: 'S',
      status: 'pending_owner_approval',
      rentalFee: 1200,
      cleaningFee: 0,
      depositFee: 150,
      discount: 0,
      totalDays: 3,
      needAccessories: false,
      rentalPackage: '3days',
      deliveryMethod: 'ems',
      deliveryAddress: 'Bangkok',
      depositMethod: 'kyc',
      eventOccasion: 'wedding',
      bookedAt: '2026-09-29',
      studioName: 'SETISTA Studio',
      contractId: 'CTR-001',
      accessoryFee: 0,
      totalAmount: 1350,
      userId: 'usr-cust-01',
      userEmail: 'customer@setista.com',
      renterName: 'พิชญ์สินี',
      renterPhone: '0812345678',
    },
    {
      id: 'ORD-002',
      itemId: 'set-02',
      itemTitle: 'Silk Blazer Set',
      brand: 'Chic Atelier',
      imageUrl: 'https://example.com/item2.jpg',
      rentalDays: 5,
      startDate: '2026-10-05',
      endDate: '2026-10-10',
      selectedSize: 'M',
      status: 'fitting_scheduled',
      rentalFee: 2000,
      cleaningFee: 0,
      depositFee: 200,
      discount: 0,
      totalDays: 5,
      needAccessories: false,
      rentalPackage: '5days',
      deliveryMethod: 'messenger',
      deliveryAddress: 'Bangkok',
      depositMethod: 'kyc',
      eventOccasion: 'gala',
      bookedAt: '2026-09-29',
      studioName: 'SETISTA Studio',
      contractId: 'CTR-002',
      accessoryFee: 0,
      totalAmount: 2200,
      userId: 'usr-cust-02',
      userEmail: 'another@example.com',
      renterName: 'สมหญิง',
      renterPhone: '0898765432',
    },
  ] as unknown as SetBooking[];

  // Test 1: User order isolation
  const cust1Orders = sampleBookings.filter(
    (b) => b.userId === 'usr-cust-01' || b.userEmail === 'customer@setista.com'
  );
  assert(cust1Orders.length === 1, 'Customer 1 sees only their own booking');
  assert(cust1Orders[0].id === 'ORD-001', 'Customer 1 matches ORD-001');

  // Test 2: Active bookings filtering
  const activeStatuses = ['pending_owner_approval', 'fitting_scheduled', 'dispatched', 'active_renting', 'returning'];
  const activeOrders = cust1Orders.filter((b) => activeStatuses.includes(b.status));
  assert(activeOrders.length === 1, 'Confirmed order counts towards active bookings');

  // Test 3: New customer isolation
  const newCustOrders = sampleBookings.filter(
    (b) => b.userId === 'usr-new-999' || b.userEmail === 'newuser@example.com'
  );
  assert(newCustOrders.length === 0, 'New customer has 0 bookings initially');

  return { passed, failed };
}
