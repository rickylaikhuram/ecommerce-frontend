// src/components/Product.tsx
import { FaHeart, FaStar } from "react-icons/fa";

export type ProductType = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
};

interface ProductProps {
  product: ProductType;
  isWishlisted: boolean;
  onWishlistToggle: (product: ProductType) => void;
}

const Product = ({ product, isWishlisted, onWishlistToggle }: ProductProps) => {
  return (
    <div className="min-w-[260px] bg-white rounded-xl shadow hover:shadow-lg transition-all">
      <div className="relative pb-[120%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
        />
        <button
          onClick={() => onWishlistToggle(product)}
          className="absolute top-3 right-3"
        >
          <FaHeart
            className={`text-xl ${
              isWishlisted ? "text-red-500" : "text-gray-300"
            }`}
          />
        </button>
      </div>
      <div className="p-4 flex flex-col justify-between h-[180px]">
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-xs ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.rating})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <button className="mt-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm font-medium w-full">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Product;
