import { Truck, Shield, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-tight">
            About Clover Arena
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-emerald-100 max-w-2xl mx-auto px-4">
            Your trusted destination for authentic football jerseys from Manipur
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
            <img
              src="/logo.jpeg"
              alt="logo"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0"
            />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-900 text-center sm:text-left">
              Welcome to Clover Arena
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              Welcome to Clover Arena - your go-to destination for high-quality
              football jerseys from Manipur! At Clover Arena, we are passionate
              about football and committed to providing sports enthusiasts with
              authentic, top-notch football jerseys that showcase the spirit of
              the game.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              Based in Manipur, we specialize in offering a wide range of
              football jerseys, perfect for players, fans, and collectors alike.
              Our goal is to deliver not just great products but also an
              exceptional shopping experience. That's why we pride ourselves on
              fast delivery and excellent customer service, ensuring you get
              what you need, when you need it.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              Whether you are gearing up for a match, supporting your favorite
              team, or simply adding to your collection, Clover Arena is here to
              make your experience smooth, reliable, and enjoyable.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Shield className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2 sm:mb-3">
              Authentic Quality
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We provide only authentic, high-quality football jerseys that meet
              the highest standards.
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Truck className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2 sm:mb-3">
              Fast Delivery
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Quick and reliable shipping ensures you get your jerseys when you
              need them most.
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Heart className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2 sm:mb-3">
              Customer First
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Excellent customer service is at the heart of everything we do at
              Clover Arena.
            </p>
          </div>
        </div>

        {/* Location Banner */}
        <div className="bg-emerald-600 rounded-xl sm:rounded-2xl text-white p-6 sm:p-8 text-center mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
            <MapPin size={28} className="mb-2 sm:mb-0 sm:mr-3 flex-shrink-0" />
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center">
              Proudly Based in Manipur
            </h3>
          </div>
          <p className="text-emerald-100 text-sm sm:text-base lg:text-lg leading-relaxed">
            Bringing you the finest football jerseys from the heart of India's
            football-loving state
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-900 mb-4 sm:mb-6">
              ⚽ Clover Arena - Play Bold, Wear Proud
            </h3>
            <Link
              to={"/products"}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
