// Warenkorb aus Local Storage laden
export const loadCart = async () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};
export const buyCart = async () => {
  const cart = await loadCart();
  const user = "Max Mustermann"; // Hier später den echten Benutzernamen einfügen (z. B. durch Authentifizierung)

  const response = await fetch("http://localhost:5000/api/orders/buy", {  // Route geändert
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Sendet Cookies mit der Anfrage
    body: JSON.stringify({
      user,
      products: cart.map(({ _id, name, quantity, b2cPreis }) => ({
        id: _id,
        name,
        quantity,
        price: b2cPreis,
      })),
      totalPrice: calculateTotal(cart),
    }),
  });

  if (response.ok) {
    localStorage.removeItem("cart"); // Warenkorb leeren nach Bestellung
    window.location.reload(); // Seite neu laden, um den leeren Warenkorb anzuzeigen
  }
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

//* Gesamtpreis eines einzelnen Artikels berechnen
export const calculateItemTotal = (item) => {
  return (item.b2cPreis * item.quantity).toFixed(2);
};

// Gesamtpreis berechnen
export const calculateTotal = (cart) =>
  cart
    .reduce((total, item) => total + item.b2cPreis * item.quantity, 0)
    .toFixed(2);
