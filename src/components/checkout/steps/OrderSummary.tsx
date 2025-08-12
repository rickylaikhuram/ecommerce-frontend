// components/checkout/OrderSummary.tsx
import React from "react";
import { 
  Eye, 
  Package, 
  ShoppingBag, 
  AlertTriangle, 
  Info, 
  Trash2,
} from "lucide-react";
import type { ProductResponse } from "../../../types/checkout.types";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

interface OrderSummaryProps {
  items: ProductResponse[];
  onViewDetails: () => void;
  onRemoveItem?: (cartItemId: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  onViewDetails,
  onRemoveItem,
}) => {
  const totalItems = items.reduce(
    (sum, item) => sum + item.cartDetails.quantity,
    0
  );

  const validItems = items.filter(item => item.canProceedToCheckout);
  const invalidItems = items.filter(item => !item.canProceedToCheckout);
  const hasInvalidItems = invalidItems.length > 0;

  const getItemStatusBadge = (item: ProductResponse) => {
    switch (item.statusCode) {
      case 'OUT_OF_STOCK':
        return (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Out of Stock
          </span>
        );
      case 'QUANTITY_EXCEEDED':
        return (
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Reduce Qty
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <Info className="w-3 h-3" />
            Low Stock
          </span>
        );
      default:
        return null;
    }
  };

  const getItemClasses = (item: ProductResponse) => {
    const baseClasses = "flex items-start space-x-3 py-3 px-3 rounded-lg transition-all";
    
    switch (item.statusCode) {
      case 'OUT_OF_STOCK':
        return `${baseClasses} bg-red-50 border border-red-200 opacity-75`;
      case 'QUANTITY_EXCEEDED':
        return `${baseClasses} bg-orange-50 border border-orange-200`;
      case 'LOW_STOCK':
        return `${baseClasses} bg-yellow-50 border border-yellow-200`;
      default:
        return `${baseClasses} hover:bg-gray-50`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with status indicator */}
      <div className={`px-4 py-3 ${hasInvalidItems ? 'bg-red-600' : 'bg-blue-600'} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center w-7 h-7 bg-white bg-opacity-20 text-blue-600 rounded-full text-sm font-semibold">
              3
            </span>
            <h3 className="text-sm font-medium uppercase tracking-wide">
              ORDER SUMMARY
            </h3>
            {hasInvalidItems && (
              <AlertTriangle className="w-4 h-4 text-yellow-300" />
            )}
          </div>
          <div className="flex items-center space-x-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-blue-600 font-medium text-sm px-2 py-1.5 rounded-md border border-white border-opacity-30">
            <ShoppingBag className="h-4 w-4" />
            <span className="text-sm font-medium">{totalItems} items</span>
          </div>
        </div>
      </div>

      {/* Stock validation alert */}
      {hasInvalidItems && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Action Required
              </h4>
              <p className="text-sm text-red-700 mt-1">
                {invalidItems.length} item{invalidItems.length > 1 ? 's' : ''} require{invalidItems.length === 1 ? 's' : ''} attention before checkout.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Invalid Items First */}
        {invalidItems.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Items Requiring Attention
            </h4>
            <div className="space-y-3">
              {invalidItems.map((item) => (
                <div key={item.cartDetails.cartItemId} className={getItemClasses(item)}>
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    {item.productDetails.mainImage ? (
                      <img
                        src={`${S3_BASE_URL}${item.productDetails.mainImage.imageUrl}`}
                        alt={item.productDetails.mainImage.altText || item.productDetails.name}
                        className={`w-12 h-12 object-cover rounded border ${
                          item.statusCode === 'OUT_OF_STOCK' ? 'grayscale' : ''
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-product.png";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    {item.cartDetails.quantity > 1 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                        {item.cartDetails.quantity}
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      item.statusCode === 'OUT_OF_STOCK' ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {item.productDetails.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {item.cartDetails.stockName}
                      </span>
                      {getItemStatusBadge(item)}
                    </div>
                    {/* Status message */}
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      {item.message}
                    </p>
                    {/* Stock info */}
                    {item.stockInfo && (
                      <p className="text-xs text-gray-500 mt-1">
                        Available: {item.stockInfo.availableStock} | In cart: {item.stockInfo.cartQuantity}
                      </p>
                    )}
                  </div>

                  {/* Price and Actions */}
                  <div className="text-right flex-shrink-0 flex flex-col items-end space-y-2">
                    <p className={`text-sm font-semibold ${
                      item.statusCode === 'OUT_OF_STOCK' ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}>
                      ₹{parseFloat(item.cartDetails.itemTotal.toString()).toFixed(2)}
                    </p>
                    
                    {/* Action buttons */}
                    {item.statusCode === 'OUT_OF_STOCK' && onRemoveItem && (
                      <button
                        onClick={() => onRemoveItem(item.cartDetails.cartItemId)}
                        className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Valid Items */}
        {validItems.length > 0 && (
          <div>
            {invalidItems.length > 0 && (
              <h4 className="text-sm font-medium text-green-800 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Ready for Checkout ({validItems.length} items)
              </h4>
            )}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {validItems.map((item) => {
                const discountedPrice = parseFloat(item.productDetails.discountedPrice);
                const originalPrice = parseFloat(item.productDetails.originalPrice);
                const itemTotal = parseFloat(item.cartDetails.itemTotal.toString());
                const hasDiscount = originalPrice !== discountedPrice;

                return (
                  <div key={item.cartDetails.cartItemId} className={getItemClasses(item)}>
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      {item.productDetails.mainImage ? (
                        <img
                          src={`${S3_BASE_URL}${item.productDetails.mainImage.imageUrl}`}
                          alt={item.productDetails.mainImage.altText || item.productDetails.name}
                          className="w-12 h-12 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-product.png";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      {item.cartDetails.quantity > 1 && (
                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                          {item.cartDetails.quantity}
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.productDetails.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {item.cartDetails.stockName}
                        </span>
                        {getItemStatusBadge(item)}
                        {hasDiscount && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                            {Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      {/* Low stock message */}
                      {item.statusCode === 'LOW_STOCK' && (
                        <p className="text-xs text-yellow-600 mt-1 font-medium">
                          {item.message}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{itemTotal.toFixed(2)}
                      </p>
                      {hasDiscount && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{(originalPrice * item.cartDetails.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={onViewDetails}
            className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded hover:bg-blue-50 transition-colors text-sm"
          >
            <Eye className="h-4 w-4" />
            <span>
              {hasInvalidItems 
                ? 'Go to Cart to Fix Issues' 
                : 'View Full Cart Details'
              }
            </span>
          </button>
        </div>

        {/* Summary for valid items only */}
        {hasInvalidItems && validItems.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>{validItems.length}</strong> item{validItems.length > 1 ? 's' : ''} ready for checkout
            </p>
            <p className="text-xs text-green-600 mt-1">
              Total: ₹{validItems.reduce((sum, item) => 
                sum + parseFloat(item.cartDetails.itemTotal.toString()), 0
              ).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;