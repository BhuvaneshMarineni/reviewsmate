"use client";

import React, { useEffect, useMemo } from "react";
import BusinessCard from "./components/BusinessCard";
import { useBusinessStore } from "./stores/businessStore";
import { useAuthStore } from "./stores/authStore";
import { sampleBusinesses } from "./data/businesses";

// Debug: Check if businesses are imported
console.log('Import check - sampleBusinesses:', sampleBusinesses);
console.log('Import check - length:', sampleBusinesses?.length);

export default function Home() {
  const { 
    businesses, 
    searchTerm,
    filters,
    pagination,
    setBusinesses,
    setSearchTerm,
    setFilters,
    setPagination,
    getFilteredBusinesses,
  } = useBusinessStore();

  const { user, isAuthenticated } = useAuthStore();

  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize businesses on first load
  useEffect(() => {
    console.log('Page loading - businesses length:', businesses.length);
    console.log('Sample businesses available:', sampleBusinesses?.length || 'none');
    
    // Always set businesses from sample data to ensure they load
    if (sampleBusinesses && sampleBusinesses.length > 0 && businesses.length === 0) {
      console.log('Loading businesses...');
      setBusinesses(sampleBusinesses);
    }
  }, [businesses.length, setBusinesses]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    console.log('Applying filters...');
    const store = useBusinessStore.getState();
    store.applyFilters();
  }, [businesses, searchTerm, filters]);

  const categories = [
    "All", 
    "Coffee Shop", 
    "Italian Restaurant", 
    "Pizza Restaurant", 
    "Electronics Repair", 
    "Auto Repair", 
    "Wellness & Spa", 
    "Fitness Center", 
    "Yoga Studio", 
    "Bookstore", 
    "Dental Clinic", 
    "Hair Salon", 
    "Grocery Store", 
    "Veterinary Clinic", 
    "Bakery", 
    "Entertainment", 
    "Hotel", 
    "Dry Cleaning", 
    "Garden Center", 
    "Brewery", 
    "Music Store"
  ];

  const currentBusinesses = getFilteredBusinesses();
  const allFilteredBusinesses = useBusinessStore.getState().filteredBusinesses;
  
  // Fallback filtering when store filtering isn't working
  const fallbackFilteredBusinesses = useMemo(() => {
    const businessesToFilter = businesses.length > 0 ? businesses : sampleBusinesses;
    let filtered = [...businessesToFilter];

    // Apply search term
    if (searchTerm.trim()) {
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

    return filtered;
  }, [businesses, searchTerm, filters.category]);
  
  // Calculate total pages with fallback and mobile consideration
  const actualFilteredBusinesses = allFilteredBusinesses.length > 0 ? allFilteredBusinesses : fallbackFilteredBusinesses;
  const totalBusinessesCount = actualFilteredBusinesses.length;
  const itemsPerPage = isMobile ? 6 : 12;
  const totalPages = Math.ceil(totalBusinessesCount / itemsPerPage);

  // Debug logging
  console.log('Businesses loaded:', businesses.length);
  console.log('Current businesses (paginated):', currentBusinesses.length);
  console.log('All filtered businesses:', allFilteredBusinesses.length);
  console.log('Total pages:', totalPages);
  console.log('Current page:', pagination.page);

    // Use the paginated businesses from the store, with robust fallback
  const displayBusinesses = currentBusinesses.length > 0 ? currentBusinesses : 
    fallbackFilteredBusinesses.slice((pagination.page - 1) * itemsPerPage, pagination.page * itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPagination({ page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    setFilters({ category });
    setPagination({ page: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination({ page });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        {/* Top Header with User Points and Redeem */}
        {isAuthenticated && user && (
          <div className="flex justify-center items-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-white font-bold text-xl">You have {user.points || 0} points to redeem</span>
              </div>
              
              <button className="bg-white hover:bg-gray-100 text-orange-600 font-bold px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md ml-4">
                Redeem Now
              </button>
            </div>
          </div>
        )}

        {/* Search Bar and Category Filter */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            {/* White Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg bg-white"
              />
            </div>

            {/* Collapsible Category Button */}
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="px-6 py-3 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-200 flex items-center gap-2 min-w-[120px]"
            >
              <span>{filters.category}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Transparent Shadow Categories Panel - Expands Below */}
          {isCategoriesOpen && (
            <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-6 animate-in slide-in-from-top-2 duration-300">
              <h3 className="text-lg font-semibold text-white mb-4">Choose Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      handleCategoryChange(category);
                      setIsCategoriesOpen(false);
                    }}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                      filters.category === category
                        ? "bg-white text-purple-600 shadow-lg transform scale-105"
                        : "bg-white/20 text-white hover:bg-white/30 hover:scale-105 border border-white/20"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="text-white/80 text-sm mt-4">
            Showing {displayBusinesses.length} of {totalBusinessesCount} businesses (Page {pagination.page} of {totalPages}) {isMobile && '• Mobile View'}
          </div>
        </div>

        {/* Business Grid - Mobile Optimized */}
        <div className={`grid gap-4 mb-8 ${
          isMobile 
            ? 'grid-cols-2 gap-3' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        }`}>
          {displayBusinesses.length > 0 ? (
            displayBusinesses.map((business) => (
              <div key={business.id} className={isMobile ? 'mobile-card' : ''}>
                <BusinessCard
                  business={business}
                  isMobile={isMobile}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-white text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  No businesses found
                </h3>
                <p className="text-white/80">
                  Try adjusting your search criteria or browse all categories.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pagination.page === page
                    ? "bg-white text-purple-600 font-semibold"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="px-4 py-2 rounded-lg bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
