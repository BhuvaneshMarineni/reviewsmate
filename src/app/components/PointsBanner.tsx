"use client";

import React from "react";
import { useAuthStore } from "../stores/authStore";

interface PointsBannerProps {
  totalPoints: number;
}

export default function PointsBanner({ totalPoints }: PointsBannerProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white/20 rounded-full p-3 mr-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold">{totalPoints.toLocaleString()} Points</h3>
            <p className="text-white/90">Keep reviewing to earn more rewards!</p>
          </div>
        </div>
        <div className="text-right">
          <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full font-semibold transition-all duration-200">
            Redeem Rewards
          </button>
        </div>
      </div>
    </div>
  );
}