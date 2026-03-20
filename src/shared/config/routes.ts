export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  HOME: '/',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  PRODUCT_DETAIL: '/products/:id',
  FAVORITES: '/favorites',
  RECOMMENDATIONS: '/recommendations',
  PURCHASES: '/purchases',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];