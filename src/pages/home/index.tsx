// pages/index.tsx
import { Suspense, useState } from "react";
import HeroSection from "../../components/section/HeroSection";
import ProductSection from "../../components/section/ProductSection";
import Loading from "../../components/common/Loading";
import type { ProductWithDetails } from "../../types/products.types.ts";
import CategoryShowcase from '../../components/section/CategoryShowcase.tsx'
// import  {Link}  from "react-router-dom";

// Predefined product data for testing
const bestSellerProducts: ProductWithDetails[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life",
    price: 79.99,
    fakePrice: 129.99,
    images: [
      {
        id: "img1",
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        altText: "Black wireless headphones",
        isMain: true,
        position: 1,
      },
    ],
    totalSales: 2847,
    views: 15420,
    category: {
      id: "cat1",
      name: "Electronics",
    },
    productSizes: [{ stockName: "Default", stock: 45 }],
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description:
      "Track your health and fitness with heart rate monitor and GPS",
    price: 199.99,
    fakePrice: 299.99,
    images: [
      {
        id: "img2",
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        altText: "Smart watch on white background",
        isMain: true,
        position: 1,
      },
    ],
    totalSales: 1923,
    views: 12890,
    category: {
      id: "cat1",
      name: "Electronics",
    },
    productSizes: [
      { stockName: "Small", stock: 12 },
      { stockName: "Medium", stock: 23 },
      { stockName: "Large", stock: 8 },
    ],
  },
  {
    id: "3",
    name: "Premium Leather Backpack",
    description: "Handcrafted genuine leather backpack with laptop compartment",
    price: 149.99,
    fakePrice: 249.99,
    images: [
      {
        id: "img3",
        imageUrl:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop",
        altText: "Brown leather backpack",
        isMain: true,
        position: 1,
      },
    ],
    totalSales: 892,
    views: 7234,
    category: {
      id: "cat2",
      name: "Bags & Accessories",
    },
    productSizes: [{ stockName: "Default", stock: 18 }],
  },
  {
    id: "4",
    name: "Minimalist Desk Lamp",
    description:
      "Modern LED desk lamp with adjustable brightness and color temperature",
    price: 59.99,
    fakePrice: 89.99,
    images: [
      {
        id: "img4",
        imageUrl:
          "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&h=500&fit=crop",
        altText: "White minimalist desk lamp",
        isMain: true,
        position: 1,
      },
    ],
    totalSales: 1456,
    views: 9876,
    category: {
      id: "cat3",
      name: "Home & Living",
    },
    productSizes: [
      { stockName: "White", stock: 34 },
      { stockName: "Black", stock: 28 },
    ],
  },
  {
    id: "5",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt",
    price: 29.99,
    fakePrice: 49.99,
    images: [
      {
        id: "img5",
        imageUrl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        altText: "White cotton t-shirt",
        isMain: true,
        position: 1,
      },
    ],
    totalSales: 3214,
    views: 18943,
    category: {
      id: "cat4",
      name: "Clothing",
    },
    productSizes: [
      { stockName: "S", stock: 0 },
      { stockName: "M", stock: 45 },
      { stockName: "L", stock: 32 },
      { stockName: "XL", stock: 21 },
    ],
  },
  {
    id: "6",
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handmade ceramic coffee mugs in pastel colors",
    price: 39.99,
    fakePrice: 59.99,
    images: [
      {
        id: "img6",
        imageUrl:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop",
        altText: "Ceramic coffee mugs",
        isMain: true,
        position: 1,
      },
    ],
    totalSales: 1789,
    views: 11234,
    category: {
      id: "cat3",
      name: "Home & Living",
    },
    productSizes: [{ stockName: "Set of 4", stock: 23 }],
  },
  {
    id: "7",
    name: "Wireless Charging Pad",
    description:
      "Fast wireless charging pad compatible with all Qi-enabled devices",
    price: 34.99,
    fakePrice: 54.99,
    images: [
      {
        id: "img7",
        imageUrl:
          "https://images.unsplash.com/photo-1591290619762-06612ee98f87?w=500&h=500&fit=crop",
        altText: "Wireless charging pad",
        isMain: true,
        position: 1,
      },
    ],
    totalSales: 2103,
    views: 13456,
    category: {
      id: "cat1",
      name: "Electronics",
    },
    productSizes: [{ stockName: "Default", stock: 67 }],
  },
  {
    id: "8",
    name: "Bamboo Sunglasses",
    description: "Eco-friendly bamboo frame sunglasses with UV400 protection",
    price: 49.99,
    fakePrice: 89.99,
    images: [
      {
        id: "img8",
        imageUrl:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
        altText: "Bamboo sunglasses",
        isMain: true,
        position: 1,
      },
    ],
    totalSales: 967,
    views: 6789,
    category: {
      id: "cat2",
      name: "Bags & Accessories",
    },
    productSizes: [{ stockName: "Default", stock: 0 }],
  },
];

