export interface ReviewSubmission {
  id: string;
  businessId: string;
  userId: string;
  reviewUrl: string;
  screenshot?: File;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'denied';
  pointsAwarded: number;
  hasImage: boolean;
}

export interface ReviewStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export interface UserReviewStatus {
  businessId: string;
  status: 'pending' | 'approved' | 'denied';
  submittedAt: Date;
  pointsAwarded?: number;
}

export type ReviewStatusMap = Record<string, UserReviewStatus>;