// components/sections/ProductSection.tsx
import React from "react";
import ProductCarousel from "../products/ProductCarousel";
import type { Product } from "../../types/products.types";

interface ProductSectionProps {
  title: string;
  products: Product[];
  onProductClick: (productId: string) => void;
  sectionClassName?: string;
  containerClassName?: string;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showNavigation?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({ 
  title,
  products,
  onProductClick,
  sectionClassName = "",
  containerClassName = "container mx-auto px-4 py-8",
  autoScroll = false,
  autoScrollInterval = 5000,
  showNavigation = true
}) => {
  return (
    <section className={sectionClassName}>
      <div className={containerClassName}>
        <ProductCarousel
          title={title}
          products={products}
          onProductClick={onProductClick}
          autoScroll={autoScroll}
          autoScrollInterval={autoScrollInterval}
          showNavigation={showNavigation}
        />
      </div>
    </section>
  );
};

export default ProductSection;