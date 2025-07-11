// components/sections/CategoryShowcase.tsx
import { useState, useEffect } from 'react';

type Category = {
  id: string;
  name: string;
  imageUrl: string;
  teamColor: string;
  itemCount?: number;
};

const CategoryShowcase = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulating backend fetch - replace with actual API call
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Replace this with your actual backend API endpoint
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        
        // Mock data for football jerseys
        const mockData: Category[] = [
          {
            id: '1',
            name: 'Manchester United',
            imageUrl: 'https://images.unsplash.com/photo-1557778358-9fb87328a7db?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            teamColor: '#DA291C',
          },
          {
            id: '2',
            name: 'Real Madrid',
            imageUrl: 'https://i.pinimg.com/736x/6e/6e/ea/6e6eea736d90f505c04b49ed1bb3cde5.jpg',
            teamColor: '#FEBE10',
          },
          {
            id: '3',
            name: 'Barcelona',
            imageUrl: 'https://i.pinimg.com/736x/38/81/b8/3881b8768bcb70aa0e2222228b619cb3.jpg',
            teamColor: '#A50044',
          },
          {
            id: '4',
            name: 'Bayern Munich',
            imageUrl: 'https://i.pinimg.com/1200x/7a/f0/57/7af0574b2c3ad619a2d8921878a4d402.jpg',
            teamColor: '#DC052D',
          },
          {
            id: '5',
            name: 'Liverpool',
            imageUrl: 'https://i.pinimg.com/736x/86/a7/08/86a7085581395cc0685ac8304e6701e4.jpg',
            teamColor: '#C8102E',
          },
          {
            id: '6',
            name: 'Chelsea',
            imageUrl: 'https://i.pinimg.com/736x/ac/4a/ce/ac4ace2a9a1c7329c464ac83bfe3e30b.jpg',
            teamColor: '#034694',
          }
        ];

        // Simulate loading delay
        setTimeout(() => {
          setCategories(mockData);
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shop by Club</h2>
            <p className="text-gray-600">Loading clubs...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded mt-4 w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shop by Club
          </h2>
          <p className="text-gray-600 text-lg">
            Authentic jerseys from your favorite football clubs
          </p>
        </div>

        {/* Category Grid - Mobile horizontal scroll */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex space-x-8 w-max">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-110 flex-shrink-0"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                  opacity: 0
                }}
              >
                {/* Circular Image Container */}
                <div className="relative">
                  {/* Colored Ring */}
                  <div 
                    className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
                    style={{ backgroundColor: category.teamColor }}
                  />
                  
                  {/* Image Container */}
                  <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-4 transition-all duration-300"
                      style={{ '--ring-color': category.teamColor } as any}>
                    <img
                      src={category.imageUrl}
                      alt={`${category.name} Jersey`}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback image if loading fails
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=${category.name.charAt(0)}`;
                      }}
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>

                  {/* Badge */}
                  {category.itemCount && (
                    <div 
                      className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                      style={{ backgroundColor: category.teamColor }}
                    >
                      {category.itemCount}
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Collection →
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Grid - Desktop */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-110"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                opacity: 0
              }}
            >
              {/* Circular Image Container */}
              <div className="relative">
                {/* Colored Ring */}
                <div 
                  className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
                  style={{ backgroundColor: category.teamColor }}
                />
                
                {/* Image Container */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-4 transition-all duration-300"
                    style={{ '--ring-color': category.teamColor } as any}>
                  <img
                    src={category.imageUrl}
                    alt={`${category.name} Jersey`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback image if loading fails
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=${category.name.charAt(0)}`;
                    }}
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>

                {/* Badge */}
                {category.itemCount && (
                  <div 
                    className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                    style={{ backgroundColor: category.teamColor }}
                  >
                    {category.itemCount}
                  </div>
                )}
              </div>

              {/* Category Name */}
              <div className="mt-4 text-center">
                <h3 className="text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Collection →
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800">
            View All Clubs
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ring-gray-200:hover {
          ring-color: var(--ring-color);
        }
      `}</style>
    </section>
  );
};

export default CategoryShowcase;