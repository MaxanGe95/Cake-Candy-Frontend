import React from "react";
import "./CategorySelection.css"; // Importiere die CSS-Datei

const CategorySelection = ({ categories, onCategorySelect }) => {
  return (
    <div className="flex flex-wrap justify-center items-center">
      {categories.map((category, index) => (
        <div
          key={index}
          className="category-item relative m-4 w-120 h-80 transform skew-x-1 shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
          style={{ animationDelay: `${index * (Math.random() / 4 + 0.1)}s` }}
          onClick={() => onCategorySelect(category)}
        >
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-bold bg-teal-950/70 p-2 rounded-xl">
              {category.name}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export { CategorySelection };
