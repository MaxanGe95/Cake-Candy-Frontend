// Warenkorb aus Local Storage laden
export const loadCart = async () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};

export const buyCart = async () => {
  const cart = await loadCart();

  const response = await fetch("http://localhost:5000/api/cart/buy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Sendet Cookies mit der Anfrage
    body: JSON.stringify(
      cart.map((item) => {
        return {
          id: item._id,
          name: item.name,
          quantity: item.quantity,
        };
      })
    ),
  });

  // TODO was passiert danach?
};

// Warenkorb speichern (Local Storage)
export const saveCart = async (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Produkt hinzufügen
export const addToCart = async (product) => {
  let cart = await loadCart();
  const existingItem = cart.find((item) => item._id === product._id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  await saveCart(cart);
  return cart;
};

// Produkt entfernen
export const removeFromCart = async (productId) => {
  let cart = await loadCart();
  cart = cart.filter((item) => item._id !== productId);
  await saveCart(cart);
  return cart;
};

// Produktmenge ändern
export const updateQuantity = async (productId, quantity) => {
  let cart = await loadCart();
  cart = cart.map((item) =>
    item._id === productId ? { ...item, quantity } : item
  );
  await saveCart(cart);
  return cart;
};

// Gesamtpreis berechnen
export const calculateTotal = (cart) =>
  cart
    .reduce((total, item) => total + item.b2cPreis * item.quantity, 0)
    .toFixed(2);
