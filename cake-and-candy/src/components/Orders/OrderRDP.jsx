import React, { useState } from "react";

// Dummy-Daten für Kunden und deren Bestellungen
const dummyCustomers = [
  {
    id: 1,
    name: "Max Mustermann",
    ordersCount: 3,
    totalAmount: 1500,
    profit: 300,
    orders: [
      { id: 1, date: "2025-10-01", amount: 500, profit: 100, pricePerUnit: 50, quantity: 10 },
      { id: 2, date: "2025-10-05", amount: 700, profit: 200, pricePerUnit: 70, quantity: 10 },
      { id: 3, date: "2025-10-10", amount: 300, profit: 0, pricePerUnit: 30, quantity: 10 },
    ],
  },
  {
    id: 2,
    name: "Erika Musterfrau",
    ordersCount: 2,
    totalAmount: 800,
    profit: 150,
    orders: [
      { id: 4, date: "2025-10-02", amount: 400, profit: 50, pricePerUnit: 40, quantity: 10 },
      { id: 5, date: "2025-10-06", amount: 400, profit: 100, pricePerUnit: 40, quantity: 10 },
    ],
  },
  {
    id: 3,
    name: "Joe Doe",
    ordersCount: 1,
    totalAmount: 600,
    profit: 200,
    orders: [
      { id: 6, date: "2025-10-03", amount: 600, profit: 200, pricePerUnit: 60, quantity: 10 },
    ],
  },
];

const OrderRDP = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [scaleAmount, setScaleAmount] = useState(0);

  const toggleDropdown = (customer) => {
    if (selectedCustomer && selectedCustomer.id === customer.id) {
      setSelectedCustomer(null);
      setSelectedOrder(null);
    } else {
      setSelectedCustomer(customer);
      setScaleAmount(customer.totalAmount);
    }
  };

  const toggleOrderDetails = (order) => {
    setSelectedOrder(selectedOrder && selectedOrder.id === order.id ? null : order);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-teal-200 mt-6">RDP-Bestellungen</h2>
      <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
        <thead className="bg-teal-950">
          <tr>
            <th className="p-2">Kundenname</th>
            <th className="p-2">Bestellungen (Anzahl)</th>
            <th className="p-2">Rechnungsbetrag €</th>
            <th className="p-2">Gewinn</th>
          </tr>
        </thead>
        <tbody>
          {dummyCustomers.sort((a, b) => a.name.localeCompare(b.name)).map(customer => (
            <React.Fragment key={customer.id}>
              <tr
                className="border rounded-md cursor-pointer hover:bg-[#7ec6cc80]"
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
                        <h3 className="text-lg font-bold mb-2">Bestellungen für {customer.name}</h3>
                        <table className="bg-teal-950 min-w-full rounded-md shadow-lg overflow-hidden">
                          <thead className="bg-teal-900 text-amber-100 rounded-t-md">
                            <tr>
                              <th className="p-2">Bestelldatum</th>
                              <th className="p-2">Rechnungsbetrag</th>
                              <th className="p-2">Gewinn</th>
                              <th className="p-2">B2B/B2C</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customer.orders.map(order => (
                              <React.Fragment key={order.id}>
                                <tr
                                  className="hover:bg-[#7ec6cc80] cursor-pointer"
                                  onClick={() => toggleOrderDetails(order)}
                                >
                                  <td className="border border-amber-100 p-2">{order.date}</td>
                                  <td className="border border-amber-100 p-2">{order.amount} €</td>
                                  <td className="border border-amber-100 p-2">{order.profit} €</td>
                                  <td className="border border-amber-100 p-2">
                                    <select className="border border-amber-100 p-1">
                                      <option value="BSB">B2B</option>
                                      <option value="BSC">B2C</option>
                                    </select>
                                  </td>
                                </tr>
                                {selectedOrder && selectedOrder.id === order.id && (
                                  <tr>
                                    <td colSpan="4" className="bg-[#7ec6cc33] p-4 text-center rounded-md shadow-lg">
                                      <div className="bg-teal-950 rounded-md shadow-lg p-4">
                                        <h3 className="text-lg font-bold mb-2">Details für Bestellung {order.id}</h3>
                                        <table className="min-w-full text-amber-100 border-collapse border rounded-md overflow-hidden">
                                          <thead className="">
                                            <tr className="bg-teal-900">
                                              <th className="border border-amber-100 p-2">Gewinn</th>
                                              <th className="border border-amber-100 p-2">Preis pro Stück</th>
                                              <th className="border border-amber-100 p-2">Menge</th>
                                              <th className="border border-amber-100 p-2">Gesamtgewinn €</th>
                                              <th className="border border-amber-100 p-2">Gewinn %</th>
                                            </tr>
                                          </thead>
                                          <tbody className="">
                                            <tr className="hover:bg-[#7ec6cc80]">
                                              <td className="border border-amber-100 p-2">{order.profit} €</td>
                                              <td className="border border-amber-100 p-2">{order.pricePerUnit} €</td>
                                              <td className="border border-amber-100 p-2">{order.quantity}</td>
                                              <td className="border border-amber-100 p-2">{order.profit} €</td>
                                              <td className="border border-amber-100 p-2">{order.quantity > 0 ? ((order.profit / (order.pricePerUnit * order.quantity)) * 100).toFixed(2) : 0} %</td>
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
