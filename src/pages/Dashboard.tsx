import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LandingHeader from "../components/layout/LandingHeader";
import Product from "../components/Product";
// import SigIn from "./auth/SignIn.tsx"

type ProductType = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
};

interface DashboardProps {
  wishlist: ProductType[];
  addToWishlist: (product: ProductType) => void;
  removeFromWishlist: (productId: number) => void;
}

const Dashboard = ({
  wishlist,
  addToWishlist,
  removeFromWishlist,
}: DashboardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPromo, setCurrentPromo] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const newArrivals: ProductType[] = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 24.99,
      originalPrice: 39.99,
      rating: 4.5,
      image: "https://via.placeholder.com/300x400?text=T-Shirt+1",
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      price: 49.99,
      rating: 4.8,
      image: "https://via.placeholder.com/300x400?text=Jacket",
    },
    {
      id: 3,
      name: "Running Sneakers",
      price: 74.99,
      originalPrice: 99.99,
      rating: 4.6,
      image: "https://via.placeholder.com/300x400?text=Sneakers",
    },
    {
      id: 4,
      name: "Women's Handbag",
      price: 59.99,
      originalPrice: 89.99,
      rating: 4.3,
      image: "https://via.placeholder.com/300x400?text=Handbag",
    },
    {
      id: 5,
      name: "Smartwatch X1",
      price: 199.99,
      rating: 4.7,
      image: "https://via.placeholder.com/300x400?text=Smartwatch",
    },
    {
      id: 6,
      name: "Sports Shorts",
      price: 19.99,
      originalPrice: 29.99,
      rating: 4.2,
      image: "https://via.placeholder.com/300x400?text=Shorts",
    },
    {
      id: 7,
      name: "Stylish Sunglasses",
      price: 29.99,
      rating: 4.4,
      image: "https://via.placeholder.com/300x400?text=Sunglasses",
    },
    {
      id: 8,
      name: "Leather Boots",
      price: 89.99,
      originalPrice: 119.99,
      rating: 4.9,
      image: "https://via.placeholder.com/300x400?text=Boots",
    },
    {
      id: 9,
      name: "Graphic Hoodie",
      price: 39.99,
      rating: 4.1,
      image: "https://via.placeholder.com/300x400?text=Hoodie",
    },
    {
      id: 10,
      name: "Cotton Polo Shirt",
      price: 22.99,
      rating: 4.0,
      image: "https://via.placeholder.com/300x400?text=Polo+Shirt",
    },
    {
      id: 11,
      name: "Slim Fit Jeans",
      price: 45.0,
      rating: 4.5,
      image: "https://via.placeholder.com/300x400?text=Jeans",
    },
  ];

  const promoSlides = [
    {
      members: 40,
      subtitle: "Lucky member orders get",
      title: "A Transformer Bumblebee\nSpeaker Free!",
    },
    {
      members: 20,
      subtitle: "This Week’s Exclusive Offer",
      title: "Win Apple AirPods Pro\nwith Every 5th Order!",
    },
    {
      members: 99,
      subtitle: "Limited Time Perk",
      title: "Get ₹500 Cashback\non Orders Over ₹4999",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const itemWidth = 320;
    const maxIndex = newArrivals.length - 1;
    const newIndex =
      direction === "left"
        ? Math.max(currentIndex - 1, 0)
        : Math.min(currentIndex + 1, maxIndex);
    container.scrollTo({ left: newIndex * itemWidth, behavior: "smooth" });
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / 320);
      setCurrentIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Promo Auto-Change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) =>
        prev - 1 < 0 ? promoSlides.length - 1 : prev - 1
      );
    }, 3000);
    return () => clearInterval(interval);
  });

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === newArrivals.length - 1;

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden pt-[80px]">
      <LandingHeader wishlistCount={wishlist.length} />

      {/* Promo Banner */}
      <div className="relative bg-orange-50 rounded-xl p-6 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-4xl font-bold text-orange-600">
              {promoSlides[currentPromo].members}
            </p>
            <p className="text-sm font-semibold uppercase">Member</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg text-gray-700 font-medium mb-2">
              {promoSlides[currentPromo].subtitle}
            </h3>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 whitespace-pre-line">
              {promoSlides[currentPromo].title}
            </h2>
            <p className="text-sm text-gray-600">
              Our membership team will notify winners.
            </p>
          </div>
        </div>
        <div className=" transform -translate-x-1/2 flex space-x-2">
          {promoSlides.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentPromo ? "bg-orange-500" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Product Carousel */}
      <div className="relative">
        <h2 className="text-2xl font-bold uppercase text-center mb-6">
          New Arrivals
        </h2>

        {/* Navigation Arrows (desktop only) */}
        <button
          onClick={() => scroll("left")}
          disabled={isAtStart}
          className={`hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border rounded-full shadow z-10 ${isAtStart ? "opacity-40 cursor-not-allowed" : ""
            }`}
        >
          <FaChevronLeft className="text-gray-600" />
        </button>

        <button
          onClick={() => scroll("right")}
          disabled={isAtEnd}
          className={`hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border rounded-full shadow z-10 ${isAtEnd ? "opacity-40 cursor-not-allowed" : ""
            }`}
        >
          <FaChevronRight className="text-gray-600" />
        </button>

        {/* Scrollable product list */}
        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-4 overflow-x-auto scroll-smooth pb-10 px-4 md:px-10  scrollbar-hide"
        >
          {newArrivals.map((product) => (
            <Product
              key={product.id}
              product={product}
              isWishlisted={wishlist.some((item) => item.id === product.id)}
              onWishlistToggle={() =>
                wishlist.some((item) => item.id === product.id)
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)
              }
            />
          ))}
        </div>
        

      </div>
    </div>
  );
};

export default Dashboard;
