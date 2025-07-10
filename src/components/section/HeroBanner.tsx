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
        prev + 1 >= promoSlides.length ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [promoSlides.length]);

  return (
    <div className="relative overflow-hidden  mb-10">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-12 md:px-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Member count card */}
          <div className="group">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="text-center">
                <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                  {promoSlides[currentPromo].members}
                </p>
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-600 mt-2">
                  Members
                </p>
              </div>
              {/* Animated ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-sky-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Promo content */}
          <div className="text-center md:text-left max-w-lg">
            <div className="overflow-hidden">
              <h3 className="text-lg md:text-xl text-white/90 font-medium mb-3 transform transition-all duration-700 ease-out"
                  style={{
                    transform: `translateY(${currentPromo * -100}%)`,
                    opacity: 1
                  }}>
                {promoSlides[currentPromo].subtitle}
              </h3>
            </div>
            <div className="overflow-hidden">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white whitespace-pre-line leading-tight mb-4 transform transition-all duration-700 ease-out"
                  style={{
                    transform: `translateY(${currentPromo * -100}%)`,
                    opacity: 1
                  }}>
                {promoSlides[currentPromo].title}
              </h2>
            </div>
            <p className="text-sm md:text-base text-white/80 font-light">
              Our membership team will notify winners.
            </p>
            
            {/* CTA Button */}
            <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-gray-50">
              Learn More →
            </button>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center mt-8 space-x-3">
          {promoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPromo(index)}
              className="group relative"
            >
              <span
                className={`block w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentPromo 
                    ? "w-8 bg-white" 
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
              {index === currentPromo && (
                <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-25"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-[4000ms] ease-linear"
          style={{
            width: '100%',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            animation: 'progress 4s linear infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;