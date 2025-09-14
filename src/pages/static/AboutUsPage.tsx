import React from "react";
import { Truck, Shield, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Clover Arena
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Your trusted destination for authentic football jerseys from Manipur
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
              <Heart className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-emerald-900">
              Welcome to Clover Arena
            </h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Welcome to Clover Arena – your go-to destination for high-quality
            football jerseys from Manipur! At Clover Arena, we are passionate
            about football and committed to providing sports enthusiasts with
            authentic, top-notch football jerseys that showcase the spirit of
            the game.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Based in Manipur, we specialize in offering a wide range of football
            jerseys, perfect for players, fans, and collectors alike. Our goal
            is to deliver not just great products but also an exceptional
            shopping experience. That's why we pride ourselves on fast delivery
            and excellent customer service, ensuring you get what you need, when
            you need it.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Whether you are gearing up for a match, supporting your favorite
            team, or simply adding to your collection, Clover Arena is here to
            make your experience smooth, reliable, and enjoyable.
          </p>
        </div>

        {/* Our Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">
              Authentic Quality
            </h3>
            <p className="text-gray-600">
              We provide only authentic, high-quality football jerseys that meet
              the highest standards.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Quick and reliable shipping ensures you get your jerseys when you
              need them most.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">
              Customer First
            </h3>
            <p className="text-gray-600">
              Excellent customer service is at the heart of everything we do at
              Clover Arena.
            </p>
          </div>
        </div>

        {/* Location Banner */}
        <div className="bg-emerald-600 rounded-2xl text-white p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <MapPin size={32} className="mr-3" />
            <h3 className="text-2xl font-bold">Proudly Based in Manipur</h3>
          </div>
          <p className="text-emerald-100 text-lg">
            Bringing you the finest football jerseys from the heart of India's
            football-loving state
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-emerald-900 mb-4">
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
