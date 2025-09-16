import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Business, FilterOptions, Pagination, BusinessSchema, FilterOptionsSchema } from '../schemas';

interface BusinessState {
  businesses: Business[];
  filteredBusinesses: Business[];
  searchTerm: string;
  filters: FilterOptions;
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  favorites: string[];
}

interface BusinessActions {
  setBusinesses: (businesses: Business[]) => void;
  addBusiness: (business: Business) => void;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  setPagination: (pagination: Partial<Pagination>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToFavorites: (businessId: string) => void;
  removeFromFavorites: (businessId: string) => void;
  getBusinessById: (id: string) => Business | undefined;
  getFilteredBusinesses: () => Business[];
  getTotalBusinesses: () => number;
  getBusinessesByCategory: (category: string) => Business[];
  searchBusinesses: (query: string) => Business[];
}

type BusinessStore = BusinessState & BusinessActions;

const defaultFilters: FilterOptions = {
  category: 'All',
  rating: undefined,
  verified: undefined,
  hasReviewed: undefined,
  sortBy: 'rating',
  sortOrder: 'desc',
};

const defaultPagination: Pagination = {
  page: 1,
  limit: 12,
  total: 0,
};

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set, get) => ({
      // Initial state
      businesses: [],
      filteredBusinesses: [],
      searchTerm: '',
      filters: defaultFilters,
      pagination: defaultPagination,
      isLoading: false,
      error: null,
      favorites: [],

      // Actions
      setBusinesses: (businesses: Business[]) => {
        try {
          const validatedBusinesses = businesses.map(business => BusinessSchema.parse(business));
          set({ 
            businesses: validatedBusinesses,
            filteredBusinesses: validatedBusinesses,
            pagination: { ...get().pagination, total: validatedBusinesses.length }
          });
          get().applyFilters();
        } catch (error) {
          console.error('Business validation error:', error);
          set({ error: 'Invalid business data' });
        }
      },

      addBusiness: (business: Business) => {
        try {
          const validatedBusiness = BusinessSchema.parse(business);
          set((state) => {
            const newBusinesses = [...state.businesses, validatedBusiness];
            return {
              businesses: newBusinesses,
              pagination: { ...state.pagination, total: newBusinesses.length }
            };
          });
          get().applyFilters();
        } catch (error) {
          console.error('Business validation error:', error);
          set({ error: 'Invalid business data' });
        }
      },

      updateBusiness: (id: string, updates: Partial<Business>) => {
        set((state) => {
          const updatedBusinesses = state.businesses.map(business => 
            business.id === id ? { ...business, ...updates } : business
          );
          return { businesses: updatedBusinesses };
        });
        get().applyFilters();
      },

      deleteBusiness: (id: string) => {
        set((state) => {
          const updatedBusinesses = state.businesses.filter(business => business.id !== id);
          return {
            businesses: updatedBusinesses,
            pagination: { ...state.pagination, total: updatedBusinesses.length }
          };
        });
        get().applyFilters();
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().applyFilters();
      },

      setFilters: (newFilters: Partial<FilterOptions>) => {
        try {
          const updatedFilters = FilterOptionsSchema.parse({
            ...get().filters,
            ...newFilters,
          });
          set({ filters: updatedFilters });
          get().applyFilters();
        } catch (error) {
          console.error('Filter validation error:', error);
          set({ error: 'Invalid filter options' });
        }
      },

      resetFilters: () => {
        set({ 
          filters: defaultFilters, 
          searchTerm: '',
          pagination: { ...get().pagination, page: 1 }
        });
        get().applyFilters();
      },

      applyFilters: () => {
        const { businesses, searchTerm, filters } = get();
        let filtered = [...businesses];

        // Apply search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(business => 
            business.name.toLowerCase().includes(term) ||
            business.category.toLowerCase().includes(term) ||
            business.address.toLowerCase().includes(term) ||
            business.description.toLowerCase().includes(term)
          );
        }

        // Apply category filter
        if (filters.category && filters.category !== 'All') {
          filtered = filtered.filter(business => business.category === filters.category);
        }

        // Apply rating filter
        if (filters.rating !== undefined) {
          filtered = filtered.filter(business => business.rating >= filters.rating!);
        }

        // Apply verified filter
        if (filters.verified !== undefined) {
          filtered = filtered.filter(business => business.verified === filters.verified);
        }

        // Apply sorting
        filtered.sort((a, b) => {
          const aValue = a[filters.sortBy];
          const bValue = b[filters.sortBy];
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return filters.sortOrder === 'asc' 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return filters.sortOrder === 'asc' 
              ? aValue - bValue
              : bValue - aValue;
          }
          
          return 0;
        });

        set({ 
          filteredBusinesses: filtered,
          pagination: { ...get().pagination, total: filtered.length, page: 1 }
        });
      },

      setPagination: (newPagination: Partial<Pagination>) => {
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination }
        }));
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      addToFavorites: (businessId: string) => {
        set((state) => ({
          favorites: [...state.favorites, businessId]
        }));
      },

      removeFromFavorites: (businessId: string) => {
        set((state) => ({
          favorites: state.favorites.filter(id => id !== businessId)
        }));
      },

      getBusinessById: (id: string) => {
        return get().businesses.find(business => business.id === id);
      },

      getFilteredBusinesses: () => {
        const { filteredBusinesses, pagination } = get();
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        return filteredBusinesses.slice(startIndex, endIndex);
      },

      getTotalBusinesses: () => {
        return get().businesses.length;
      },

      getBusinessesByCategory: (category: string) => {
        return get().businesses.filter(business => business.category === category);
      },

      searchBusinesses: (query: string) => {
        const term = query.toLowerCase();
        return get().businesses.filter(business => 
          business.name.toLowerCase().includes(term) ||
          business.category.toLowerCase().includes(term) ||
          business.address.toLowerCase().includes(term)
        );
      },
    }),
    {
      name: 'reviewsmate-businesses',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        favorites: state.favorites,
        filters: state.filters,
      }),
    }
  )
);

// Selectors for better performance
export const useFilteredBusinesses = () => useBusinessStore((state) => state.getFilteredBusinesses());
export const useBusinesses = () => useBusinessStore((state) => state.businesses);
export const useSearchTerm = () => useBusinessStore((state) => state.searchTerm);
export const useFilters = () => useBusinessStore((state) => state.filters);
export const usePagination = () => useBusinessStore((state) => state.pagination);
export const useBusinessLoading = () => useBusinessStore((state) => state.isLoading);
export const useFavorites = () => useBusinessStore((state) => state.favorites);