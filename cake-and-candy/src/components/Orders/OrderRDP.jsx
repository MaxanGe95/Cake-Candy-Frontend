import React, { useState, useEffect } from "react";

const OrderRDP = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API-Daten abrufen
  useEffect(() => {
    fetch("http://localhost:5000/api/invoices")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Rechnungen");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Rechnungen:", data);

        // Firmen nach ID gruppieren
        const groupedCompanies = data.reduce((acc, invoice) => {
          const { company, _id, totalAmount, profit, products, date, customerType } = invoice;

          if (!acc[company]) {
            acc[company] = {
              id: _id,
              name: company,
              ordersCount: 0,
              totalRevenue: 0,
              totalProfit: 0,
              orders: [],
            };
          }

          // Verhindere undefined-Werte
          const amount = totalAmount ?? 0;
          const profitValue = profit ?? 0;

          acc[company].ordersCount += 1;
          acc[company].totalRevenue += amount;
          acc[company].totalProfit += profitValue;

          acc[company].orders.push({
            id: _id,
            date: date ? new Date(date).toLocaleDateString("de-DE") : "Unbekannt",
            amount: amount,
            profit: profitValue,
            type: customerType || "Unbekannt", // B2B oder B2C
            products: Array.isArray(products)
              ? products.map((product, index) => ({
                  id: `${_id}-${index}`,
                  name: product.productName || "Unbekanntes Produkt",
                  quantity: product.quantity ?? 0,
                  pricePerUnit: product.pricePerUnit ?? 0,
                  totalPrice: product.totalPrice ?? 0,
                }))
              : [],
          });

          return acc;
        }, {});

        // Firmen als Array speichern
        setCompanies(Object.values(groupedCompanies));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const toggleCompany = (company) => {
    setSelectedCompany((prev) => (prev?.id === company.id ? null : company));
    setSelectedOrder(null);
  };

  const toggleOrder = (order) => {
    setSelectedOrder((prev) => (prev?.id === order.id ? null : order));
  };

  if (loading) return <p className="text-teal-200">Lade Rechnungen...</p>;
  if (error) return <p className="text-red-500">Fehler: {error}</p>;

  return (
    <div className="container mx-auto">
      {/* Haupttabelle: Firmenübersicht */}
      <table className="min-w-full text-amber-100 border rounded-md overflow-hidden">
        <thead className="bg-teal-950">
          <tr className="">
            <th className="p-2">Firma</th>
            <th className="p-2">Bestellungen</th>
            <th className="p-2">Gesamtbetrag</th>
            <th className="p-2">Gewinn</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <React.Fragment key={company.id}>
              <tr
                className="border border-amber-100 cursor-pointer hover:bg-teal-950"
                onClick={() => toggleCompany(company)}
              >
                <td className="p-2 text-center">{company.name}</td>
                <td className="p-2 text-center">{company.ordersCount}</td>
                <td className="p-2 text-center">{company.totalRevenue.toFixed(2)} $</td>
                <td className="p-2 text-center">{company.totalProfit.toFixed(2)} $</td>
              </tr>

              {/* Bestellungen für die gewählte Firma anzeigen */}
              {selectedCompany?.id === company.id && (
                <tr>
                  <td colSpan="4" className="p-4">
                    <table className="w-full bg-teal-950 rounded-md shadow-lg overflow-hidden">
                      <thead>
                        <tr className="bg-teal-900 text-amber-100 rounded-md">
                          <th className="p-2">Datum</th>
                          <th className="p-2">Rechnungsbetrag</th>
                          <th className="p-2">Gewinn</th>
                          <th className="p-2">Typ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...company.orders]
                          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Nach Datum sortieren
                          .map((order) => (
                            <React.Fragment key={order.id}>
                              <tr
                                className="cursor-pointer hover:bg-[#7ec6cc80] shadow-lg rounded-md"
                                onClick={() => toggleOrder(order)}
                              >
                                <td className="p-2 text-center">{order.date}</td>
                                <td className="p-2 text-center">{order.amount.toFixed(2)} $</td>
                                <td className="p-2 text-center">{order.profit.toFixed(2)} $</td>
                                <td className="p-2 text-center">{order.type}</td>
                              </tr>

                              {/* Produkte für die gewählte Bestellung anzeigen */}
                              
                              {selectedOrder?.id === order.id && (
                                <tr>
                                  <td colSpan="4" className="p-4 bg-[#7ec6cc33] shadow-lg ">
                                    <table className="w-full bg-teal-950 text-amber-100 rounded-md shadow-lg overflow-hidden">
                                      <thead className="rounded-t-md">
                                        <tr className="bg-teal-900 cursor-pointer">
                                          <th className="p-2">Produkt</th>
                                          <th className="p-2">Menge</th>
                                          <th className="p-2">Preis/Stück</th>
                                          <th className="p-2">Gesamt</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {order.products.map((product) => (
                                          <tr key={product.id} className="hover:bg-[#7ec6cc80] shadow-lg">
                                            <td className="p-2 text-center">{product.name}</td>
                                            <td className="p-2 text-center">{product.quantity}</td>
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

export default OrderRDP;
