import React, { useState, useEffect } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [zutaten, setZutaten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderResponse = await fetch("http://localhost:5000/api/orders");
        if (!orderResponse.ok) throw new Error("Fehler beim Laden der Bestellungen");
        const orderData = await orderResponse.json();

        const zutatenResponse = await fetch("http://localhost:5000/api/zutaten");
        if (!zutatenResponse.ok) throw new Error("Fehler beim Laden der Zutaten");
        const zutatenData = await zutatenResponse.json();

        setZutaten(zutatenData);

        const groupedOrders = orderData.reduce((acc, order) => {
          const { user, _id, date, products, totalPrice = 0 } = order;
          if (!acc[user]) {
            acc[user] = { customerName: user, orders: [] };
          }

          const enrichedProducts = products.map((product) => {
            const zutat = zutatenData.find((z) => z.name === product.name) || {};
            return {
              ...product,
              ekPreis: zutat.ekPreis || 0,
              pricePerUnit: zutat.b2bPreis || 0,
              totalPrice: (zutat.b2bPreis || 0) * product.quantity,
            };
          });

          acc[user].orders.push({
            id: _id,
            date: new Date(date).toLocaleDateString("de-DE"),
            products: enrichedProducts,
            totalPrice,
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

  const toggleCustomer = (customer) => {
    setSelectedCustomer((prev) => (prev === customer ? null : customer));
    setSelectedOrder(null);
  };

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
            <th className="p-2">Kundenname</th>
            <th className="p-2">Bestellungen</th>
            <th className="p-2">Gesamtbetrag</th>
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
                <td className="p-2 text-center">{customer.orders.reduce((total, order) => total + order.totalPrice, 0).toFixed(2)} $</td>
              </tr>
              {selectedCustomer?.customerName === customer.customerName && (
                <tr>
                  <td colSpan="3" className="p-4">
                    <table className="w-full bg-teal-950 rounded-md shadow-lg overflow-hidden">
                      <thead>
                        <tr className="bg-teal-900 text-amber-100 rounded-md">
                          <th className="p-2">Datum</th>
                          <th className="p-2">Rechnungsbetrag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.orders.sort((a, b) => new Date(b.date) - new Date(a.date)).map((order) => (
                          <React.Fragment key={order.id}>
                            <tr className="cursor-pointer hover:bg-[#7ec6cc80] shadow-lg rounded-md" onClick={() => toggleOrder(order)}>
                              <td className="p-2 text-center">{order.date}</td>
                              
                              <td className="p-2 text-center">{order.totalPrice.toFixed(2)} $</td>
                            </tr>
                            {selectedOrder?.id === order.id && (
                              <tr>
                                <td colSpan="3" className="p-4 bg-[#7ec6cc33] shadow-lg">
                                  <table className="w-full bg-teal-950 text-amber-100 rounded-md shadow-lg overflow-hidden">
                                    <thead>
                                      <tr className="bg-teal-900">
                                        <th className="p-2">Produkt</th>
                                        <th className="p-2">Menge</th>
                                        <th className="p-2">EK-Preis</th>
                                        <th className="p-2">Preis/Stück</th>
                                        <th className="p-2">Gesamt</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.products.map((product) => (
                                        <tr key={product._id || product.name} className="hover:bg-[#7ec6cc80]">
                                          <td className="p-2 text-center">{product.name}</td>
                                          <td className="p-2 text-center">{product.quantity}</td>
                                          <td className="p-2 text-center">{product.ekPreis.toFixed(2)} $</td>
                                          <td className="p-2 text-center">{product.pricePerUnit.toFixed(2)} $</td>
                                          <td className="p-2 text-center">{product.totalPrice.toFixed(2)} $</td>
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