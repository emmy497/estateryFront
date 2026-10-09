const SkeletonCard = () => {
  return (
    <div className="w-full cursor-pointer h-auto rounded-[10px] border border-[#D9D9D9] shadow-md animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full h-[200px] sm:h-[231px] bg-gray-200 overflow-hidden rounded-t-[10px]"></div>

      <div className="bg-white h-auto lg:h-[225px] rounded-b-[10px] p-[20px]">
        {/* Title skeleton */}
        <div className="h-[20px] sm:h-[18px] bg-gray-200 rounded w-3/4 mb-[19px]"></div>

        {/* Location skeleton */}
        <div className="h-[14px] bg-gray-200 rounded w-1/2 mb-[8px]"></div>

        {/* Features skeleton */}
        <div className="flex gap-4 mt-[19px] text-sm mb-[32px]">
          <div className="h-[14px] w-[60px] bg-gray-200 rounded"></div>
          <div className="h-[14px] w-[60px] bg-gray-200 rounded"></div>
        </div>

        {/* Button and price skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-[40px] w-[80px] bg-gray-200 rounded"></div>
          <div className="h-[20px] w-[80px] bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
