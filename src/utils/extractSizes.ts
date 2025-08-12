import type { Product } from "../types/products.types";

const extractUniqueSizes = (products: Product[]) => {
  const sizeSet = new Set<string>();

  products.forEach((product) => {
    product.productSizes.forEach((size) => {
      sizeSet.add(size.stockName);
    });
  });

  return Array.from(sizeSet);
};
export default extractUniqueSizes;
