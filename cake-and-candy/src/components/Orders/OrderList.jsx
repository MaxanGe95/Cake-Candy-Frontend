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
  const [selectedOrder, setSelectedOrder] = useState(null); // Zustand für die ausgewählte Bestellung

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) throw new Error("Fehler beim Laden der Bestellungen");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Fehler beim Abrufen der Bestellungen:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // const handleSelectOrder = (orderId) => {
  //   // Details der ausgewählten Bestellung abrufen
  //   fetchOrderDetails(orderId);
  // };

  // const fetchOrderDetails = async (orderId) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
  //     if (!response.ok) throw new Error("Fehler beim Laden der Bestelldetails");
  //     const orderDetails = await response.json();
  //     setSelectedOrder(orderDetails);
  //   } catch (err) {
  //     console.error("Fehler beim Abrufen der Bestelldetails:", err);
  //     setError(err.message);
  //   }
  // };

  // Funktion zum Umschalten der Bestelldetails
  const toggleOrder = (order) => {
    // Wenn die gleiche Bestellung erneut angeklickt wird, verstecke die Details
    setSelectedOrder((prev) => (prev?.id === order.id ? null : order));
  };

  if (loading) return <p className="text-teal-200">Lade Bestellungen...</p>;
  if (error) return <p className="text-red-500">Fehler: {error}</p>;

  // return (
  //   <div className="container mx-auto">
  //     <table className="min-w-full text-amber-100 border rounded-md overflow-hidden">
  //       <thead className="bg-teal-950">
  //         <tr>
  //           <th className="p-2">Kunden-ID</th>
  //           <th className="p-2">Datum</th>
  //           <th className="p-2">Produkt</th>
  //           <th className="p-2">Menge</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {orders.map((order) => (
  //           <OrderItem key={order.id} order={order} onSelece={handleSelectOrder}/>
  //         ))}
  //       </tbody>
  //     </table>
  //     {selectedOrder && (
  //       <div className="mt-4 p-4 border rounded-md bg-gray-800 text-white">
  //         <h2 className="text-xl font-bold">Bestelldetails</h2>
  //         <p><strong>Kunden-ID:</strong> {selectedOrder.customerId}</p>
  //         <p><strong>Datum:</strong> {new Date(selectedOrder.date).toLocaleDateString("de-DE")}</p>
  //         <p><strong>Produkt:</strong> {selectedOrder.product}</p>
  //         <p><strong>Menge:</strong> {selectedOrder.quantity}</p>
  //         {/* Weitere Details ...... */}
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="container mx-auto">
      <table className="min-w-full text-amber-100 border rounded-md overflow-hidden">
        <thead className="bg-teal-950">
          <tr>
            <th className="p-2">Kunden-ID</th>
            <th className="p-2">Datum</th>
            <th className="p-2">Produkt</th>
            <th className="p-2">Menge</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <tr
                className="cursor-pointer hover:bg-teal-900"
                onClick={() => toggleOrder(order)}
              >
                <td className="p-2 text-center">{order.user}</td>
                <td className="p-2 text-center">
                  {new Date(order.date).toLocaleDateString("de-DE")}
                </td>
                <td className="p-2 text-center">
                  {order.products.map((p) => p.name).join(", ")}
                </td>
                <td className="p-2 text-center">
                  {order.products.reduce((total, p) => total + p.quantity, 0)}
                </td>
              </tr>

              {/* Bestelldetails im Inneren einer Tabelle */}
              {selectedOrder?.id === order.id && (
                <tr>
                  <td colSpan="4" className="p-4 bg-[#7ec6cc33] shadow-lg">
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
                          <tr key={product.id} className="hover:bg-[#7ec6cc80]">
                            <td className="p-2 text-center">{product.name}</td>
                            <td className="p-2 text-center">
                              {product.quantity}
                            </td>
                            <td className="p-2 text-center">
                              {product.ekPreis} $
                            </td>
                            <td className="p-2 text-center">
                              {product.pricePerUnit &&
                              !isNaN(product.pricePerUnit)
                                ? product.pricePerUnit.toFixed(2)
                                : "N/A"}{" "}
                              $
                            </td>
                            <td className="p-2 text-center">
                              {product.totalPrice && !isNaN(product.totalPrice)
                                ? product.totalPrice.toFixed(2)
                                : "N/A"}{" "}
                              $
                            </td>
                            <td className="p-2 text-center">
                              {product.profit && !isNaN(product.profit)
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
    </div>
  );
};
export default OrderList;
