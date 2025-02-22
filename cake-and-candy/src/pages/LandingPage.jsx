// LandingPage.js
import { useState } from "react";
import Start from "../components/Start";
import Product from "../components/Product";
import products from "../highlightProducts";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <Start></Start>
      <div
        className="flex justify-center items-center min-h-screen"
        id="target-section"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <Product
              key={index}
              image={product.image}
              title={product.title}
              description={product.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
