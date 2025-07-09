import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import {
  Mail,
  Phone,
  MapPin,
  Store,
  ChevronRight,
  Heart
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 border-t border-blue-100 overflow-hidden">
      {/* Decorative background elements - Fixed for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-cyan-200 rounded-full filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur-lg opacity-30"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Keithel
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your premier destination for quality products and exceptional service. 
              We're committed to bringing you the best shopping experience.
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <Link 
                to="#" 
                className="group relative p-2 sm:p-2.5 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
              </Link>
              <Link 
                to="#" 
                className="group relative p-2 sm:p-2.5 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
              </Link>
              <Link 
                to="#" 
                className="group relative p-2 sm:p-2.5 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-1 flex-shrink-0" />
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3 ml-5 sm:ml-6">
              {['About Us', 'Products', 'Categories', 'Sale', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="group text-gray-600 hover:text-blue-600 transition-all duration-200 text-sm flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-2 sm:mr-3 group-hover:scale-150 transition-transform flex-shrink-0"></span>
                    <span className="break-words">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-1 flex-shrink-0" />
              Customer Service
            </h3>
            <ul className="space-y-2 sm:space-y-3 ml-5 sm:ml-6">
              {['Contact Us', 'FAQ', 'Shipping Info', 'Returns', 'Size Guide'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="group text-gray-600 hover:text-blue-600 transition-all duration-200 text-sm flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-2 sm:mr-3 group-hover:scale-150 transition-transform flex-shrink-0"></span>
                    <span className="break-words">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-1 flex-shrink-0" />
              Get in Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm break-all">support@keithel.com</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Fixed for mobile */}
        <div className="border-t border-blue-100 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600 text-xs sm:text-sm">
              <span>© {currentYear} Keithel. Made with</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-current animate-pulse" />
              <span>in India</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              <Link 
                to="#" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-xs sm:text-sm relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="#" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-xs sm:text-sm relative group"
              >
                Terms of Service
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                to="#" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-xs sm:text-sm relative group"
              >
                Cookie Policy
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;