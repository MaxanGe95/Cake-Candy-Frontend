import React from 'react';

const OrderItem = ({ order }) => {
    return (
        <tr className="text-center hover:bg-[#7ec6cc80] border border-amber-100 rounded-md transition duration-200">
            <td className=" p-2">{order.date}</td>
            <td className=" p-2">{order.customerId}</td>
            <td className=" p-2">{order.product}</td>
            <td className=" p-2">{order.quantity}</td>
        </tr>
    );
};

export default OrderItem;