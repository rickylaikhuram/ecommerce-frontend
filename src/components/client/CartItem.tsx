// components/CartItem.tsx
import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: any;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (item: any) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="md:col-span-5">
          <div className="flex items-start sm:items-center gap-4">
            <img 
              src={item.image || '/placeholder.png'} 
              alt={item.name || 'Product'} 
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-medium text-gray-800 truncate">{item.name || 'Product Name'}</h3>
              <p className="text-sm text-gray-500 mt-1">Stock: {item.stockName}</p>
            </div>
          </div>
        </div>

        {/* Mobile: Quantity and Price Row */}
        <div className="md:hidden flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-medium text-gray-700">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold text-gray-800">
              ${((item.price || 0) * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Desktop: Quantity Controls */}
        <div className="hidden md:col-span-2 md:flex items-center justify-center gap-3">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center font-medium text-gray-700">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Desktop: Price */}
        <div className="hidden md:col-span-2 md:block text-center">
          <span className="font-medium text-gray-700">
            ${(item.price || 0).toFixed(2)}
          </span>
        </div>

        {/* Desktop: Total */}
        <div className="hidden md:col-span-2 md:block text-center">
          <span className="font-medium text-gray-800">
            ${((item.price || 0) * item.quantity).toFixed(2)}
          </span>
        </div>

        {/* Remove Button */}
        <div className="md:col-span-1 absolute top-4 right-4 md:relative md:top-0 md:right-0 md:flex md:justify-end">
          <button
            onClick={() => onRemove(item)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;