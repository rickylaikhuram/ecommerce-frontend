import { useState, useEffect } from "react";

type PromoSlide = {
  id: number; // Added ID for better key management
  discount: number;
  subtitle: string;
  title: string;
  highlight?: string;
  imageUrl: string;
};

const HeroBanner = () => {
  const [currentPromo, setCurrentPromo] = useState(0);

  const promoSlides: PromoSlide[] = [
    {
      id: 1,
      discount: 40,
      subtitle: "Limited Edition Jerseys",
      title: "Get Authentic {highlight} Kits\nWith Player Printing",
      highlight: "2024/25",
      imageUrl:
        "https://i.pinimg.com/736x/c3/37/a4/c337a4ef3462aae2eb45336ed4c8527b.jpg",
    },
    {
      id: 2,
      discount: 30,
      subtitle: "Matchday Special",
      title: "{highlight} Jersey Sale\nFree Number Printing Included",
      highlight: "Champions League",
      imageUrl:
        "https://i.pinimg.com/1200x/05/05/ed/0505edd50226c92e75ebb74afcd86dfe.jpg",
    },
    {
      id: 3,
      discount: 25,
      subtitle: "Derby Day Collection",
      title: "Classic {highlight} Kits\nNow Available in Retro Styles",
      highlight: "Rivalry",
      imageUrl:
        "https://i.pinimg.com/736x/49/2c/73/492c7364f36f21ef991b367b006932db.jpg",
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

  const formatTitle = (title: string, highlight?: string) => {
    return title.replace("{highlight}", highlight || "").split("\n");
  };

  return (
    <div className="relative overflow-hidden mb-10 bg-gradient-to-r from-zinc-200 to-green-600">
      {/* Background with football pattern */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://i.pinimg.com/1200x/99/a4/bc/99a4bcb0275ab1ff90d461539eaf2ebb.jpg')]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-12 md:px-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {/* Discount badge */}
          <div className="group">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-full shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl w-32 h-32 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-green-700 to-yellow-400 bg-clip-text text-transparent">
                  {promoSlides[currentPromo].discount}%
                </p>
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-600 mt-1">
                  OFF
                </p>
              </div>
              {/* Animated ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Promo content */}
          <div className="text-center md:text-left max-w-lg">
            {/* Fixed subtitle animation */}
            <div className="overflow-hidden h-8 mb-3">
              {promoSlides.map((slide, index) => (
                <h3
                  key={slide.id}
                  className={`text-lg md:text-xl text-white/90 font-medium transition-all duration-700 ease-out ${
                    currentPromo === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 absolute"
                  }`}
                >
                  {slide.subtitle}
                </h3>
              ))}
            </div>

            {/* Title animation */}
            <div className="overflow-hidden h-32 mb-4">
              {promoSlides.map((slide, index) => (
                <h2
                  key={slide.id}
                  className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight transition-all duration-700 ease-out ${
                    currentPromo === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 absolute"
                  }`}
                >
                  {formatTitle(slide.title, slide.highlight).map((line, i) => (
                    <span key={i} className="block">
                      {line.includes(slide.highlight || "") ? (
                        <>
                          {line.split(slide.highlight || "")[0]}
                          <span className="text-yellow-300">
                            {slide.highlight}
                          </span>
                          {line.split(slide.highlight || "")[1]}
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  ))}
                </h2>
              ))}
            </div>

            <p className="text-sm md:text-base text-white/80 font-light">
              Official licensed products with free shipping on orders over $75
            </p>

            {/* CTA Button */}
            <button className="mt-6 px-6 py-3 bg-yellow-400 text-green-900 font-bold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:bg-yellow-300 flex items-center">
              Shop Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Jersey images that change with slides */}
          <div className="hidden lg:block relative w-64 h-64 transform transition-all duration-500 hover:scale-110">
            {promoSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  currentPromo === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.imageUrl}
                  alt="Football Jersey"
                  className="rounded-lg w-full h-full object-contain drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent rounded-lg"></div>
                <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center mt-8 space-x-3">
          {promoSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentPromo(index)}
              className="group relative"
            >
              <span
                className={`block w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentPromo
                    ? "w-8 bg-yellow-400"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
              {index === currentPromo && (
                <span className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-25"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar styled like a football field line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-yellow-400 transition-all duration-700 ease-linear"
          style={{
            width: "100%",
            transform: "scaleX(0)",
            transformOrigin: "left",
            animation: "progress 4s linear infinite",
          }}
        />
      </div>

      {/* Football elements */}
      <div className="absolute top-1/4 right-8 w-12 h-12 opacity-20 animate-bounce">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 5a45 45 0 100 90 45 45 0 000-90zm0 5a40 40 0 110 80 40 40 0 010-80zm0 5a35 35 0 100 70 35 35 0 000-70zm0 5a30 30 0 110 60 30 30 0 010-60z"
            fill="white"
          />
          <path
            d="M50 20a30 30 0 100 60 30 30 0 000-60zm0 5a25 25 0 110 50 25 25 0 010-50z"
            fill="black"
          />
        </svg>
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
