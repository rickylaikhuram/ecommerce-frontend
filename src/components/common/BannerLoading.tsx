const BannerLoading = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main banner skeleton */}
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-200">
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse"></div>
        </div>
        
        {/* Loading skeleton for navigation arrows */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading skeleton for dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>
        
        {/* Loading skeleton for counter */}
        <div className="absolute top-4 left-4">
          <div className="w-12 h-6 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 text-sm md:text-base">Loading banners...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerLoading;