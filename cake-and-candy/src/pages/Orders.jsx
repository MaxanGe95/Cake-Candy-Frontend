import React, { useState } from "react";
import OrderList from "../components/Orders/OrderList.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      date: "2025-10-01",
      customerId: "C123",
      product: "Produkt A",
      quantity: 2,
    },
    {
      date: "2025-10-02",
      customerId: "C124",
      product: "Produkt B",
      quantity: 1,
    },
    {
      date: "2025-10-03",
      customerId: "C125",
      product: "Produkt C",
      quantity: 5,
    },
  ]);

  const [newOrder, setNewOrder] = useState({
    date: "",
    customerId: "",
    product: "",
    quantity: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrders((prev) => [...prev, newOrder]);
    setNewOrder({ date: "", customerId: "", product: "", quantity: 1 }); // Reset the form
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-teal-200 mt-6">
        Neue Bestellung hinzufügen
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 text-amber-100">
        <input
          type="date"
          name="date"
          value={newOrder.date}
          onChange={handleChange}
          className="border mr-1 border-amber-100 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
          required
        />
        <input
          type="text"
          name="customerId"
          value={newOrder.customerId}
          onChange={handleChange}
          placeholder="Kundennummer"
          className="border mr-1 border-amber-100 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
          required
        />
        <input
          type="text"
          name="product"
          value={newOrder.product}
          onChange={handleChange}
          placeholder="Produkt"
          className="border mr-1 border-amber-100 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
          required
        />
        <input
          type="number"
          name="quantity"
          value={newOrder.quantity}
          onChange={handleChange}
          placeholder="Stück"
          className="border mr-1 border-amber-100 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
          min="1"
          required
        />
        <button
          type="submit"
          className="bg-teal-950 text-amber-100 p-2 rounded-md hover:bg-teal-800 transition duration-200"
        >
          Hinzufügen
        </button>
      </form>
      <h1 className="text-2xl font-bold text-teal-200 mt-6">
        Bestellübersicht
      </h1>
      <OrderList orders={orders} />
    </div>
  );
};

export default Orders;
