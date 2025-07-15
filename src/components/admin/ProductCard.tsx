// components/admin/AdminProductCard.tsx
import React, { useState } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

interface AdminProductCardProps {
  product: any; // You can replace with your Product type
  onEdit: (product: any) => void;
  onView: (product: any) => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (productId: string) => void;
}

const AdminProductCard: React.FC<AdminProductCardProps> = ({
  product,
  onEdit,
  onView,
  onDelete,
  onToggleStatus,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get main image or fallback
  const mainImage = product.image || product.images?.[0]?.imageUrl;

  return (
    <div
      className="relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge variant={product.status === 'active' ? 'success' : 'default'}>
          {product.status}
        </Badge>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100 flex-shrink-0">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No image
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <>
            <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
            <div className="absolute bottom-2 left-2 z-20 bg-red-700 bg-opacity-90 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
              Out of Stock
            </div>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <div className="h-4 mb-1">
          <p className="text-xs text-gray-500 truncate">{product.category}</p>
        </div>

        {/* Product Name */}
        <div className="h-12 mb-2">
          <h3 className="font-semibold text-base text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Product Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Price:</span>
            <p className="font-semibold">${product.price}</p>
          </div>
          <div>
            <span className="text-gray-500">Stock:</span>
            <p className={`font-semibold ${product.stock === 0 ? 'text-red-500' : 'text-gray-900'}`}>
              {product.stock}
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">SKU:</span>
            <p className="font-semibold text-xs">{product.sku}</p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(product)}
            className="w-full"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(product)}
            className="w-full"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(product.id)}
            className="w-full text-xs"
          >
            {product.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;