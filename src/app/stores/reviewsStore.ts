import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  UserReviewStatus, 
  ReviewStatusMap, 
  ReviewSubmission,
  UserReviewStatusSchema,
  ReviewSubmissionSchema 
} from '../schemas';

interface ReviewsState {
  userReviews: ReviewStatusMap;
  submissions: ReviewSubmission[];
  isSubmitting: boolean;
  lastSubmission: ReviewSubmission | null;
}

interface ReviewsActions {
  addReviewSubmission: (businessId: string, pointsAwarded: number, userId: string) => void;
  updateReviewStatus: (businessId: string, status: 'pending' | 'approved' | 'denied') => void;
  getReviewStatus: (businessId: string) => UserReviewStatus | null;
  hasUserReviewed: (businessId: string) => boolean;
  setSubmitting: (isSubmitting: boolean) => void;
  removeReview: (businessId: string) => void;
  getReviewsByStatus: (status: 'pending' | 'approved' | 'denied') => UserReviewStatus[];
  getTotalPointsEarned: () => number;
  getReviewCount: () => number;
  clearAllReviews: () => void;
}

type ReviewsStore = ReviewsState & ReviewsActions;

export const useReviewsStore = create<ReviewsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      userReviews: {},
      submissions: [],
      isSubmitting: false,
      lastSubmission: null,

      // Actions
      addReviewSubmission: (businessId: string, pointsAwarded: number, userId: string) => {
        try {
          const reviewId = crypto.randomUUID();
          const now = new Date();

          // Create review status
          const reviewStatus = UserReviewStatusSchema.parse({
            businessId,
            status: 'pending',
            submittedAt: now,
            pointsAwarded,
            reviewId,
          });

          // Create submission record
          const submission = ReviewSubmissionSchema.parse({
            id: reviewId,
            businessId,
            userId,
            reviewUrl: `https://google.com/review/${businessId}`, // Placeholder
            submittedAt: now,
            status: 'pending',
            pointsAwarded,
            hasImage: false, // Will be updated when screenshot is uploaded
          });

          set((state) => ({
            userReviews: {
              ...state.userReviews,
              [businessId]: reviewStatus,
            },
            submissions: [...state.submissions, submission],
            lastSubmission: submission,
          }));
        } catch (error) {
          console.error('Review submission validation error:', error);
          throw error;
        }
      },

      updateReviewStatus: (businessId: string, status: 'pending' | 'approved' | 'denied') => {
        const currentReview = get().userReviews[businessId];
        if (!currentReview) return;

        try {
          const updatedReview = UserReviewStatusSchema.parse({
            ...currentReview,
            status,
          });

          set((state) => ({
            userReviews: {
              ...state.userReviews,
              [businessId]: updatedReview,
            },
            submissions: state.submissions.map(sub => 
              sub.businessId === businessId 
                ? { ...sub, status }
                : sub
            ),
          }));
        } catch (error) {
          console.error('Review status update validation error:', error);
          throw error;
        }
      },

      getReviewStatus: (businessId: string) => {
        return get().userReviews[businessId] || null;
      },

      hasUserReviewed: (businessId: string) => {
        return !!get().userReviews[businessId];
      },

      setSubmitting: (isSubmitting: boolean) => {
        set({ isSubmitting });
      },

      removeReview: (businessId: string) => {
        set((state) => {
          const updatedReviews = { ...state.userReviews };
          delete updatedReviews[businessId];
          
          return {
            userReviews: updatedReviews,
            submissions: state.submissions.filter(sub => sub.businessId !== businessId),
          };
        });
      },

      getReviewsByStatus: (status: 'pending' | 'approved' | 'denied') => {
        return Object.values(get().userReviews).filter(review => review.status === status);
      },

      getTotalPointsEarned: () => {
        return Object.values(get().userReviews)
          .filter(review => review.status === 'approved')
          .reduce((total, review) => total + (review.pointsAwarded || 0), 0);
      },

      getReviewCount: () => {
        return Object.keys(get().userReviews).length;
      },

      clearAllReviews: () => {
        set({
          userReviews: {},
          submissions: [],
          lastSubmission: null,
        });
      },
    }),
    {
      name: 'reviewsmate-reviews',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : null),
      partialize: (state) => ({ 
        userReviews: state.userReviews,
        submissions: state.submissions,
      }),
    }
  )
);

// Selectors for better performance
export const useUserReviews = () => useReviewsStore((state) => state.userReviews);
export const useHasReviewed = (businessId: string) => useReviewsStore((state) => state.hasUserReviewed(businessId));
export const useReviewStatus = (businessId: string) => useReviewsStore((state) => state.getReviewStatus(businessId));
export const useIsSubmitting = () => useReviewsStore((state) => state.isSubmitting);
export const useTotalPointsEarned = () => useReviewsStore((state) => state.getTotalPointsEarned());
export const useReviewCount = () => useReviewsStore((state) => state.getReviewCount());