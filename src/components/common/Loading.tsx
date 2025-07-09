// components/common/Loading.tsx
import React from 'react';
import { ShoppingBag, Package, Truck } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = true, 
  message = "Loading amazing products..." 
}) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-white/95 backdrop-blur-sm z-50" 
    : "relative w-full h-full min-h-[400px]";

  return (
    <div className={`${containerClass} flex items-center justify-center`}>
      <div className="text-center">
        {/* Animated Shopping Bag */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-blue-600 animate-bounce" />
          </div>
        </div>
        
        {/* Loading message */}
        <p className="text-gray-600 text-lg font-medium mb-2">{message}</p>
        
        {/* Animated dots */}
        <div className="flex justify-center gap-1">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
};

export default Loading;