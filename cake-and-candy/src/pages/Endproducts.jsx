import Product from "../components/Product";
import { useEffect, useState } from "react";
import { fetchEndProdukte, fetchCategories } from "../api/rezepte";
import { PrimaryButton } from "../components/form/Buttons";
import { CategorySelection } from "../components/products/CategorySelection";
import muffin from "../assets/muffin.jpg";
import ScrollToTop from "../components/ScrollToTop";

function Endproducts() {
  const [endproducts, setEndproducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const mainCategories = [
    {
      name: "Süßes",
      image: muffin,
    },
    {
      name: "Pralinen",
      image: muffin,
    },
    {
      name: "Tafeln",
      image: muffin,
    },
    {
      name: "Torten",
      image: muffin,
    },
    {
      name: "Backwaren",
      image: muffin,
    },
    {
      name: "Getränke",
      image: muffin,
    },
    {
      name: "Kooperationsprodukte",
      image: muffin,
    },
    {
      name: "Saisonprodukte",
      image: muffin,
    },
    {
      name: "Sonstiges",
      image: muffin,
    }
  ];

  // Zutaten und Rezepte aus dem Backend laden
  useEffect(() => {
    loadCategories();
    loadRezepte();
  }, []);

  const loadRezepte = async () => {
    try {
      const data = await fetchEndProdukte();
      setEndproducts(data);
    } catch (error) {
      console.error("Fehler beim Laden der Rezepte:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Fehler beim Laden der Rezepte:", error);
    }
  };

  const scrollToCategory = (category) => {
    document
      .querySelector(`#${category.name}`)
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container mx-auto">
      <div>
        <ScrollToTop />
        <div className="flex justify-center items-center min-h-screen">
          <CategorySelection
            categories={mainCategories}
            onCategorySelect={scrollToCategory}
          />
        </div>
        {mainCategories.map((category, index) => (
          <div key={index} id={category.name} className="min-h-screen">
            <h1>{category.name}</h1>
            <div className="flex justify-center items-center min-h-screen">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {endproducts
                  .filter((product) => product.category == category.name)
                  .map((product, index) => (
                    <Product
                      key={index}
                      image={product.productImage}
                      title={product.name}
                      description={product.productDescription}
                    />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Endproducts;
