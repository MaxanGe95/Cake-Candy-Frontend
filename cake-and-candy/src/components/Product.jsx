import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaEdit } from "react-icons/fa";
import { PrimaryButton, EditButton } from "../components/form/Buttons";
import { updateRezept, uploadImage, rezeptImage } from "../api/rezepte";
import { addToCart } from "../api/cart";
import { InputString, InputTextarea } from "./form/Inputs";

const Product = ({ product, admin = false }) => {
  const [currentImage, setCurrentImage] = useState(product.productImage);
  const [currentTitle, setCurrentTitle] = useState(product.name);
  const [currentDescription, setCurrentDescription] = useState(
    product.productDescription
  );
  const [currentPrice] = useState(product.b2bPreis);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(product.name);
  const [newDescription, setNewDescription] = useState(
    product.productDescription
  );
  const [hasChanges, setHasChanges] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (hasChanges) {
      saveProduct();
      setHasChanges(false);
    }
  }, [currentImage, currentTitle, currentDescription]);

  const openDialog = () => {
    setNewTitle(currentTitle);
    setNewDescription(currentDescription);
    setDialogOpen(true);
  };

  const handleSaveDialog = () => {
    setCurrentTitle(newTitle);
    setCurrentDescription(newDescription);
    setDialogOpen(false);
    setHasChanges(true);
  };

  const handleEditImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      await uploadImage(product, file);
      // seite neu laden, damit man das Bild sieht
      location.reload();
    };
    fileInput.click();
  };

  const saveProduct = async () => {
    const updatedProduct = {
      ...product,
      name: currentTitle,
      productDescription: currentDescription,
    };

    try {
      await updateRezept(updatedProduct);
    } catch (error) {
      console.log("Fehler beim Speichern", error);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product);
    alert(`${currentTitle} wurde zum Warenkorb hinzugefügt!`);
  };

  return (
    <div className="bg-teal-900/70 text-amber-100 w-sm rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        {currentImage ? (
          <img
            className="w-full h-48 object-cover"
            src={rezeptImage(product)}
            alt={currentTitle}
          />
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
            <EditButton onClick={openDialog}>
              <FaEdit />
            </EditButton>
          )}
        </div>
        <p className="text-base flex justify-between items-center whitespace-pre-wrap">
          {currentDescription}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2 flex justify-end items-center">
        <PrimaryButton onClick={handleAddToCart}>
          <div className="flex items-center">
            <FaShoppingCart className="mr-2" /> ${currentPrice?.toFixed(2)}
          </div>
        </PrimaryButton>
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
          <div className="p-6 rounded-md shadow-lg w-96 bg-teal-900">
            <h2 className="text-lg font-bold mb-2">Produkt bearbeiten</h2>
            <InputString
              placeholder="Neuer Titel"
              value={newTitle}
              onChange={(e) => setNewTitle(e)}
            />
            <InputTextarea
              value={newDescription}
              onChange={(e) => setNewDescription(e)}
              placeholder="Neue Beschreibung"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded"
                onClick={() => setDialogOpen(false)}
              >
                Abbrechen
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleSaveDialog}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
