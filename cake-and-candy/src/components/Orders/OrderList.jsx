// import React from "react";
// import OrderItem from "../Orders/OrderItem.jsx";

// const OrderList = ({ orders }) => {
//   if(!orders || orders.length ===0){
//     return <p className="text-amber-100">Keine Bestellungen vorhanden.</p>
//   }
//   return (
//     <table className="min-w-full text-amber-100 border-collapse border rounded-md overflow-hidden">
//       <thead>
//         <tr className="bg-teal-950">
//         <th className="p-2 w-1/8">Kundename</th>
//           <th className="p-2 w-1/6 ">Datum</th>
//           <th className="p-2 w-1/4">Produkt</th>
//           <th className="p-2 w-1/8">Stück</th>
//         </tr>
//       </thead>
//       <tbody>
//         {orders.map((order) => (
//           <OrderItem key={order.id} order={order} />
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default OrderList;

import React, { useState, useEffect } from "react";
//  import OrderItem from "../Orders/OrderItem.jsx";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Zustand für den ausgewählten Kunden
  const [selectedOrder, setSelectedOrder] = useState(null); // Zustand für die ausgewählte Bestellung

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderResponse = await fetch("http://localhost:5000/api/orders");
        if (!orderResponse.ok)
          throw new Error("Fehler beim Laden der Bestellungen");
        const orders = await orderResponse.json();
        setOrders(orders);

        // Bestellungen nach Kunden gruppieren
        const groupedOrders = orders.reduce((acc, order) => {
          const { user, _id, date, products } = order;

          if (!acc[user]) {
            acc[user] = {
              customerName: user,
              orders: [],
            };
          }

          acc[user].orders.push({
            id: _id,
            date: new Date(date).toLocaleDateString("de-DE"),
            products,
          });

          return acc;
        }, {});

        setOrders(Object.values(groupedOrders));
      } catch (err) {
        console.error("Fehler beim Abrufen der Bestellungen:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Funktion zum Umschalten der Bestellübersicht für den Kunden
  const toggleCustomer = (customer) => {
    setSelectedCustomer((prev) => (prev === customer ? null : customer));
    setSelectedOrder(null); // Reset der Bestellansicht, wenn ein neuer Kunde ausgewählt wird
  };

  // Funktion zum Umschalten der Bestelldetails
  const toggleOrder = (order) => {
    setSelectedOrder((prev) => (prev?.id === order.id ? null : order));
  };
  if (loading) return <p className="text-teal-200">Lade Bestellungen...</p>;
  if (error) return <p className="text-red-500">Fehler: {error}</p>;

  return (
    <div className="container mx-auto">
      <table className="min-w-full text-amber-100 border rounded-md overflow-hidden">
        <thead className="bg-teal-950">
          <tr>
            <th className="p-2">Kundename</th>
            <th className="p-2">Bestellungen</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((customer) => (
            <React.Fragment key={customer.customerName}>
              <tr
                className="cursor-pointer hover:bg-teal-950"
                onClick={() => toggleCustomer(customer)}
              >
                <td className="p-2 text-center">{customer.customerName}</td>
                <td className="p-2 text-center">{customer.orders.length}</td>
              </tr>

              {/* Bestellungen des Kunden anzeigen, wenn der Kunde ausgewählt ist */}
              {selectedCustomer === customer && (
                <tr>
                  <td colSpan="2" className="p-4">
                    <table className="w-full bg-teal-950 rounded-md shadow-lg overflow-hidden">
                      <thead>
                        <tr className="bg-teal-900 text-amber-100 rounded-md">
                          <th className="p-2">Datum</th>
                          <th className="p-2">Produkte</th>
                          <th className="p-2">Menge</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.orders.map((order) => (
                          <React.Fragment key={order.id}>
                            <tr
                              className="cursor-pointer hover:bg-[#7ec6cc80] shadow-lg rounded-md"
                              onClick={() => toggleOrder(order)}
                            >
                              <td className="p-2 text-center">{order.date}</td>
                              <td className="p-2 text-center">
                                {order.products.map((p) => p.name).join(", ")}
                              </td>
                              <td className="p-2 text-center">
                                {order.products.reduce(
                                  (total, p) => total + p.quantity,
                                  0
                                )}
                              </td>
                            </tr>

                            {/* Bestelldetails anzeigen */}
                            {selectedOrder?.id === order.id && (
                              <tr>
                                <td
                                  colSpan="3"
                                  className="p-4 bg-[#7ec6cc33] shadow-lg"
                                >
                                  <table className="w-full bg-teal-950 text-amber-100 rounded-md shadow-lg overflow-hidden">
                                    <thead>
                                      <tr className="bg-teal-900">
                                        <th className="p-2">Produkt</th>
                                        <th className="p-2">Menge</th>
                                        <th className="p-2">EK-Preis</th>
                                        <th className="p-2">Preis/Stück</th>
                                        <th className="p-2">Gesamt</th>
                                        <th className="p-2">Gewinn</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.products.map((product) => (
                                        <tr
                                          key={product.id}
                                          className="hover:bg-[#7ec6cc80]"
                                        >
                                          <td className="p-2 text-center">
                                            {product.name}
                                          </td>
                                          <td className="p-2 text-center">
                                            {product.quantity}
                                          </td>
                                          <td className="p-2 text-center">
                                            {product.ekPreis
                                              ? product.ekPreis.toFixed(2)
                                              : "N/A"}{" "}
                                            $
                                          </td>
                                          <td className="p-2 text-center">
                                            {product.pricePerUnit &&
                                            !isNaN(product.pricePerUnit)
                                              ? product.pricePerUnit.toFixed(2)
                                              : "N/A"}{" "}
                                            $
                                          </td>
                                          <td className="p-2 text-center">
                                            {product.totalPrice &&
                                            !isNaN(product.totalPrice)
                                              ? product.totalPrice.toFixed(2)
                                              : "N/A"}{" "}
                                            $
                                          </td>
                                          <td className="p-2 text-center">
                                            {product.profit &&
                                            !isNaN(product.profit)
                                              ? product.profit.toFixed(2)
                                              : "N/A"}{" "}
                                            $
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default OrderList;
