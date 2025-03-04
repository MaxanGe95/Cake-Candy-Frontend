import React from 'react';

const OrderItem = ({ order }) => {
    return (
        <tr className="hover:bg-[#7ec6cc80] transition duration-200">
            <td className="border border-amber-100 p-2">{order.date}</td>
            <td className="border border-amber-100 p-2">{order.customerId}</td>
            <td className="border border-amber-100 p-2">{order.product}</td>
            <td className="border border-amber-100 p-2">{order.quantity}</td>
        </tr>
    );
};

export default OrderItem;