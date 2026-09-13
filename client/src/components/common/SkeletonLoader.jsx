import React from 'react';

export const SkeletonCard = () => (
  <div className="animate-pulse bg-white border border-[#E8DFD0] p-4 flex flex-col gap-4">
    <div className="w-full aspect-[4/5] bg-ivory-200" />
    <div className="h-3 w-1/3 bg-ivory-300" />
    <div className="h-4 w-3/4 bg-ivory-300" />
    <div className="h-4 w-1/2 bg-ivory-300" />
  </div>
);

export const SkeletonGrid = ({ count = 4 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

const SkeletonLoader = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-ivory-300 ${className}`} />;
};

export default SkeletonLoader;
