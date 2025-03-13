import Product from "../components/Product";
import { useEffect, useState } from "react";
import { fetchEndProdukte, fetchCategories } from "../api/rezepte";
import { CategorySelection } from "../components/products/CategorySelection";
import { FlyInWrapper } from "../components/products/FlyInWrapper";
import videoFile from "../assets/video2.mp4";
import "../components/products/Video.css";
import muffin from "../assets/muffin.jpg";
import pralinen from "../assets/category/pralinen.jpg";
import suesses from "../assets/category/suesses.jpg";
import tafel from "../assets/category/tafel.jpg";
import torten from "../assets/category/torte.jpg";
import getraenk from "../assets/category/getraenk.jpg";

function Endproducts() {
  const [endproducts, setEndproducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const mainCategories = [
    {
      name: "Süßes",
      image: suesses,
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
      image: muffin,
    },
    {
      name: "Getränke",
      image: getraenk,
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
              <div
                key={index}
                id={category.name}
                className="min-h-screen p-4 mt-8 rounded-xl"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="flex items-center justify-center">
                  <FlyInWrapper>
                    <h2 className="xl:text-3xl font-bold bg-teal-950/70 p-2 rounded-xl mb-1">
                      {category.name}
                    </h2>
                  </FlyInWrapper>
                </div>
                <div className="flex justify-center items-center min-h-screen">
                  <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
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
                            // TODO: woher weiß man das?
                            admin={true}
                            product={product}
                          />
                        </FlyInWrapper>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Endproducts;
