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
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [isProcessing, setIsProcessing] = useState(false); // Disable button during process

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
    setIsProcessing(true); // Start processing

    // API call to submit the cart
    await buyCart(cart);
    setConfirmationMessage("Bestellung erfolgreich aufgegeben!");
    setShowModal(true); // Show confirmation modal

    // Wait for 2 seconds before clearing the cart and hiding the modal
    setTimeout(() => {
      setCart([]); // Clear the cart after 2 seconds
    }, 2000); // Adjust delay (2 seconds)
  };

  return (
    <div className="mt-9 p-4 bg-gray-800/60 text-amber-100 rounded-md container mx-auto">
      <h2 className="text-4xl font-bold mb-4 text-center">🛒 Warenkorb</h2>

      {cart.length === 0 && !showModal ? (
        <p>Dein Warenkorb ist leer.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b mb-2 hover:bg-[#7ec6cc80] transition duration-200 rounded-2xl"
            >
              <img
                src={rezeptImage(item)}
                className="w-32 h-32 object-cover rounded-2xl"
              />
              <div className="flex-1 ml-4">
                <p className="font-bold text-2xl text-white">{item.name}</p>
                <p className="text-right mr-5 text-sm">
                  Stück: ${item.b2cPreis?.toFixed(2)}
                </p>
                <p className="text-right text-white mr-5 font-semibold">
                  Gesamt: ${calculateItemTotal(item)}
                </p>
              </div>
              <div className="flex items-center mt-8">
                <InputNumber
                  value={item.quantity}
                  min="1"
                  className="w-20"
                  onChange={(e) => handleQuantityChange(item._id, parseInt(e))}
                />
                <DeleteButton onClick={() => handleRemove(item._id)} />
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <p className="mt-4 font-bold text-white text-xl">
              Gesamt: ${calculateTotal(cart)}
            </p>
            <PrimaryButton
              className="ml-6 mr-10 mt-2 relative group transform transition-all duration-300 hover:scale-105"
              onClick={handleBuyCart}
              disabled={isProcessing} // Disable button during processing
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">Bestellen</span>
                <span className=" opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  🛒
                </span>
              </span>
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* ✅ MODAL - Display when showModal is true */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">🎉 Bestellung erfolgreich</h3>
            <p>{confirmationMessage}</p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)} // Close modal manually
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
