// LandingPage.js
import { useState, useEffect } from "react";
import Start from "../components/Start";
import Product from "../components/Product";
import { FlyInWrapper } from "../components/products/FlyInWrapper";
import { ProductCategory } from "../components/products/ProductCategory";
import { fetchHighlightProdukte } from "../api/rezepte";
import { fetchNeuEingetroffen } from "../api/rezepte";

export default function LandingPage() {
  const [highlightProducts, setHighlightProducts] = useState([]);
  const [neuEingetroffenProducts, setNeuEingetroffenProducts] = useState([]);

  // Zutaten und Rezepte aus dem Backend laden
  useEffect(() => {
    loadHighlights();
    loadNeuEingetroffen();
  }, []);

  const loadHighlights = async () => {
    try {
      const data = await fetchHighlightProdukte();
      setHighlightProducts(data);
    } catch (error) {
      console.error("Fehler beim Laden der Highlights:", error);
    }
  };

  const loadNeuEingetroffen = async () => {
    try {
      const data = await fetchNeuEingetroffen();
      setNeuEingetroffenProducts(data);
    } catch (error) {
      console.error(
        "Fehler beim Laden der Neu eingetroffenen Produkte:",
        error
      );
    }
  };

  return (
    <div>
      <Start></Start>
      <div className="text-amber-100">
        <div
          className="flex justify-center items-center min-h-screen"
          id="target-section"
        >
          <ProductCategory name="Highlights" className="z-10">
            {highlightProducts.map((product, index) => (
              <FlyInWrapper
                delay={index * 0.2}
                duration={1}
                direction="right"
                key={index}
              >
                <Product admin={false} product={product} />
              </FlyInWrapper>
            ))}
          </ProductCategory>
        </div>
        <div
          className="flex justify-center items-center min-h-screen"
          id="neu-eingetroffen"
        >
          <ProductCategory name="Neu eingetroffen" className="z-10">
            {neuEingetroffenProducts.map((product, index) => (
              <FlyInWrapper
                delay={index * 0.2}
                duration={1}
                direction="right"
                key={index}
              >
                <Product admin={false} product={product} />
              </FlyInWrapper>
            ))}
          </ProductCategory>
        </div>
      </div>
    </div>
  );
}
