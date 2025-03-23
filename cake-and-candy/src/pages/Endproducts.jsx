import Product from "../components/Product";
import { useEffect, useState } from "react";
import { fetchEndProdukte, fetchCategories } from "../api/rezepte";
import { CategorySelection } from "../components/products/CategorySelection";
import { FlyInWrapper } from "../components/products/FlyInWrapper";
import { ProductCategory } from "../components/products/ProductCategory";
import { isAdmin } from "../api/auth";

import videoFile from "../assets/video2.mp4";
import "../components/products/Video.css";
import pralinen from "../assets/category/pralinen.jpg";
import sues from "../assets/category/sues.jpg";
import tafel from "../assets/category/tafel.jpg";
import torten from "../assets/category/torte.jpg";
import get from "../assets/category/get.jpg";
import backwaren from "../assets/category/backwaren.jpg";
import kooperationsprodukte from "../assets/category/kooperationsprodukte.jpg";
import saisonprodukte from "../assets/category/saisonprodukte.jpg";
import sonstiges from "../assets/category/sonstiges.jpg";
function Endproducts() {
  const [endproducts, setEndproducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const mainCategories = [
    {
      name: "Süßes",
      image: sues,
    },
    {
      name: "Pralinen",
      image: pralinen,
    },
    {
      name: "Tafeln",
      image: tafel,
    },
    {
      name: "Torten",
      image: torten,
    },
    {
      name: "Backwaren",
      image: backwaren,
    },
    {
      name: "Getränk",
      image: get,
    },
    {
      name: "Kooperationsprodukte",
      image: kooperationsprodukte,
    },
    {
      name: "Saisonprodukte",
      image: saisonprodukte,
    },
    {
      name: "Sonstiges",
      image: sonstiges,
    },
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
    <div>
      <div className="background-video-products">
        <video autoPlay loop muted>
          <source src={videoFile} type="video/mp4" />
          <source src={videoFile} type="video/ogg" />
        </video>
      </div>
      <div className="container mx-auto text-amber-100">
        <div>
          <div className="flex justify-center items-center min-h-screen">
            <CategorySelection
              categories={mainCategories}
              onCategorySelect={scrollToCategory}
            />
          </div>
          <div className="relative z-1">
            {mainCategories.map((category, index) => (
              <ProductCategory key={index} name={category.name}>
                {endproducts
                  .filter((product) => product.category == category.name)
                  .map((product, index) => (
                    <FlyInWrapper
                      delay={index * 0.2}
                      duration={1}
                      direction="right"
                      key={index}
                    >
                      <Product
                        admin={isAdmin()}
                        product={product}
                      />
                    </FlyInWrapper>
                  ))}
              </ProductCategory>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Endproducts;
