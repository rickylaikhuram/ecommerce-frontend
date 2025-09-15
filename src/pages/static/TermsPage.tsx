import {
  FileText,
  Shield,
  CreditCard,
  Truck,
  RotateCcw,
  Users,
  Copyright,
  AlertTriangle,
  Edit,
  Mail,
  Clock,
  MapPin,
  Search,
} from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-25">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <FileText
              size={40}
              className="mb-3 sm:mb-0 sm:mr-4 text-emerald-200"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed px-4">
            Welcome to Clover Arena. By using our website and services, you
            agree to these terms and conditions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
            By placing an order with Clover Arena, you agree to comply with our
            terms of service. Please read these terms carefully before using our
            website and services.
          </p>
        </div>

        {/* General */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <Shield
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>1. General</span>
          </h2>

          <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 lg:p-8">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Clover Arena provides football jerseys and related products for
              purchase online. By placing an order, you agree to comply with our
              terms of service.
            </p>
          </div>
        </div>

        {/* Order and Payment */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <CreditCard
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>2. Order and Payment</span>
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {[
              "All orders are subject to product availability",
              "Prices are as listed and may change without prior notice",
              "Payment must be completed at checkout through our secure payment system",
              "We accept major payment methods (credit/debit cards, UPI, COD, etc.)",
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping and Delivery */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <Truck
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>3. Shipping and Delivery</span>
          </h2>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 text-center">
              <Clock className="mx-auto text-emerald-600 mb-3" size={32} />
              <h4 className="font-semibold text-emerald-900 mb-2 text-base sm:text-lg">
                Fast Delivery
              </h4>
              <p className="text-gray-700 text-sm sm:text-base">
                We aim to deliver your order as quickly as possible
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 text-center">
              <MapPin className="mx-auto text-emerald-600 mb-3" size={32} />
              <h4 className="font-semibold text-emerald-900 mb-2 text-base sm:text-lg">
                Location Based
              </h4>
              <p className="text-gray-700 text-sm sm:text-base">
                Delivery times may vary depending on your location
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 text-center md:col-span-3 lg:col-span-1">
              <Search className="mx-auto text-emerald-600 mb-3" size={32} />
              <h4 className="font-semibold text-emerald-900 mb-2 text-base sm:text-lg">
                Tracking
              </h4>
              <p className="text-gray-700 text-sm sm:text-base">
                Tracking information provided where applicable
              </p>
            </div>
          </div>
        </div>

        {/* Returns and Refunds */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <RotateCcw
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>4. Returns and Refunds</span>
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h4 className="font-bold text-blue-900 mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center text-base sm:text-lg">
              <Clock
                className="mr-0 sm:mr-2 mb-2 sm:mb-0 flex-shrink-0"
                size={20}
              />
              <span>7-Day Return Guarantee</span>
            </h4>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              We offer a 7-day return guarantee starting from the delivery date.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              "Products must be returned in original condition, unworn, unwashed, and with tags attached",
              "To initiate a return, contact our customer support within 7 days of delivery",
              "Refunds or exchanges will be processed after we receive and inspect the returned product",
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <Users
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>5. User Responsibilities</span>
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                You agree to provide accurate and complete information when
                placing an order.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                You are responsible for keeping your account login details
                secure.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Any misuse of the website, fraudulent orders, or violation of
                these terms may result in cancellation of orders or suspension
                of service.
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <Copyright
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>6. Intellectual Property</span>
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              All content on the Clover Arena website, including logos, text,
              images, and designs, is owned by Clover Arena and protected by
              copyright laws. You may not use any content without our explicit
              permission.
            </p>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <AlertTriangle
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>7. Limitation of Liability</span>
          </h2>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Clover Arena is not liable for any indirect, incidental, or
              consequential damages arising from the use of our website or
              products. We strive for accuracy but cannot guarantee that product
              descriptions or images are error-free.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <Edit
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>8. Changes to Terms</span>
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg">
            We may update these Terms of Service at any time. Any changes will
            be posted on this page with the updated date.
          </p>

          <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
            <p className="text-gray-600 text-sm sm:text-base">
              <strong>Last Updated:</strong> September 2025
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <Mail size={32} className="mb-3 sm:mb-0 sm:mr-3 text-emerald-200" />
            <h3 className="text-2xl sm:text-3xl font-bold">
              Questions About Our Terms?
            </h3>
          </div>
          <p className="text-emerald-100 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
            For any questions regarding our terms of service, feel free to
            contact us
          </p>
          <div className="bg-white/10 rounded-lg p-4 sm:p-6 inline-block">
            <p className="text-emerald-100 text-sm sm:text-base break-all">
              <strong>Email:</strong> cloverarena.cs@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