// Create different product arrays for different sections
const newArrivalProducts = bestSellerProducts.slice(0, 5).reverse(); // Last 5 products as new arrivals
const featuredProducts = bestSellerProducts.filter(
  (p) => parseFloat(p.fakePrice.toString()) > 100
); // Products with higher original price
const onSaleProducts = bestSellerProducts.filter((p) => {
  const price = parseFloat(p.price.toString());
  const fakePrice = parseFloat(p.fakePrice.toString());
  return (fakePrice - price) / fakePrice > 0.3; // More than 30% discount
});

const Home = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductClick = (productId: string) => {
    // Handle navigation to product detail page
    console.log("Navigating to product:", productId);
    // In a real app with React Router:
    // navigate(`/products/${productId}`);
  };

  return (
    <main className="flex flex-col">
      {/* <Link to="/location" className="text-sm text-gray-600 hover:text-blue-600">
  Change Delivery Location
</Link> */}
      <HeroSection />

      {/* New Arrivals Section */}
      <Suspense fallback={<Loading />}>
        <ProductSection
          title="New Arrivals"
          products={newArrivalProducts}
          onToggleWishlist={handleToggleWishlist}
          wishlistedItems={wishlist}
          onProductClick={handleProductClick}
          sectionClassName="bg-gray-50"
        />
      </Suspense>

      <CategoryShowcase/>

      {/* Best Sellers Section */}
      <Suspense fallback={<Loading />}>
        <ProductSection
          title="Best Sellers"
          products={bestSellerProducts}
          onToggleWishlist={handleToggleWishlist}
          wishlistedItems={wishlist}
          onProductClick={handleProductClick}
          autoScroll={true}
          autoScrollInterval={5000}
        />
      </Suspense>

      <CategoryShowcase/>

      {/* On Sale Section */}
      <Suspense fallback={<Loading />}>
        <ProductSection
          title="Hot Deals 🔥"
          products={onSaleProducts}
          onToggleWishlist={handleToggleWishlist}
          wishlistedItems={wishlist}
          onProductClick={handleProductClick}
          sectionClassName="bg-red-50"
          autoScroll={true}
          autoScrollInterval={4000}
        />
      </Suspense>

      {/* Featured Products Section */}
      <Suspense fallback={<Loading />}>
        <ProductSection
          title="Featured Products"
          products={featuredProducts}
          onToggleWishlist={handleToggleWishlist}
          wishlistedItems={wishlist}
          onProductClick={handleProductClick}
          sectionClassName="bg-gradient-to-r from-blue-50 to-purple-50"
          containerClassName="container mx-auto px-4 py-12"
        />
      </Suspense>

      {/* Categories Section - Electronics Only */}
      <Suspense fallback={<Loading />}>
        <ProductSection
          title="Electronics"
          products={bestSellerProducts.filter(
            (p) => p.category?.name === "Electronics"
          )}
          onToggleWishlist={handleToggleWishlist}
          wishlistedItems={wishlist}
          onProductClick={handleProductClick}
          showNavigation={false}
        />
      </Suspense>

      {/* You might also like Section */}
      <Suspense fallback={<Loading />}>
        <ProductSection
          title="You Might Also Like"
          products={bestSellerProducts.slice(2, 7)}
          onToggleWishlist={handleToggleWishlist}
          wishlistedItems={wishlist}
          onProductClick={handleProductClick}
          sectionClassName="border-t border-gray-200"
          containerClassName="container mx-auto px-4 py-8 mt-8"
        />
      </Suspense>
    </main>
  );
};

export default Home;
