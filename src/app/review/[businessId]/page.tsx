"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useReviewsStore } from "../../stores/reviewsStore";
import { Business } from "../../schemas";
import { sampleBusinesses } from "../../data/businesses";

interface PageProps {
  params: {
    businessId: string;
  };
}

export default function ReviewPage({ params }: PageProps) {
  const router = useRouter();
  const { addReviewSubmission, getReviewStatus } = useReviewsStore();

  const [business, setBusiness] = useState<Business | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasWrittenReview, setHasWrittenReview] = useState(false);

  useEffect(() => {
    const businessId = params?.businessId;
    if (!businessId) return;

    const foundBusiness = sampleBusinesses.find((b) => b.id === businessId);
    if (foundBusiness) {
      setBusiness(foundBusiness);

      // Check if user has already submitted a review for this business
      const existingReview = getReviewStatus(businessId);
      if (existingReview) {
        setIsSubmitted(true);
      }
    } else {
      // If business not found, redirect to home
      router.push("/");
    }
  }, [params, router, getReviewStatus]);

  // Show loading state while business is being loaded
  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setScreenshot(file);
  };

  const handleSubmit = async () => {
    if (!hasWrittenReview) {
      alert("Please complete your Google review first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate submission process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      addReviewSubmission(business.id, screenshot ? business.pointsReward : Math.floor(business.pointsReward / 2), "default-user-id");

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGoogleReviewUrl = () => {
    // Generate Google review URL for the business
    return `https://search.google.com/local/writereview?placeid=default`;
  };

  const fullPoints = screenshot ? business.pointsReward : Math.floor(business.pointsReward / 2);

  // Submitted screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your review for {business.name} has been submitted and is awaiting approval
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-orange-800 font-semibold text-lg">Status: Pending Approval</span>
            </div>
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                <strong>Points to be awarded:</strong> {fullPoints} points
                {!screenshot && (
                  <span className="text-orange-600 block text-sm mt-1">(Half points - no image uploaded)</span>
                )}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Evaluation Process:</strong>
                  <br />
                  Your submission will be evaluated by our team within the next 5 business days. Credits will be processed
                  based on our review. There is a possibility of denial if the submission doesn&apos;t meet our guidelines.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Main screen (not yet submitted)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/")}
                className="mr-4 p-2 rounded-full hover:bg-gray-50 transition-colors group"
              >
                <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Write a Review</h1>
                <p className="text-gray-600">Share your experience and help others discover great businesses</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
              Earn up to {business.pointsReward} points
            </div>
          </div>
        </div>
      </div>

      {/* Business Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="px-6 w-full">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Image
                src={business.imageUrl || "/api/placeholder/300/200"}
                alt={business.name}
                width={100}
                height={100}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-xl border-4 border-white/20"
              />
              {business.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h2 className="text-2xl md:text-3xl font-bold">{business.name}</h2>
                {business.verified && (
                  <span className="ml-3 bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-lg text-white/90 mb-2">{business.category}</p>
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex items-center">
                  <div className="flex text-amber-300 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(business.rating) ? "fill-current" : "text-white/30"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-white">{business.rating}</span>
                  <span className="text-white/70 ml-2">({business.reviewCount} reviews)</span>
                </div>
                <div className="hidden md:block">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {business.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Two Column Layout */}
      <div className="w-full px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 min-h-[calc(100vh-400px)]">
          {/* Left Column - Guidelines & Policies */}
          <div className="bg-white border-r border-gray-200 p-8 h-full flex flex-col">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Review Guidelines & Policies</h2>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto">
              {/* Writing Guidelines */}
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Writing Guidelines
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-800">Write an honest, detailed review about your experience</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-800">Include specific details about service, quality, atmosphere</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-800">Be respectful and constructive in your feedback</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-800">Reviews are verified by our team within 3-5 business days</p>
                  </div>
                </div>
              </div>

              {/* Important Restrictions */}
              <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                <h3 className="font-semibold text-red-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Important Restrictions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-800">
                      <strong>Fake reviews are strictly prohibited</strong> and will result in account suspension
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-800">
                      <strong>Internet images are not accepted</strong> - only original photos
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-800">
                      <strong>Reviews must stay live for at least 2 weeks</strong> before credits are awarded
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-800">
                      <strong>Deleting the review after submission is not allowed</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Points & Rewards System (fixed) */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Points & Rewards System
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                    <div>
                      <span className="font-medium text-gray-700">Review + Screenshot (Original Image)</span>
                      <p className="text-sm text-gray-500">Full reward</p>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{business.pointsReward} pts</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-amber-200 shadow-sm">
                    <div>
                      <span className="font-medium text-gray-700">Review Only (Text)</span>
                      <p className="text-sm text-gray-500">Standard reward</p>
                    </div>
                    <span className="text-2xl font-bold text-amber-600">
                      {Math.floor(business.pointsReward / 2)} pts
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-green-100 rounded-xl">
                  <p className="text-green-800 font-medium text-center">
                    💡 Providing a review with an original image will give you full points!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Review Actions & Upload */}
          <div className="bg-white p-8 h-full flex flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto">
              {/* Step 1: Write Review */}
              <div className="bg-gray-50 rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg mr-4">
                    1
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Write Your Google Review</h2>
                    <p className="text-gray-600">Click below to start writing your review</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <a
                    href={getGoogleReviewUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center text-lg"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Write Review on Google
                  </a>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasWrittenReview}
                        onChange={(e) => setHasWrittenReview(e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-4"
                      />
                      <div>
                        <span className="text-gray-900 font-medium text-lg">I have completed my Google review</span>
                        <p className="text-gray-600 text-sm">Check this box after writing your review</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 2: Upload Screenshot */}
              <div className="bg-gray-50 rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg mr-4">
                    2
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upload Screenshot</h2>
                    <p className="text-gray-600">Optional - Upload to earn full points</p>
                  </div>
                </div>

                {/* Screenshot Requirements */}
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 mb-6">
                  <h4 className="font-semibold text-amber-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Screenshot Requirements
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-amber-800 text-sm">Capture your complete review as it appears on Google</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-amber-800 text-sm">Include your profile name and review date</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-amber-800 text-sm">Screenshot must be clear and readable</p>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-2xl p-8 transition-colors mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {screenshot ? screenshot.name : "Upload Screenshot"}
                    </h3>
                    <p className="text-gray-500 text-center">
                      Drag and drop your screenshot here, or click to browse
                      <br />
                      <span className="text-sm">PNG, JPG up to 10MB</span>
                    </p>
                  </label>
                </div>

                {screenshot && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-800 font-medium">Screenshot uploaded successfully!</span>
                    </div>
                  </div>
                )}

                {/* Points Summary */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4 text-center">You will earn</h4>
                  <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {fullPoints} points
                    </div>
                    <p className="text-gray-600">
                      {screenshot ? "With screenshot bonus!" : "Upload screenshot to double your points"}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !hasWrittenReview}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting Review...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit for Review
                    </div>
                  )}
                </button>

                {!hasWrittenReview && (
                  <p className="text-red-500 text-sm mt-4 text-center">Please complete your Google review first</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
