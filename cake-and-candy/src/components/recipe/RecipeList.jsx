import React from 'react';

const RecipeList = ({ recipes, onSelect, onDelete }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-500">Gespeicherte Rezepte</h2>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index} className="border-t py-2 flex justify-between items-center">
            <span className="cursor-pointer" onClick={() => onSelect(recipe)}>
              {recipe.name}
            </span>
            <button onClick={() => onDelete(recipe.id)} className="bg-red-500 text-white p-2 ml-2">Löschen</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;