import { useAuth as useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const auth = useAuthContext();
  const isAdmin = auth.currentUser?.role === 'admin';
  const isCustomer = auth.currentUser?.role === 'customer';
  const isAuthenticated = auth.currentUser !== null;

  return {
    ...auth,
    isAdmin,
    isCustomer,
    isAuthenticated,
  };
}
