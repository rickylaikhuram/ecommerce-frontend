import React from 'react';
import { Shield, Lock, Eye, UserCheck, Cookie, Mail } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield size={48} className="mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Your privacy is important to us. We are committed to protecting your personal information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            At Clover Arena, your privacy is important to us. We are committed to protecting your personal 
            information and ensuring a safe and secure shopping experience.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Eye className="mr-3 text-emerald-600" size={28} />
            1. Information We Collect
          </h2>
          
          <p className="text-gray-700 mb-6">
            When you place an order or create an account, we collect personal information such as your:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Name
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Email address
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Phone number
                </li>
              </ul>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Shipping address
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                  Payment details
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <UserCheck className="mr-3 text-emerald-600" size={28} />
            2. How We Use Your Information
          </h2>
          
          <p className="text-gray-700 mb-6">We use your information to:</p>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Process and deliver your orders</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Provide customer support</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Send important updates regarding your orders</p>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center mr-3 mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-700">Improve our services and website experience</p>
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4 mt-6">
            <p className="text-emerald-800 font-medium">
              We never share your personal information with third parties for marketing purposes.
            </p>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Lock className="mr-3 text-emerald-600" size={28} />
            3. Data Security
          </h2>
          
          <div className="bg-emerald-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">
              We use industry-standard security measures to protect your personal information during 
              transmission and storage. Your data is handled with care and stored securely.
            </p>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Shield className="mr-3 text-emerald-600" size={28} />
            4. Your Rights
          </h2>
          
          <p className="text-gray-700 mb-6">You have the right to:</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <Eye className="mx-auto text-emerald-600 mb-3" size={32} />
              <h4 className="font-semibold text-emerald-900 mb-2">Access</h4>
              <p className="text-gray-700 text-sm">Access your personal information</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <UserCheck className="mx-auto text-emerald-600 mb-3" size={32} />
              <h4 className="font-semibold text-emerald-900 mb-2">Correct</h4>
              <p className="text-gray-700 text-sm">Request corrections to your information</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <Lock className="mx-auto text-emerald-600 mb-3" size={32} />
              <h4 className="font-semibold text-emerald-900 mb-2">Delete</h4>
              <p className="text-gray-700 text-sm">Request deletion of your information</p>
            </div>
          </div>
          
          <p className="text-gray-700 mt-6">
            Simply contact our customer support if you wish to exercise any of these rights.
          </p>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Cookie className="mr-3 text-emerald-600" size={28} />
            5. Cookies
          </h2>
          
          <p className="text-gray-700 leading-relaxed">
            Our website uses cookies to improve user experience, analyze site traffic, and manage sessions. 
            You can manage your cookie preferences in your browser settings.
          </p>
        </div>

        {/* Policy Updates */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">6. Policy Updates</h2>
          
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page 
            with the updated date.
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4 mt-6">
            <p className="text-gray-600 text-sm">
              <strong>Last Updated:</strong> September 2025
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-emerald-600 text-white rounded-xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Mail size={32} className="mr-3" />
            <h3 className="text-2xl font-bold">Questions About Your Privacy?</h3>
          </div>
          <p className="text-emerald-100 mb-6">
            For any questions regarding your privacy, feel free to contact us
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

export default PrivacyPolicyPage;