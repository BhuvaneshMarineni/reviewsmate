"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import { useHasReviewed } from "../stores/reviewsStore";
import { Business } from "../schemas";

interface BusinessCardProps {
  business: Business;
  isMobile?: boolean;
}

export default function BusinessCard({ business, isMobile = false }: BusinessCardProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const hasSubmittedReview = useHasReviewed(business.id);

  const handleReviewClick = () => {
    if (!user) {
      // Redirect to signin if not logged in
      router.push("/signin");
      return;
    }
    
    router.push(`/review/${business.id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
      isMobile ? 'h-auto' : ''
    }`}>
      {/* Business Image */}
      <div className={`relative bg-gradient-to-r from-purple-400 to-pink-400 ${
        isMobile ? 'h-24' : 'h-48'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-white font-bold opacity-20 ${
            isMobile ? 'text-3xl' : 'text-6xl'
          }`}>
            {business.name.charAt(0)}
          </div>
        </div>
        {business.verified && !hasSubmittedReview && (
          <div className={`absolute ${isMobile ? 'top-1 right-1' : 'top-3 right-3'} bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center`}>
            {!isMobile && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {isMobile ? '✓' : 'Verified'}
          </div>
        )}
        {hasSubmittedReview && (
          <div className={`absolute ${business.verified ? (isMobile ? 'top-6' : 'top-12') : (isMobile ? 'top-1' : 'top-3')} ${isMobile ? 'right-1' : 'right-3'} bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center`}>
            {!isMobile && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            )}
            {isMobile ? '⏳' : 'Review Pending'}
          </div>
        )}
        <div className={`absolute ${isMobile ? 'top-1 left-1' : 'top-3 left-3'} bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full ${isMobile ? 'text-xs' : 'text-sm'} font-bold`}>
          +{business.pointsReward}
        </div>
      </div>

      {/* Business Info */}
      <div className={`p-3 flex flex-col ${isMobile ? 'h-auto min-h-[160px]' : 'h-[280px] p-6'}`}>
        {/* Header with Name and Category */}
        <div className={`flex justify-between items-start ${isMobile ? 'mb-2' : 'mb-3'}`}>
          <h3 className={`font-bold text-gray-900 flex-1 pr-2 leading-tight ${isMobile ? 'text-sm' : 'text-xl'}`}>
            {isMobile ? business.name.length > 16 ? business.name.substring(0, 16) + '...' : business.name : business.name}
          </h3>
          <span className={`text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap ${isMobile ? 'text-[10px] px-1' : ''}`}>
            {isMobile ? business.category.split(' ')[0] : business.category}
          </span>
        </div>

        {/* Rating Section */}
        <div className={`flex items-center ${isMobile ? 'mb-2' : 'mb-3'}`}>
          <div className="flex items-center mr-2">
            {renderStars(Math.floor(business.rating))}
          </div>
          <span className={`font-semibold text-gray-700 mr-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {business.rating.toFixed(1)}
          </span>
          <span className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            ({business.reviewCount})
          </span>
        </div>

        {/* Location - Hide on mobile to save space */}
        {!isMobile && (
          <div className="flex items-start text-gray-600 mb-3">
            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm leading-relaxed">{business.address}</span>
          </div>
        )}

        {/* Description - Shortened for mobile */}
        <div className={`flex-1 ${isMobile ? 'mb-2' : 'mb-4'}`}>
          <p className={`text-gray-600 leading-relaxed line-clamp-3 ${isMobile ? 'text-xs line-clamp-2' : 'text-sm'}`}>
            {isMobile && business.description.length > 60 
              ? business.description.substring(0, 60) + '...' 
              : business.description}
          </p>
        </div>

        {/* Review Button - Always at bottom */}
        <div className="mt-auto">
          {hasSubmittedReview ? (
            <button
              onClick={handleReviewClick}
              className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center ${
                isMobile ? 'py-2 text-xs' : 'py-3'
              }`}
            >
              {!isMobile && (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {isMobile ? 'Pending' : 'Review Submitted - Pending Approval'}
            </button>
          ) : (
            <button
              onClick={handleReviewClick}
              className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center ${
                isMobile ? 'py-2 text-xs' : 'py-3'
              }`}
            >
              {!isMobile && (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )}
              {isMobile ? `+${business.pointsReward} pts` : `Write Review & Earn ${business.pointsReward} Points`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}