"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ReviewStatusMap, UserReviewStatus } from "../types/review";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  userReviews: ReviewStatusMap;
  addReviewSubmission: (businessId: string, pointsAwarded: number) => void;
  getReviewStatus: (businessId: string) => UserReviewStatus | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userReviews, setUserReviews] = useState<ReviewStatusMap>({});

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("reviewsmate_user");
    const savedReviews = localStorage.getItem("reviewsmate_reviews");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedReviews) {
      setUserReviews(JSON.parse(savedReviews));
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("reviewsmate_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setUserReviews({});
    localStorage.removeItem("reviewsmate_user");
    localStorage.removeItem("reviewsmate_reviews");
  };

  const addReviewSubmission = (businessId: string, pointsAwarded: number) => {
    const newReview: UserReviewStatus = {
      businessId,
      status: 'pending',
      submittedAt: new Date(),
      pointsAwarded
    };
    
    const updatedReviews = {
      ...userReviews,
      [businessId]: newReview
    };
    
    setUserReviews(updatedReviews);
    localStorage.setItem("reviewsmate_reviews", JSON.stringify(updatedReviews));
  };

  const getReviewStatus = (businessId: string): UserReviewStatus | null => {
    return userReviews[businessId] || null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      userReviews, 
      addReviewSubmission, 
      getReviewStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}