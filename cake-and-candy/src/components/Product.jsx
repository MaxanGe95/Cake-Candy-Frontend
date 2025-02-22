import React from 'react';

const Product = ({ image, title, description }) => {
  return (
    <div className="bg-teal-100/80 max-w-sm rounded-xl overflow-hidden shadow-lg">
      <img className="w-full" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2 flex justify-end">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Kaufen
        </button>
      </div>
    </div>
  );
};

export default Product;