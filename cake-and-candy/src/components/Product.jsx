import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaEdit } from "react-icons/fa";
import { PrimaryButton, EditButton } from "../components/form/Buttons";
import { updateRezept } from "../api/rezepte";

const Product = ({ product, admin = false }) => {
  const [currentImage, setCurrentImage] = useState(product.productImage);
  const [currentTitle, setCurrentTitle] = useState(product.name);
  const [currentDescription, setCurrentDescription] = useState(
    product.productDescription
  );
  const [currentPrice, setCurrentPrice] = useState(product.b2bPreis);

  useEffect(() => {
    saveProduct();
  }, [currentImage, currentTitle, currentDescription]);

  const handleEditImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setCurrentImage(newImage);
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  };

  const handleEditTitle = () => {
    const newTitle = window.prompt("Enter new title:", currentTitle);
    if (newTitle !== null) {
      setCurrentTitle(newTitle);
    }
  };

  const handleEditDescription = () => {
    const newDescription = window.prompt(
      "Neue Description eingeben",
      currentDescription
    );
    if (newDescription !== null) {
      setCurrentDescription(newDescription);
    }
  };

  const saveProduct = async () => {
    const updatedProduct = {
      ...product,
      productImage: currentImage,
      name: currentTitle,
      productDescription: currentDescription,
      b2bPreis: currentPrice,
    };

    try {
      await updateRezept(updatedProduct);
    } catch (error) {
      alert("Fehler beim speichern", error);
    }
  };

  return (
    <div className="bg-teal-900/70 text-amber-100 w-sm rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        {currentImage ? (
          <img className="w-full" src={currentImage} alt={currentTitle} />
        ) : (
          <div className="w-full h-48 bg-white"></div>
        )}
        {admin && (
          <EditButton
            className="absolute top-2 right-2"
            onClick={handleEditImage}
          >
            <FaEdit />
          </EditButton>
        )}
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 flex justify-between items-center">
          {currentTitle}
          {admin && (
            <EditButton onClick={handleEditTitle}>
              <FaEdit />
            </EditButton>
          )}
        </div>
        <p className="text-base flex justify-between items-center">
          {currentDescription}
          {admin && (
            <EditButton onClick={handleEditDescription}>
              <FaEdit />
            </EditButton>
          )}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2 flex justify-end items-center">
        <PrimaryButton>
          <div className="flex items-center">
            <FaShoppingCart className="mr-2" /> ${currentPrice?.toFixed(2)}
          </div>
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Product;
