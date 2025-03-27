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
              className="flex items-center justify-between border-b pb-2 mb-2"
            >
              <img
                src={rezeptImage(item)}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1 ml-4">
                <p className="font-bold">{item.name}</p>
                <p className="text-right mr-5">Stück: ${item.b2cPreis?.toFixed(2)}</p>
                <p className="text-right mr-5">Gesamt: ${calculateItemTotal(item)}</p>
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
            <PrimaryButton className="ml-6 mr-10 mt-2" onClick={buyCart}>bestellen</PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
