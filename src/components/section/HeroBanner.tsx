import { useState, useEffect } from "react";

type PromoSlide = {
  members: number;
  subtitle: string;
  title: string;
};

const HeroBanner = () => {
  const [currentPromo, setCurrentPromo] = useState(0);

  const promoSlides: PromoSlide[] = [
    {
      members: 40,
      subtitle: "Lucky member orders get",
      title: "A Transformer Bumblebee\nSpeaker Free!",
    },
    {
      members: 20,
      subtitle: "This Week's Exclusive Offer",
      title: "Win Apple AirPods Pro\nwith Every 5th Order!",
    },
    {
      members: 99,
      subtitle: "Limited Time Perk",
      title: "Get ₹500 Cashback\non Orders Over ₹4999",
    },
  ];

  // Promo Auto-Change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) =>
        prev - 1 < 0 ? promoSlides.length - 1 : prev - 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
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
      <div className="flex justify-center mt-4 space-x-2">
        {promoSlides.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentPromo ? "bg-orange-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;