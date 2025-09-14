import React from 'react';
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
  Search
} from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText size={48} className="mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Welcome to Clover Arena. By using our website and services, you agree to these terms and conditions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            By placing an order with Clover Arena, you agree to comply with our terms of service. 
            Please read these terms carefully before using our website and services.
          </p>
        </div>

        {/* General */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Shield className="mr-3 text-emerald-600" size={28} />
            1. General
          </h2>
          
          <div className="bg-emerald-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              Clover Arena provides football jerseys and related products for purchase online. 
              By placing an order, you agree to comply with our terms of service.
            </p>
          </div>
        </div>

        {/* Order and Payment */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <CreditCard className="mr-3 text-emerald-600" size={28} />
            2. Order and Payment
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">All orders are subject to product availability</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Prices are as listed and may change without prior notice</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Payment must be completed at checkout through our secure payment system</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">We accept major payment methods (credit/debit cards, UPI, COD, etc.)</p>
            </div>
          </div>
        </div>

        {/* Shipping and Delivery */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Truck className="mr-3 text-emerald-600" size={28} />
            3. Shipping and Delivery
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <Clock className="mx-auto text-emerald-600 mb-3" size={32} />
              <h4 className="font-semibold text-emerald-900 mb-2">Fast Delivery</h4>
              <p className="text-gray-700 text-sm">We aim to deliver your order as quickly as possible</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <MapPin className="mx-auto text-emerald-600 mb-3" size={32} />
              <h4 className="font-semibold text-emerald-900 mb-2">Location Based</h4>
              <p className="text-gray-700 text-sm">Delivery times may vary depending on your location</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <Search className="mx-auto text-emerald-600 mb-3" size={32} />
              <h4 className="font-semibold text-emerald-900 mb-2">Tracking</h4>
              <p className="text-gray-700 text-sm">Tracking information provided where applicable</p>
            </div>
          </div>
        </div>

        {/* Returns and Refunds */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <RotateCcw className="mr-3 text-emerald-600" size={28} />
            4. Returns and Refunds
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center">
              <Clock className="mr-2" size={20} />
              7-Day Return Guarantee
            </h4>
            <p className="text-gray-700">We offer a 7-day return guarantee starting from the delivery date.</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Products must be returned in original condition, unworn, unwashed, and with tags attached</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">To initiate a return, contact our customer support within 7 days of delivery</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Refunds or exchanges will be processed after we receive and inspect the returned product</p>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Users className="mr-3 text-emerald-600" size={28} />
            5. User Responsibilities
          </h2>
          
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-gray-700">You agree to provide accurate and complete information when placing an order.</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-gray-700">You are responsible for keeping your account login details secure.</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-gray-700">
                Any misuse of the website, fraudulent orders, or violation of these terms may result in 
                cancellation of orders or suspension of service.
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Copyright className="mr-3 text-emerald-600" size={28} />
            6. Intellectual Property
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              All content on the Clover Arena website, including logos, text, images, and designs, is owned by 
              Clover Arena and protected by copyright laws. You may not use any content without our explicit permission.
            </p>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <AlertTriangle className="mr-3 text-emerald-600" size={28} />
            7. Limitation of Liability
          </h2>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              Clover Arena is not liable for any indirect, incidental, or consequential damages arising from 
              the use of our website or products. We strive for accuracy but cannot guarantee that product 
              descriptions or images are error-free.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Edit className="mr-3 text-emerald-600" size={28} />
            8. Changes to Terms
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            We may update these Terms of Service at any time. Any changes will be posted on this page 
            with the updated date.
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-600 text-sm">
              <strong>Last Updated:</strong> September 2025
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-emerald-600 text-white rounded-xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Mail size={32} className="mr-3" />
            <h3 className="text-2xl font-bold">Questions About Our Terms?</h3>
          </div>
          <p className="text-emerald-100 mb-6">
            For any questions regarding our terms of service, feel free to contact us
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

export default TermsPage;