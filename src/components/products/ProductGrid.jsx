import ProductCard from "./ProductCard";
export default function ProductGrid({ products = [] }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
