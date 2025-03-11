import React, { useState, useEffect } from "react";

const OrderRDP = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/invoices"); // URL anpassen
        const result = await response.json();
        setCustomers(transformData(result));
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    };

    fetchData();
  }, []);

  const transformData = (data) => {
    return data.map((invoice) => ({
      id: invoice._id,
      name: invoice.company, // Angenommen, die Firma ist der Kundenname
      ordersCount: 1, // Bestellungen zählen, wenn man mehrere Rechnungen hat
      totalAmount: invoice.totalAmount,
      profit: calculateProfit(invoice), // Berechnung des Gewinns
      orders: invoice.products.map((product, index) => ({
        id: index + 1, // ID für die Bestellung
        date: invoice.date,
        amount: product.totalPrice,
        profit: product.pricePerUnit * product.quantity - product.totalPrice, // Beispiel für Gewinnberechnung
        pricePerUnit: product.pricePerUnit,
        quantity: product.quantity,
        type: invoice.customerType, // B2B oder B2C
        itemName: product.productName,
      })),
    }));
  };

  const calculateProfit = (invoice) => {
    //  Beispielberechnung für den Gewinn
    return invoice.products.reduce((total, product) => {
      return total + (product.pricePerUnit * product.quantity - product.totalPrice);
    }, 0);
  };

  const toggleDropdown = (customer) => {
    if (selectedCustomer && selectedCustomer.id === customer.id) {
      setSelectedCustomer(null);
      setSelectedOrder(null);
    } else {
      setSelectedCustomer(customer);
    }
  };

  const toggleOrderDetails = (order) => {
    setSelectedOrder(selectedOrder && selectedOrder.id === order.id ? null : order);
  };

  return (
    <div className="">
      <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
        <thead className="bg-teal-950">
          <tr>
            <th className="p-2">Kundenname</th>
            <th className="p-2">Bestellungen</th>
            <th className="p-2">Rechnungsbetrag €</th>
            <th className="p-2">Gewinn</th>
          </tr>
        </thead>
        <tbody>
          {customers.sort((a, b) => a.name.localeCompare(b.name)).map((customer) => (
            <React.Fragment key={customer.id}>
              <tr
                className="border rounded-md cursor-pointer hover:bg-teal-950"
                onClick={() => toggleDropdown(customer)}
              >
                <td className="p-2 text-center">{customer.name}</td>
                <td className="p-2 text-center">{customer.ordersCount}</td>
                <td className="p-2 text-center">{customer.totalAmount} €</td>
                <td className="p-2 text-center">{customer.profit} €</td>
              </tr>
              {selectedCustomer && selectedCustomer.id === customer.id && (
                <React.Fragment>
                  <tr>
                    <td colSpan="4" className="rounded-md shadow-lg p-4">
                      <div className="bg-[#7ec6cc33] rounded-md shadow-lg p-4">
                        <h3 className="text-lg font-bold mb-2">
                          Bestellungen für {customer.name}
                        </h3>
                        <table className="bg-teal-950 min-w-full rounded-md shadow-lg overflow-hidden">
                          <thead className="bg-teal-900 text-amber-100 rounded-t-md">
                            <tr>
                              <th className="p-2">Bestelldatum</th>
                              <th className="p-2">Rechnungsbetrag</th>
                              <th className="p-2">Gewinn €</th>
                              <th className="p-2">B2B/ B2C</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customer.orders.map((order) => (
                              <React.Fragment key={order.id}>
                                <tr
                                  className="hover:bg-[#7ec6cc80] cursor-pointer"
                                  onClick={() => toggleOrderDetails(order)}
                                >
                                  <td className="p-2 text-center">{order.date}</td>
                                  <td className="p-2 text-center">{order.amount} €</td>
                                  <td className="p-2 text-center">{order.profit} €</td>
                                  <td className="p-2 text-center">{order.type}</td>
                                </tr>
                                {selectedOrder && selectedOrder.id === order.id && (
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="bg-[#7ec6cc33] p-4 text-center rounded-md shadow-lg"
                                    >
                                      <div className="bg-teal-950 rounded-md shadow-lg p-4">
                                        <h3 className="text-lg font-bold mb-2">
                                          Details für Bestellung {order.id}
                                        </h3>
                                        <table className="min-w-full bg-[#7ec6cc33] text-amber-100 border-collapse border rounded-md overflow-hidden">
                                          <thead className="">
                                            <tr className="bg-teal-900">
                                              <th className=" p-2">Artikelname</th>
                                              <th className=" p-2">Gewinn €</th>
                                              <th className=" p-2">Preis pro Stück</th>
                                              <th className=" p-2">Menge</th>
                                              <th className=" p-2">Gesamtgewinn €</th>
                                              <th className=" p-2">Gewinn %</th>
                                            </tr>
                                          </thead>
                                          <tbody className="">
                                            <tr className="hover:bg-[#7ec6cc80]">
                                              <td className="p-2">{order.itemName}</td>
                                              <td className="p-2">{order.profit} €</td>
                                              <td className="p-2">{order.pricePerUnit} €</td>
                                              <td className="p-2">{order.quantity}</td>
                                              <td className="p-2">{order.profit} €</td>
                                              <td className="p-2">
                                                {order.quantity > 0
                                                  ? ((order.profit / (order.pricePerUnit * order.quantity)) * 100).toFixed(2)
                                                  : 0}%
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderRDP;
