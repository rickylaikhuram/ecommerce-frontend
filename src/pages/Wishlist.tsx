// // src/pages/Wishlist.tsx
// import { FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// // Reuse the Product type from your existing code
// type Product = {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   rating: number;
//   image: string;
// };

// interface WishlistProps {
//   wishlist: Product[];
//   removeFromWishlist: (productId: number) => void;
// }

// const Wishlist = ({ wishlist, removeFromWishlist }: WishlistProps) => {
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//       {/* Page Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
//           Your Wishlist
//         </h1>
//         <div className="flex items-center space-x-4">
//           <span className="text-gray-600">
//             {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
//           </span>
//           <Link
//             to="/"
//             className="text-orange-500 hover:text-orange-600 font-medium"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>

//       {/* Wishlist Items */}
//       {wishlist.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
//             <FaHeart className="w-full h-full" />
//           </div>
//           <h3 className="text-xl font-medium text-gray-900 mb-2">
//             Your wishlist is empty
//           </h3>
//           <p className="text-gray-600 mb-6">
//             Save your favorite items here to view them later
//           </p>
//           <Link
//             to="/"
//             className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
//           >
//             Browse Products
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {wishlist.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//             >
//               <div className="relative pb-[120%] overflow-hidden">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="absolute top-0 left-0 w-full h-full object-cover"
//                 />
//                 <button
//                   onClick={() => removeFromWishlist(product.id)}
//                   className="absolute top-3 right-3 text-red-500 hover:text-red-700"
//                   aria-label="Remove from wishlist"
//                 >
//                   <FaHeart className="text-xl fill-current" />
//                 </button>
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-1">
//                   {product.name}
//                 </h3>
//                 <div className="flex items-center mb-2">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar
//                       key={i}
//                       className={`text-sm ${
//                         i < Math.floor(product.rating)
//                           ? 'text-yellow-400'
//                           : 'text-gray-300'
//                       }`}
//                     />
//                   ))}
//                   <span className="text-gray-500 text-sm ml-1">
//                     ({product.rating})
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="text-lg font-bold text-gray-900">
//                       ${product.price.toFixed(2)}
//                     </span>
//                     {product.originalPrice && (
//                       <span className="text-sm text-gray-500 line-through ml-2">
//                         ${product.originalPrice.toFixed(2)}
//                       </span>
//                     )}
//                   </div>
//                   <button className="text-gray-700 hover:text-orange-500">
//                     <FaShoppingCart className="text-xl" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Wishlist;





import { FaHeart, FaTrash, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
};

interface WishlistProps {
  wishlist: Product[];
  removeFromWishlist: (productId: number) => void;
  addToCart: (product: Product) => void;
}

const Wishlist = ({
  wishlist,
  removeFromWishlist,
  addToCart,
}: WishlistProps) => {
  return (
    <div className="w-screen min-h-screen bg-white text-gray-800 overflow-x-hidden">
      <div className="relative px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              to="/"
              className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Home
            </Link>
            <svg
              className="w-3 h-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-500 font-semibold">Wishlist</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Saved Items <span className="ml-2 text-orange-500">({wishlist.length})</span>
          </h1>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="mx-auto w-20 h-20 text-gray-300 mb-4">
              <FaHeart className="w-full h-full" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Save your favorite items by clicking the heart icon on products
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
            >
              Discover Products
            </Link>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlist.length > 0 && (
          <div className="space-y-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row"
              >
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-gray-400 hover:text-red-500 ml-4 cursor-pointer"
                      aria-label="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => addToCart(product)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <FaShoppingBag className="mr-2" />
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended Section */}
        {wishlist.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              You might also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    Recommended Item {item}
                  </h3>
                  <p className="text-sm text-gray-500">$XX.XX</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

