import React, { useState } from "react";
import OrderList from "../components/Orders/OrderList.jsx";
import OrderRDP from "../components/Orders/OrderRDP.jsx";
// import { Link } from "react-router-dom"; // Importiere Link von react-router-dom

const Orders = () => {
  const [currentView, setCurrentView] = useState(null); // Zustand für die aktuelle Ansicht
  const [orders, setOrders] = useState([]); // Hier kannst du deine Bestellungen initialisieren

  // Beispiel-Bestellungen für Kunden und RDP (normalerweise würdest du dies von einem API-Endpunkt abrufen)
  const customerOrders = [
    { id: 1, date: "2025-10-01", customerId: "C123", product: "Produkt A", quantity: 2 },
    { id: 2, date: "2025-10-02", customerId: "C124", product: "Produkt B", quantity: 1 },
  ];

  const rdpOrders = [
    { id: 1, date: "2025-10-03", customerId: "C125", product: "Produkt C", quantity: 5 },
    { id: 2, date: "2025-10-04", customerId: "C126", product: "Produkt D", quantity: 3 },
  ];

  const handleCustomerOrdersClick = () => {
    setCurrentView("customer");
    setOrders(customerOrders); // Setze die Bestellungen für Kunden
  };

  const handleRDPOrdersClick = () => {
    setCurrentView("rdp");
    setOrders(rdpOrders); // Setze die Bestellungen für RDP
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={handleCustomerOrdersClick}
          className="bg-teal-950 text-amber-100 p-2 rounded-md hover:bg-teal-800 transition duration-200 mr-2"
        >
          Kunden-Bestellungen
        </button>
        <button
          onClick={handleRDPOrdersClick}
          className="bg-teal-950 text-amber-100 p-2 rounded-md hover:bg-teal-800 transition duration-200"
        >
          RDP-Bestellungen
        </button>
      </div>

      {currentView === "customer" && (
        <>
          <h1 className="text-2xl font-bold text-teal-200 mt-6">
            Bestell-Übersicht für Kunden
          </h1>
          <OrderList orders={orders} />
        </>
      )}

      {currentView === "rdp" && (
        <>
          <OrderRDP />
        </>
      )}
    </div>
  );
};

export default Orders;
