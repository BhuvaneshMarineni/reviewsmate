import { z } from 'zod';

// User Schema
export const UserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Invalid avatar URL').optional(),
  points: z.number().min(0, 'Points cannot be negative').default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Business Schema
export const BusinessSchema = z.object({
  id: z.string().min(1, 'Business ID is required'),
  name: z.string().min(2, 'Business name must be at least 2 characters').max(200, 'Business name too long'),
  category: z.string().min(1, 'Category is required'),
  rating: z.number().min(0, 'Rating cannot be negative').max(5, 'Rating cannot exceed 5'),
  reviewCount: z.number().min(0, 'Review count cannot be negative'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500, 'Address too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  pointsReward: z.number().min(1, 'Points reward must be at least 1').max(1000, 'Points reward too high'),
  verified: z.boolean().default(false),
  imageUrl: z.string().url('Invalid image URL').optional(),
  website: z.string().url('Invalid website URL').optional(),
  phone: z.string().optional(),
  hours: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()).default([]),
});

// Review Status Schema
export const ReviewStatusSchema = z.enum(['pending', 'approved', 'denied']);

// Review Submission Schema
export const ReviewSubmissionSchema = z.object({
  id: z.string().min(1, 'Review ID is required'),
  businessId: z.string().min(1, 'Business ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  reviewUrl: z.string().url('Invalid review URL'),
  screenshot: z.instanceof(File).optional(),
  screenshotUrl: z.string().url('Invalid screenshot URL').optional(),
  submittedAt: z.date().default(() => new Date()),
  status: ReviewStatusSchema.default('pending'),
  pointsAwarded: z.number().min(0, 'Points awarded cannot be negative'),
  hasImage: z.boolean().default(false),
  content: z.string().min(10, 'Review content must be at least 10 characters').max(5000, 'Review content too long').optional(),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
});

// User Review Status Schema
export const UserReviewStatusSchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  status: ReviewStatusSchema,
  submittedAt: z.date(),
  pointsAwarded: z.number().min(0, 'Points awarded cannot be negative').optional(),
  reviewId: z.string().optional(),
});

// Review Step Schema
export const ReviewStepSchema = z.object({
  id: z.number().min(1, 'Step ID must be positive'),
  title: z.string().min(1, 'Step title is required'),
  description: z.string().min(1, 'Step description is required'),
  completed: z.boolean().default(false),
  active: z.boolean().default(false),
});

// Filter Options Schema
export const FilterOptionsSchema = z.object({
  category: z.string().default('All'),
  rating: z.number().min(0).max(5).optional(),
  verified: z.boolean().optional(),
  hasReviewed: z.boolean().optional(),
  sortBy: z.enum(['rating', 'reviewCount', 'name', 'pointsReward']).default('rating'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10),
  total: z.number().min(0, 'Total cannot be negative').default(0),
});

// API Response Schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
});

// Export types
export type User = z.infer<typeof UserSchema>;
export type Business = z.infer<typeof BusinessSchema>;
export type ReviewSubmission = z.infer<typeof ReviewSubmissionSchema>;
export type UserReviewStatus = z.infer<typeof UserReviewStatusSchema>;
export type ReviewStep = z.infer<typeof ReviewStepSchema>;
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;
export type FilterOptions = z.infer<typeof FilterOptionsSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

// Review Status Map
export type ReviewStatusMap = Record<string, UserReviewStatus>;