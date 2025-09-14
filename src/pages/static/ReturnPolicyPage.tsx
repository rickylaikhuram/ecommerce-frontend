import React from 'react';
import { RotateCcw, Clock, CheckCircle, Phone, Shield } from 'lucide-react';

const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <RotateCcw size={48} className="mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Return Policy</h1>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Your satisfaction is our top priority. Easy returns within 7 days.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Guarantee Banner */}
        <div className="bg-emerald-600 text-white rounded-2xl p-8 text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield size={40} className="mr-3" />
            <h2 className="text-3xl font-bold">7-Day Return Guarantee</h2>
          </div>
          <p className="text-emerald-100 text-lg">
            Complete satisfaction guaranteed from the date of delivery
          </p>
        </div>

        {/* Main Policy Text */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At Clover Arena, we want you to be completely satisfied with your purchase. That's why we offer a 
            <strong className="text-emerald-700"> 7-day return guarantee</strong> from the date of delivery. 
            If for any reason you are not happy with your football jersey, you can return it within 7 days 
            in its original condition and packaging for a full refund or exchange.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Simply contact our customer support team to initiate the return process, and we'll guide you 
            every step of the way. Please ensure the product is unworn, unwashed, and with all tags intact.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed">
            Our goal is to make your shopping experience smooth, safe, and worry-free. Your satisfaction 
            is our top priority.
          </p>
        </div>

        {/* Return Requirements */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <CheckCircle className="mr-3 text-emerald-600" size={28} />
            Return Requirements
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 rounded-lg p-6">
              <h4 className="font-semibold text-emerald-900 mb-3">Product Condition</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Must be unworn and unwashed
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  All original tags must be intact
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Original packaging required
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 rounded-lg p-6">
              <h4 className="font-semibold text-emerald-900 mb-3">Process</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Contact support within 7 days
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Follow guided return process
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Full refund or exchange available
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Clock className="mr-3 text-emerald-600" size={28} />
            How to Return Your Item
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Customer Support</h4>
                <p className="text-gray-700">
                  Reach out to our customer support team within 7 days of delivery to initiate the return process.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Prepare Your Item</h4>
                <p className="text-gray-700">
                  Ensure the jersey is in original condition with all tags attached and in original packaging.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ship & Get Refund</h4>
                <p className="text-gray-700">
                  Follow our guided instructions to ship the item back. Once received and inspected, we'll process your refund or exchange.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-emerald-600 text-white rounded-xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Phone size={32} className="mr-3" />
            <h3 className="text-2xl font-bold">Need Help with Returns?</h3>
          </div>
          <p className="text-emerald-100 mb-6">
            Our customer support team is here to guide you through every step of the return process.
          </p>
          <button className="bg-white text-emerald-600 font-bold py-3 px-8 rounded-lg hover:bg-emerald-50 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;