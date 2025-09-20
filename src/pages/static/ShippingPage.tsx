import {
  Truck,
  Package,
  Clock,
  MapPin,
  Search,
  AlertCircle,
  Mail,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const ShippingPage = () => {
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
            <Truck
              size={40}
              className="mb-3 sm:mb-0 sm:mr-4 text-emerald-200"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Shipping Information
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed px-4">
            We strive to deliver your football jerseys quickly and safely to
            your doorstep.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
            At Clover Arena, we are committed to getting your favorite football
            jerseys to you as quickly and safely as possible. Here's everything
            you need to know about our shipping process.
          </p>
        </div>

        {/* Processing Time */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <Clock
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>1. Processing Time</span>
          </h2>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 lg:p-8">
              <h4 className="font-semibold text-emerald-900 mb-3 sm:mb-4 text-lg sm:text-xl">
                Standard Processing
              </h4>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Orders are typically processed within 1-2 business days after
                payment confirmation.
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 sm:p-6 lg:p-8">
              <h4 className="font-semibold text-orange-900 mb-3 sm:mb-4 text-lg sm:text-xl">
                High-Demand Periods
              </h4>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                During busy seasons, processing may take a little longer than
                usual.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <Package
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>2. Shipping Methods & Delivery Time</span>
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                title: "Nationwide Delivery",
                description: "We offer reliable shipping across India",
              },
              {
                title: "Standard Delivery",
                description:
                  "Usually takes 3–7 business days, depending on your location",
              },
              {
                title: "Remote Areas",
                description:
                  "In some cases, remote areas may take up to 10 business days",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
                    {item.title}
                  </p>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Charges */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <CreditCard
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>3. Shipping Charges</span>
          </h2>

          <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="space-y-3 sm:space-y-4">
              {[
                "Shipping charges are calculated at checkout based on your location and order size",
                "Free shipping promotions may apply on qualifying orders",
              ].map((item, index) => (
                <p
                  key={index}
                  className="text-gray-700 flex items-start text-base sm:text-lg leading-relaxed"
                >
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <Search
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>4. Order Tracking</span>
          </h2>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 sm:p-8 lg:p-10">
            <div className="text-center">
              <Search
                className="mx-auto text-emerald-600 mb-4 sm:mb-6"
                size={40}
              />
              <h4 className="font-bold text-emerald-900 mb-3 sm:mb-4 text-lg sm:text-xl">
                Easy Order Tracking
              </h4>
              <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                You can easily track your order status directly on our website
                by visiting the Order Status page and entering your order
                details.
              </p>
              <div className="bg-white rounded-lg p-4 sm:p-6 inline-block shadow-sm">
                <p className="text-emerald-800 font-medium text-sm sm:text-base">
                  No need to wait for emails - stay updated anytime!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Incorrect Address */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <MapPin
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>5. Incorrect Address</span>
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start">
              <AlertCircle
                className="text-red-600 mr-0 sm:mr-3 mb-3 sm:mb-0 mt-1 flex-shrink-0"
                size={24}
              />
              <div className="flex-grow">
                <h4 className="font-semibold text-red-900 mb-2 sm:mb-3 text-lg">
                  Important Notice
                </h4>
                <p className="text-gray-700 mb-3 sm:mb-4 text-base sm:text-lg leading-relaxed">
                  Please ensure your shipping address is correct before placing
                  the order.
                </p>
                <p className="text-red-800 font-medium text-base sm:text-lg leading-relaxed">
                  We are not responsible for delays or lost orders due to
                  incorrect or incomplete addresses provided by the customer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Issues */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <AlertTriangle
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>6. Delivery Issues</span>
          </h2>

          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 lg:p-8">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              If your order does not arrive within the expected timeframe,
              please contact our customer support team and we'll assist you
              promptly.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <Mail size={32} className="mb-3 sm:mb-0 sm:mr-3 text-emerald-200" />
            <h3 className="text-2xl sm:text-3xl font-bold">
              Need Help with Your Order?
            </h3>
          </div>
          <p className="text-emerald-100 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
            Contact our customer support team for any shipping-related queries
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

export default ShippingPage;
