// import React from 'react';

// const OrderItem = ({ order }) => {
//   return (
//     <tr className="border border-amber-100">
//       <td className="p-2 text-center">{order.customerId}</td>
//       <td className="p-2 text-center">{new Date(order.date).toLocaleDateString("de-DE")}</td>
//       <td className="p-2 text-center">{order.product}</td>
//       <td className="p-2 text-center">{order.quantity}</td>
//     </tr>
//   );
// };

// export default OrderItem;

import React from 'react';

const OrderItem = ({ order, onClick }) => {
  return (
    <tr className="border border-amber-100 cursor-pointer hover:bg-teal-950" onClick={onClick}>
      <td className="p-2 text-center">{order.customerId}</td>
      <td className="p-2 text-center">{new Date(order.date).toLocaleDateString("de-DE")}</td>
      <td className="p-2 text-center">{order.product}</td>
      <td className="p-2 text-center">{order.quantity}</td>
    </tr>
  );
};

export default OrderItem;

