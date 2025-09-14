import { Mail, Phone, MapPin, MessageSquare, Heart } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-16 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare size={48} className="mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            We'd love to hear from you! Get in touch with us for any questions,
            support, or feedback.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At Clover Arena, we're committed to providing exceptional
                customer service. Whether you have questions about our products,
                need help with an order, or just want to say hello, we're here
                to help!
              </p>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-emerald-900 mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center space-x-4 group p-4 rounded-lg hover:bg-emerald-50 transition-colors">
                  <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email Us</h4>
                    <a
                      href="mailto:cloverarena.cs@gmail.com"
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      cloverarena.cs@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-4 group p-4 rounded-lg hover:bg-emerald-50 transition-colors">
                  <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Call Us</h4>
                    <a
                      href="tel:+918416082998"
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      +91 8416082998
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-4 group p-4 rounded-lg hover:bg-emerald-50 transition-colors">
                  <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Location</h4>
                    <p className="text-gray-600">Manipur, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-emerald-900 mb-6">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61580200125912"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FaFacebookF className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                </a>
                <a
                  href="https://whatsapp.com/channel/0029Vb6nJZC3bbVB6GIH5i1r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FaWhatsapp className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                </a>
                <a
                  href="https://www.instagram.com/clover.arena"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <FaInstagram className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-5 h-5 md:w-8 md:h-8 text-emerald-200 mr-3 animate-pulse" />
            <h3 className="text-lg md:text-2xl font-bold">
              Made with Love in Manipur
            </h3>
          </div>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            We're proud to be your premier destination for quality products and
            exceptional service. Our team is dedicated to bringing you the best
            shopping experience possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
