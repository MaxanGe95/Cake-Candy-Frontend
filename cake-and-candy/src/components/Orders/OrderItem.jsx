import React from 'react';

const OrderItem = ({ order }) => {
    return (
        <tr>
            <td className="border border-gray-300 p-2">{order.date}</td>
            <td className="border border-gray-300 p-2">{order.customerId}</td>
            <td className="border border-gray-300 p-2">{order.product}</td>
            <td className="border border-gray-300 p-2">{order.quantity}</td>
        </tr>
    );
};

export default OrderItem;