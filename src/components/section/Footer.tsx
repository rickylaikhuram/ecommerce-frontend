import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Mail, Phone, MapPin, ChevronRight, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50 border-t border-emerald-100 overflow-hidden">
      {/* Decorative background elements - Added green element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-emerald-200 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-teal-200 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-emerald-200 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Modified grid for better mobile view */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {/* Company Info - Full width on mobile */}
          <div className="col-span-2 md:col-span-1 space-y-4 sm:space-y-6">
            <Link to={"/"}>
              <img
                src="/logo_details.jpeg"
                alt="Home"
                className={`h-19 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-50 `}
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your premier destination for quality products and exceptional
              service. We're committed to bringing you the best shopping
              experience.
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=61580200125912"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 sm:p-2.5 bg-white/70 backdrop-blur-sm rounded-lg border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb6nJZC3bbVB6GIH5i1r"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 sm:p-2.5 bg-white/70 backdrop-blur-sm rounded-lg border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/clover.arena"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 sm:p-2.5 bg-white/70 backdrop-blur-sm rounded-lg border border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links - 1st column on mobile */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-1 flex-shrink-0" />
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3 ml-5 sm:ml-6">
              {[
                { path: "/about-us", name: "About Us" },
                { path: "/products", name: "Products" },
                { path: "/categories", name: "Categories" },
                { path: "/products?sortBy=price-asc", name: "Sale" },
                { path: "/products", name: "New Arrivals" },
              ].map((item, index) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-gray-600 hover:text-emerald-600 transition-all duration-200 text-sm flex items-center"
                  >
                    <span
                      className={`w-1.5 h-1.5 ${
                        index === 2
                          ? "bg-gradient-to-r from-emerald-400 to-green-400"
                          : "bg-gradient-to-r from-emerald-400 to-cyan-400"
                      } rounded-full mr-2 sm:mr-3 group-hover:scale-150 transition-transform flex-shrink-0`}
                    ></span>
                    <span className="break-words">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service - 2nd column on mobile */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-1 flex-shrink-0" />
              Customer Service
            </h3>
            <ul className="space-y-2 sm:space-y-3 ml-5 sm:ml-6">
              {[
                "Contact Us",
                "Shipping Info",
                "Returns",
                "Size Guide",
              ].map((item, index) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="group text-gray-600 hover:text-emerald-600 transition-all duration-200 text-sm flex items-center"
                  >
                    <span
                      className={`w-1.5 h-1.5 ${
                        index === 1
                          ? "bg-gradient-to-r from-emerald-400 to-green-400"
                          : "bg-gradient-to-r from-emerald-400 to-cyan-400"
                      } rounded-full mr-2 sm:mr-3 group-hover:scale-150 transition-transform flex-shrink-0`}
                    ></span>
                    <span className="break-words">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Newsletter - Full width below on mobile */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-1 flex-shrink-0" />
              Get in Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm break-all">
                  cloverarena.cs@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">
                  +91 8416082998
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm">
                  Manipur, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Added green accent */}
        <div className="border-t border-emerald-100 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600 text-xs sm:text-sm">
              <span>© {currentYear} Clover Arena. Made with</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 fill-current animate-pulse" />
              <span>in India</span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              <Link
                to="#"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-xs sm:text-sm relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-xs sm:text-sm relative group"
              >
                Terms of Service
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
