import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import instance from "../../utils/axios";
import BannerLoading from "../common/BannerLoading";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

// Type definitions
interface Banner {
  id: string;
  imageUrl: string;
  altText: string | null;
  redirectUrl: string;
}

const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await instance.get("/product/banners");

        // Handle the specific API response structure
        let bannersData: Banner[] = [];

        if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.banner)
        ) {
          bannersData = response.data.banner;
        }

        console.log("Banners loaded:", bannersData.length);
        setBanners(bannersData);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setBanners([]); // Ensure banners is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!Array.isArray(banners) || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex: number) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Navigation functions
  const goToPrevious = (): void => {
    if (!Array.isArray(banners) || banners.length === 0) return;
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNext = (): void => {
    if (!Array.isArray(banners) || banners.length === 0) return;
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  // Handle banner click
  const handleBannerClick = (redirectUrl: string): void => {
    // Only redirect if not dragging (to prevent accidental clicks during swipe)
    if (!isDragging && redirectUrl) {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent): void => {
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(0);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchEnd = (): void => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50; // Minimum distance for a swipe

    if (Math.abs(distance) < minSwipeDistance) {
      setIsDragging(false);
      return;
    }

    if (distance > 0) {
      // Swiped left - go to next
      goToNext();
    } else {
      // Swiped right - go to previous
      goToPrevious();
    }

    // Reset drag state after a short delay to prevent accidental clicks
    setTimeout(() => setIsDragging(false), 100);
  };

  // Mouse handlers for desktop drag support (optional)
  const handleMouseDown = (e: React.MouseEvent): void => {
    setTouchStart(e.clientX);
    setTouchEnd(0);
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (touchStart) {
      setTouchEnd(e.clientX);
      setIsDragging(true);
    }
  };

  const handleMouseUp = (): void => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) {
      setIsDragging(false);
      return;
    }

    if (distance > 0) {
      goToNext();
    } else {
      goToPrevious();
    }

    setTimeout(() => setIsDragging(false), 100);
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Handle image error
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const target = e.target as HTMLImageElement;

    // Remove the error handler to avoid infinite loop
    target.onerror = null;

    // Set fallback image
    target.src =
      "https://via.placeholder.com/1200x400/6b7280/ffffff?text=Image+Not+Found";
  };

  // Handle button click with event propagation
  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    action: () => void
  ): void => {
    e.stopPropagation();
    action();
  };

  // Loading state
  if (loading) {
    return <BannerLoading />;
  }

  // If no banners (empty array) or error with no banners, return null (render nothing)
  if (!Array.isArray(banners) || banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-8xl mx-auto group">
      {/* Main banner container - flexible height for desktop */}
      <div className="relative overflow-hidden shadow-lg bg-gray-900">
        {/* Fixed aspect ratio for mobile, flexible for desktop */}
        <div className="relative w-full aspect-[9/4] sm:aspect-auto">
          <div
            className="absolute inset-0 flex transition-transform duration-500 ease-in-out select-none sm:relative"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {banners.map((banner: Banner) => (
              <div
                key={banner.id}
                className="w-full flex-shrink-0 relative cursor-pointer"
                onClick={() => handleBannerClick(banner.redirectUrl)}
              >
                {/* Background blurred image for desktop */}
                {/* <div className="hidden sm:block absolute inset-0">
                  <img
                    src={
                      banner.imageUrl ? `${S3_BASE_URL}${banner.imageUrl}` : ""
                    }
                    alt=""
                    className="w-full h-full object-cover object-center blur-sm scale-110 opacity-50"
                    draggable={false}
                  />
                </div> */}

                {/* Main image */}
                <img
                  src={
                    banner.imageUrl ? `${S3_BASE_URL}${banner.imageUrl}` : ""
                  }
                  alt={banner.altText || "Banner"}
                  className="w-full h-full object-cover object-center sm:w-full sm:h-auto sm:object-contain sm:max-h-[50vh] sm:relative sm:z-10 hover:scale-105 transition-transform duration-300 pointer-events-none"
                  onError={handleImageError}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows - only show if more than 1 banner */}
        {Array.isArray(banners) && banners.length > 1 && (
          <>
            <button
              onClick={(e) => handleButtonClick(e, goToPrevious)}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous banner"
              type="button"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={(e) => handleButtonClick(e, goToNext)}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next banner"
              type="button"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Dot indicators for better mobile UX */}
        {Array.isArray(banners) && banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-teal-800 scale-125 w-4 h-1 sm:w-4 sm:h-1"
                    : "bg-white bg-opacity-50 hover:bg-opacity-75 w-2 h-1 sm:w-3 sm:h-1"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;
