import { RotateCcw, Clock, CheckCircle, Phone, Shield } from "lucide-react";

const ReturnPolicyPage = () => {
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
            <RotateCcw
              size={40}
              className="mb-3 sm:mb-0 sm:mr-4 text-emerald-200"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Return Policy
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed px-4">
            Your satisfaction is our top priority. Easy returns within 7 days.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-center mb-8 sm:mb-12 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <Shield
              size={40}
              className="mb-3 sm:mb-0 sm:mr-3 text-emerald-200"
            />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              7-Day Return Guarantee
            </h2>
          </div>
          <p className="text-emerald-100 text-base sm:text-lg lg:text-xl leading-relaxed">
            Complete satisfaction guaranteed from the date of delivery
          </p>
        </div>

        {/* Main Policy Text */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">
            <p>
              At Clover Arena, we want you to be completely satisfied with your
              purchase. That's why we offer a
              <strong className="text-emerald-700">
                {" "}
                7-day return guarantee
              </strong>{" "}
              from the date of delivery. If for any reason you are not happy
              with your football jersey, you can return it within 7 days in its
              original condition and packaging for a full refund or exchange.
            </p>

            <p>
              Simply contact our customer support team to initiate the return
              process, and we'll guide you every step of the way. Please ensure
              the product is unworn, unwashed, and with all tags intact.
            </p>

            <p>
              Our goal is to make your shopping experience smooth, safe, and
              worry-free. Your satisfaction is our top priority.
            </p>
          </div>
        </div>

        {/* Return Requirements */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <CheckCircle
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>Return Requirements</span>
          </h3>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 lg:p-8">
              <h4 className="font-semibold text-emerald-900 mb-3 sm:mb-4 text-lg sm:text-xl">
                Product Condition
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-700 text-base sm:text-lg">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3 flex-shrink-0"></div>
                  Must be unworn and unwashed
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3 flex-shrink-0"></div>
                  All original tags must be intact
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3 flex-shrink-0"></div>
                  Original packaging required
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 lg:p-8">
              <h4 className="font-semibold text-emerald-900 mb-3 sm:mb-4 text-lg sm:text-xl">
                Process
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-700 text-base sm:text-lg">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3 flex-shrink-0"></div>
                  Contact support within 7 days
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3 flex-shrink-0"></div>
                  Follow guided return process
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3 flex-shrink-0"></div>
                  Full refund or exchange available
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center">
            <Clock
              className="mr-0 sm:mr-3 mb-3 sm:mb-0 text-emerald-600"
              size={32}
            />
            <span>How to Return Your Item</span>
          </h3>

          <div className="space-y-6 sm:space-y-8">
            {[
              {
                step: 1,
                title: "Contact Customer Support",
                description:
                  "Reach out to our customer support team within 7 days of delivery to initiate the return process.",
              },
              {
                step: 2,
                title: "Prepare Your Item",
                description:
                  "Ensure the jersey is in original condition with all tags attached and in original packaging.",
              },
              {
                step: 3,
                title: "Ship & Get Refund",
                description:
                  "Follow our guided instructions to ship the item back. Once received and inspected, we'll process your refund or exchange.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col sm:flex-row items-start"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mr-0 sm:mr-4 mb-3 sm:mb-0 flex-shrink-0 text-sm sm:text-base">
                  {item.step}
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg sm:text-xl">
                    {item.title}
                  </h4>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <Phone
              size={32}
              className="mb-3 sm:mb-0 sm:mr-3 text-emerald-200"
            />
            <h3 className="text-2xl sm:text-3xl font-bold">
              Need Help with Returns?
            </h3>
          </div>
          <p className="text-emerald-100 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
            Our customer support team is here to guide you through every step of
            the return process.
          </p>
          <button className="bg-white text-emerald-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-emerald-50 transition-colors duration-300 text-base sm:text-lg shadow-md hover:shadow-lg">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
