import Product from "../components/Product";
import { useEffect, useState } from "react";
import { fetchEndProdukte, fetchCategories } from "../api/rezepte";
import { PrimaryButton } from "../components/form/Buttons";
import { CategorySelection } from "../components/products/CategorySelection";
import muffin from "../assets/muffin.jpg";

function Endproducts() {
  const [endproducts, setEndproducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories2 = [
    {
      name: "Kategorie 1",
      image: muffin,
    },
    {
      name: "Kategorie 2",
      image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5",
    },
    {
      name: "Kategorie 3",
      image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5",
    },
    {
      name: "Kategorie 4",
      image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5",
    },
    {
      name: "Kategorie 5",
      image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5",
    },
    {
      name: "Kategorie 6",
      image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5",
    },
    {
      name: "Kategorie 7",
      image: "https://images.unsplash.com/photo-1583338917451-face2751d8d5",
    },
  ];

  // Zutaten und Rezepte aus dem Backend laden
  useEffect(() => {
    loadCategories();
    loadRezepte("Pralinen");
  }, []);

  const loadRezepte = async (category) => {
    try {
      const data = await fetchEndProdukte(category);
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

  return (
    <div className="container mx-auto h-full">
      {selectedCategory ? (
        <div>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300"
            onClick={() => setSelectedCategory(null)}
          >
            Zurück
          </button>
          <div className="flex justify-center items-center min-h-screen ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {endproducts.map((product, index) => (
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
      ) : (
          <div>
            <CategorySelection
              categories={categories2}
              onCategorySelect={setSelectedCategory}
            />
          </div>
      )}
    </div>
  );
}

export default Endproducts;
