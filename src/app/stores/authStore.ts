import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserSchema } from '../schemas';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addPoints: (points: number) => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true });
          
          // Validate user data with Zod
          const validatedUser = UserSchema.parse({
            id: userData.id || crypto.randomUUID(),
            name: userData.name || '',
            email: userData.email || '',
            avatar: userData.avatar,
            points: userData.points || 0,
            createdAt: userData.createdAt || new Date(),
            updatedAt: new Date(),
          });

          set({ 
            user: validatedUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Login validation error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          const updatedUser = UserSchema.parse({
            ...currentUser,
            ...userData,
            updatedAt: new Date(),
          });

          set({ user: updatedUser });
        } catch (error) {
          console.error('User update validation error:', error);
          throw error;
        }
      },

      addPoints: (points: number) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = {
          ...currentUser,
          points: currentUser.points + points,
          updatedAt: new Date(),
        };

        set({ user: updatedUser });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'reviewsmate-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);