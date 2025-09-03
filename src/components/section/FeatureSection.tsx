import { Shield, Truck, HeartHandshake, Star } from "lucide-react";

 const FeatureSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your privacy and security are our top priorities",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over ₹50",
    },
    {
      icon: HeartHandshake,
      title: "24/7 Support",
      description: "Customer service when you need it",
    },
    {
      icon: Star,
      title: "Quality Guaranteed",
      description: "30-day money-back guarantee",
    },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Why Choose Our Shop?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We're committed to providing the best shopping experience possible
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="w-full sm:w-[45%] lg:w-[22%] px-4">
                <div className="flex flex-row sm:flex-col items-center sm:items-center text-left sm:text-center group gap-4 sm:gap-0">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors shrink-0">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default FeatureSection
