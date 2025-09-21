import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ChevronRight, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-emerald-50 via-emerald-50 to-teal-50 border-t border-emerald-100 overflow-hidden pb-15">
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
              Welcome to Clover Arena - your go-to destination for high-quality football jerseys from Manipur!
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=61580200125912"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 sm:p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vb6nJZC3bbVB6GIH5i1r"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 sm:p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/clover.arena"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 sm:p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
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
                { path: "/contact-us", name: "Contact Us" },
                { path: "/shipping-info", name: "Shipping Info" },
                { path: "/return-policy", name: "Returns" },
              ].map((item, index) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="group text-gray-600 hover:text-emerald-600 transition-all duration-200 text-sm flex items-center"
                  >
                    <span
                      className={`w-1.5 h-1.5 ${
                        index === 1
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
                  support@cloverarena.com
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
                to="/privacy-policy"
                className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-xs sm:text-sm relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-green-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/terms-service"
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
