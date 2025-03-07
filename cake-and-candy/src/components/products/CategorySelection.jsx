import React, { useState } from 'react';

const CategorySelection = ({ categories, onCategorySelect }) => {
  return (
    <div className="flex flex-wrap justify-center items-center">
      {categories.map((category, index) => (
        <div
          key={index}
          className="relative m-4 w-80 h-40 text-white transform skew-x-1 shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
          onClick={() => onCategorySelect(category)}
        >
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-xl font-bold bg-teal-500/50 p-2 rounded-xl ">{category.name}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export { CategorySelection };
