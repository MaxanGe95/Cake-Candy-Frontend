import React, { useState, useEffect } from "react";

const OrderRDP = () => {
  const [companies, setCompanies] = useState([]);
  const [zutaten, setZutaten] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funktion zum Entfernen des Textes in Klammern
  const removeTextInParentheses = (name) => {
    return name.replace(/\s*\(.*\)\s*/g, '');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Rechnungen abrufen
        const invoiceResponse = await fetch("http://localhost:5000/api/invoices");
        if (!invoiceResponse.ok) throw new Error("Fehler beim Laden der Rechnungen");
        const invoices = await invoiceResponse.json();

        // Zutaten abrufen
        const zutatenResponse = await fetch("http://localhost:5000/api/zutaten");
        if (!zutatenResponse.ok) throw new Error("Fehler beim Laden der Zutaten");
        const zutatenData = await zutatenResponse.json();
        setZutaten(zutatenData);

        console.log("Rechnungen:", invoices);
        console.log("Zutaten:", zutatenData);

        // Firmen nach ID gruppieren
        const groupedCompanies = invoices.reduce((acc, invoice) => {
          const { company, _id, totalAmount, products, date, customerType } = invoice;

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

          const amount = totalAmount ?? 0;

          // Gewinnberechnung pro Bestellung
          let orderProfit = 0;
          const orderProducts = Array.isArray(products)
            ? products.map((product, index) => {
                const cleanName = removeTextInParentheses(product.productName); // Produktname ohne Klammern
                const ekPreis = zutatenData.find((z) => removeTextInParentheses(z.name) === cleanName)?.ekPreis || 0;
                const profitPerItem = product.pricePerUnit - ekPreis;
                const totalProfit = profitPerItem * product.quantity;
                orderProfit += totalProfit;

                return {
                  id: `${_id}-${index}`,
                  name: cleanName, // Hier wird der bereinigte Name angezeigt
                  quantity: product.quantity ?? 0,
                  ekPreis: ekPreis.toFixed(2),
                  pricePerUnit: product.pricePerUnit ?? 0,
                  totalPrice: product.totalPrice ?? 0,
                  profit: totalProfit.toFixed(2),
                };
              })
            : [];

          acc[company].ordersCount += 1;
          acc[company].totalRevenue += amount;
          acc[company].totalProfit += orderProfit;

          acc[company].orders.push({
            id: _id,
            date: date ? new Date(date).toLocaleDateString("de-DE") : "Unbekannt",
            amount: amount,
            profit: orderProfit,
            type: customerType || "Unbekannt",
            products: orderProducts,
          });

          return acc;
        }, {});

        setCompanies(Object.values(groupedCompanies));
        setLoading(false);
      } catch (err) {
        console.error("Fehler beim Abrufen:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
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
      <table className="min-w-full text-amber-100 border rounded-md overflow-hidden">
        <thead className="bg-teal-950/80">
          <tr>
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
                className="border border-amber-100 cursor-pointer hover:bg-[#7ec6cc80] shadow-md transition duration-200"
                onClick={() => toggleCompany(company)}
              >
                <td className="p-2 text-center">{company.name}</td>
                <td className="p-2 text-center">{company.ordersCount}</td>
                <td className="p-2 text-center">{company.totalRevenue.toFixed(2)} $</td>
                <td className="p-2 text-center">{company.totalProfit.toFixed(2)} $</td>
              </tr>

              {selectedCompany?.id === company.id && (
                <tr>
                  <td colSpan="4" className="p-4">
                    <table className="w-full bg-[#57888c]/50 rounded-[10px] shadow-xl overflow-hidden text-center">
                      <thead className="bg-teal-950/70 text-amber-100">
                        <tr className="shadow-xl rounded-md">
                          <th className="p-2">Datum</th>
                          <th className="p-2">Rechnungsbetrag</th>
                          <th className="p-2">Gewinn</th>
                          <th className="p-2">Typ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.orders
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((order) => (
                            <React.Fragment key={order.id}>
                              <tr
                                className="cursor-pointer hover:bg-[#7ec6cc80] transition duration-200 shadow-lg rounded-md"
                                onClick={() => toggleOrder(order)}
                              >
                                <td className="p-2 text-center">{order.date}</td>
                                <td className="p-2 text-center">{order.amount.toFixed(2)} $</td>
                                <td className="p-2 text-center">{order.profit.toFixed(2)} $</td>
                                <td className="p-2 text-center">{order.type}</td>
                              </tr>

                              {selectedOrder?.id === order.id && (
                                <tr>
                                  <td colSpan="4" className="p-4 shadow-lg">
                                    <table className="w-full rounded-md shadow-lg overflow-hidden">
                                      <thead className="bg-teal-950/60 shadow-xl text-amber-100">
                                        <tr className="shadow-sm rounded-t-md">
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
                                          <tr key={product.id} className="shadow-sm bg-[#7ec6cc]/15 cursor-pointer transition duration-200 hover:bg-[#7ec6cc80] rounded-t-md">
                                            <td className="p-2 text-center">{product.name}</td>
                                            <td className="p-2 text-center">{product.quantity}</td>
                                            <td className="p-2 text-center">{product.ekPreis} $</td>
                                            <td className="p-2 text-center">{product.pricePerUnit.toFixed(2)} $</td>
                                            <td className="p-2 text-center">{product.totalPrice.toFixed(2)} $</td>
                                            <td className="p-2 text-center">{product.profit} $</td>
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
