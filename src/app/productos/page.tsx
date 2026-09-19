import { listProducts } from "../../modules/products/list";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const products = await listProducts();

  const serializableProducts = products.map(
    ({ createdAt, updatedAt, ...product }) => ({
      ...product,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    }),
  );

  return (
    <ProductsClient
      initialProducts={serializableProducts}
    />
  );
}