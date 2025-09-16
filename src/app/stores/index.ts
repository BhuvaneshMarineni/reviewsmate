// Export all stores
export * from './authStore';
export * from './reviewsStore';
export * from './businessStore';

// Store initialization helper
export const initializeStores = () => {
  // Any initialization logic can go here
  console.log('Zustand stores initialized');
};