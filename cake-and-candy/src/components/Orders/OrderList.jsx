import React from "react";
import OrderItem from "../Orders/OrderItem.jsx";

const OrderList = ({ orders }) => {
  return (
    <table className="min-w-full text-amber-100 border-collapse border rounded-md overflow-hidden">
      <thead>
        <tr className="bg-teal-950">
          <th className="p-2 w-1/6 ">Datum</th>
          <th className="p-2 w-1/8">Kundennummer</th>
          <th className="p-2 w-1/4">Produkt</th>
          <th className="p-2 w-1/8">Stück</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <OrderItem key={index} order={order} />
        ))}
      </tbody>
    </table>
  );
};

export default OrderList;
