export type AppRoute = 
  | 'guest' 
  | 'browse' 
  | 'my-rentals' 
  | 'care-policy' 
  | 'admin' 
  | 'owner';

export interface RouteConfig {
  path: AppRoute;
  title: string;
  requiresAuth: boolean;
  requiredRole?: 'admin' | 'customer';
}
