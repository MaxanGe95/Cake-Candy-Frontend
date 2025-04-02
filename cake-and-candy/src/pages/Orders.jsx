// import React, { useState } from "react";
// import OrderList from "../components/Orders/OrderList.jsx";
// import OrderRDP from "../components/Orders/OrderRDP.jsx";
// // import { Link } from "react-router-dom"; // Importiere Link von react-router-dom

//  const Orders = () => {
// const [currentView, setCurrentView] = useState(null); // Zustand für die aktuelle Ansicht
// const [orders, setOrders] = useState([]); // Bestellungen initialisieren

//   // Beispiel-Bestellungen für Kunden und RDP (normalerweise vom API-Endpunkt abrufen)
//  const customerOrders = [
//        { id: 1, date: "2025-10-01", customerId: "C123", product: "Produkt A", quantity: 2 },
//      { id: 2, date: "2025-10-02", customerId: "C124", product: "Produkt B", quantity: 1 },
//   ];

//   const rdpOrders = [
//    { id: 1, date: "2025-10-03", customerId: "C125", product: "Produkt C", quantity: 5 },
//     { id: 2, date: "2025-10-04", customerId: "C126", product: "Produkt D", quantity: 3 },
//   ];

//   const handleCustomerOrdersClick = () => {
//     setCurrentView("customer");
//     setOrders(customerOrders); //Bestellungen für Kunden
//    };
//    const handleRDPOrdersClick = () => {
//           setCurrentView("rdp");
//    setOrders(rdpOrders); // Bestellungen für RDP
//   };


// // const Orders = () => {
// //   const [currentView, setCurrentView] = useState(null);
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchOrders(); // Bestellungen abrufen, wenn die Komponente geladen wird
// //   }, []);

// //   const fetchOrders = async () => {
// //     try {
// //       const response = await fetch("http://localhost:5000/api/orders");
// //       const data = await response.json();
// //       setOrders(data);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Fehler beim Abrufen der Bestellungen:", error);
// //       setLoading(false);
// //     }
// //   };

// //   const handleCustomerOrdersClick = () => {
// //     setCurrentView("customer");
// //   };

// //   const handleRDPOrdersClick = () => {
// //     setCurrentView("rdp");
// //   };

// //   if (loading) {
// //     return <div>Loading...</div>; // Ladeanzeige während des Abrufens
// //   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-center text-2xl font-bold text-teal-200 mb-4">Bestellungen</h1>
//       <div className="mb-4 text-center">
//         <button
//           onClick={handleCustomerOrdersClick}
//           className="bg-teal-950 text-amber-100 p-2 rounded-md hover:bg-teal-800 transition duration-200 mr-2"
//         >
//           Kunden-Bestellungen
//         </button>
//         <button
//           onClick={handleRDPOrdersClick}
//           className="bg-teal-950 text-amber-100 p-2 rounded-md hover:bg-teal-800 transition duration-200"
//         >
//           RDP-Bestellungen
//         </button>
//       </div>

//       {currentView === "customer" && (
//         <>
//           <h1 className="text-2xl font-bold text-teal-200 mt-6">
//             Kunden-Bestellungen
//           </h1>
//           <OrderList orders={orders} />
//         </>
//       )}

//       {currentView === "rdp" && (
//         <>
//       <h1 className="text-2xl font-bold text-teal-200 mt-6">RDP-Bestellungen</h1>

//           <OrderRDP />
//         </>
//       )}
//     </div>
//   );
// };

// export default Orders;

import React, { useState } from "react";
import OrderList from "../components/Orders/OrderList.jsx";
import OrderRDP from "../components/Orders/OrderRDP.jsx";

const Orders = () => {
  const [currentView, setCurrentView] = useState(null);
 const [orders, setOrders] = useState([]); // Bestellungen initialisieren


  const handleCustomerOrdersClick = () => {
    setCurrentView("customer");
  };

  const handleRDPOrdersClick = () => {
    setCurrentView("rdp");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-2xl font-bold text-teal-200 mb-4">Bestellungen</h1>
      <div className="mb-4 text-center">
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
            Kunden-Bestellungen
         </h1>
        <OrderList orders={orders} />
       </>
     )}

     {currentView === "rdp" && (
       <>
     <h1 className="text-2xl font-bold text-teal-200 mt-6">RDP-Bestellungen</h1>

         <OrderRDP />
       </>
      )}
    </div>
  );
};

export default Orders;
