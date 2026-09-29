import { useRentalContext } from '../context/RentalContext';
import { SetBooking } from '../types/rental';

export function useBookings() {
  const {
    bookings,
    userBookings,
    activeBookingsCount,
    confirmBooking,
    updateBookingStatus,
  } = useRentalContext();

  return {
    allBookings: bookings,
    myBookings: userBookings,
    activeCount: activeBookingsCount,
    confirmBooking,
    updateBookingStatus,
  };
}
