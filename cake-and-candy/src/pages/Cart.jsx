import React, { useState, useEffect } from "react";
import {
  loadCart,
  removeFromCart,
  updateQuantity,
  calculateTotal,
  buyCart,
  calculateItemTotal,
} from "../api/cart";
import { rezeptImage } from "../api/rezepte";
import { DeleteButton, PrimaryButton } from "../components/form/Buttons";
import { InputNumber } from "../components/form/Inputs";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState(""); // Zustand für Bestätigungsnachricht

  useEffect(() => {
    loadCart().then(setCart);
  }, []);

  const handleRemove = async (productId) => {
    const updatedCart = await removeFromCart(productId);
    setCart(updatedCart);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const updatedCart = await updateQuantity(productId, newQuantity);
    setCart(updatedCart);
  };

  const handleBuyCart = async () => {
    //* API aufrufen, um die Bestellung aufzugeben
    await buyCart(cart);
    setConfirmationMessage("Bestellung erfolgreich aufgegeben!"); //* Bestätigung setzen
    setCart([]); //* Warenkorb zurücksetzen
  };

  return (
    <div className="p-4 bg-gray-800/60 text-amber-100 rounded-md container mx-auto mt-2">
      <h2 className="text-xl font-bold mb-4">🛒 Warenkorb</h2>
      {cart.length === 0 ? (
        <p>Dein Warenkorb ist leer.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b  mb-2 hover:bg-[#7ec6cc80] transition duration-200 rounded-2xl"
            >
              <img
                src={rezeptImage(item)}
                className="w-32 h-32 object-cover rounded-2xl"
              />
              <div className="flex-1 ml-4">
                <p className="font-bold">{item.name}</p>
                <p className="text-right mr-5 text-sm">
                  Stück: ${item.b2cPreis?.toFixed(2)}
                </p>
                <p className="text-right mr-5 font-semibold">
                  Gesamt: ${calculateItemTotal(item)}
                </p>
              </div>
              <InputNumber
                value={item.quantity}
                min="1"
                className="w-20"
                onChange={(e) => handleQuantityChange(item._id, parseInt(e))}
              />
              <DeleteButton onClick={() => handleRemove(item._id)} />
            </div>
          ))}
          <div className="flex justify-end">
            <p className="mt-4 font-bold">Gesamt: ${calculateTotal(cart)}</p>
            <PrimaryButton
              className="ml-6 mr-10 mt-2 relative group transform transition-all duration-300 hover:scale-105"
              onClick={handleBuyCart}
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">bestsellen</span>
                <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  🛒
                </span>
              </span>
            </PrimaryButton>
          </div>
        </div>
      )}

      {confirmationMessage && (
        <p className="text-green-500 mt-4">{confirmationMessage}</p> // Bestätigungsnachricht anzeigen
      )}
    </div>
  );
};

export default Cart;
