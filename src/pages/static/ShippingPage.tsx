import React from 'react';
import { 
  Truck, 
  Package, 
  Clock, 
  MapPin, 
  Search, 
  AlertCircle, 
  Mail,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

const ShippingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Truck size={48} className="mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Shipping Information</h1>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            We strive to deliver your football jerseys quickly and safely to your doorstep.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            At Clover Arena, we are committed to getting your favorite football jerseys to you as 
            quickly and safely as possible. Here's everything you need to know about our shipping process.
          </p>
        </div>

        {/* Processing Time */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Clock className="mr-3 text-emerald-600" size={28} />
            1. Processing Time
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 rounded-lg p-6">
              <h4 className="font-semibold text-emerald-900 mb-3">Standard Processing</h4>
              <p className="text-gray-700">Orders are typically processed within 1–2 business days after payment confirmation.</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="font-semibold text-orange-900 mb-3">High-Demand Periods</h4>
              <p className="text-gray-700">During busy seasons, processing may take a little longer than usual.</p>
            </div>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Package className="mr-3 text-emerald-600" size={28} />
            2. Shipping Methods & Delivery Time
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Nationwide Delivery</p>
                <p className="text-gray-700">We offer reliable shipping across India</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Standard Delivery</p>
                <p className="text-gray-700">Usually takes 3–7 business days, depending on your location</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Remote Areas</p>
                <p className="text-gray-700">In some cases, remote areas may take up to 10 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Charges */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <CreditCard className="mr-3 text-emerald-600" size={28} />
            3. Shipping Charges
          </h2>
          
          <div className="bg-emerald-50 rounded-lg p-6">
            <div className="space-y-3">
              <p className="text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                Shipping charges are calculated at checkout based on your location and order size
              </p>
              <p className="text-gray-700 flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                Free shipping promotions may apply on qualifying orders
              </p>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Search className="mr-3 text-emerald-600" size={28} />
            4. Order Tracking
          </h2>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6">
            <div className="text-center">
              <Search className="mx-auto text-emerald-600 mb-4" size={40} />
              <h4 className="font-bold text-emerald-900 mb-3">Easy Order Tracking</h4>
              <p className="text-gray-700 mb-4">
                You can easily track your order status directly on our website by visiting the Order Status page 
                and entering your order details.
              </p>
              <div className="bg-white rounded-lg p-4 inline-block">
                <p className="text-emerald-800 font-medium">
                  No need to wait for emails – stay updated anytime!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Incorrect Address */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <MapPin className="mr-3 text-emerald-600" size={28} />
            5. Incorrect Address
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="text-red-600 mr-3 mt-1" size={24} />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Important Notice</h4>
                <p className="text-gray-700 mb-3">
                  Please ensure your shipping address is correct before placing the order.
                </p>
                <p className="text-red-800 font-medium">
                  We are not responsible for delays or lost orders due to incorrect or incomplete 
                  addresses provided by the customer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Issues */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <AlertTriangle className="mr-3 text-emerald-600" size={28} />
            6. Delivery Issues
          </h2>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              If your order does not arrive within the expected timeframe, please contact our customer 
              support team and we'll assist you promptly.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-emerald-600 text-white rounded-xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Mail size={32} className="mr-3" />
            <h3 className="text-2xl font-bold">Need Help with Your Order?</h3>
          </div>
          <p className="text-emerald-100 mb-6">
            Contact our customer support team for any shipping-related queries
          </p>
          <div className="bg-white/10 rounded-lg p-4 inline-block">
            <p className="text-emerald-100">
              <strong>Email:</strong> cloverarena.cs@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;