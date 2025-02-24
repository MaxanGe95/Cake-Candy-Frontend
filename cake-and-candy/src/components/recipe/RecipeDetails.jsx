import React, { useState } from 'react';

const RecipeDetails = ({ recipe, onEdit }) => {
  const [scaleAmount, setScaleAmount] = useState(recipe.totalAmount);

  const calculateScaledIngredients = (recipe, scale) => {
    return recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      amount: (ingredient.amount * scale).toFixed(2)
    }));
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-teal-400">{recipe.name}</h3>
      <p>{recipe.description}</p>
      <h4 className="text-md font-semibold text-teal-300">Zutaten</h4>
      <ul>
        {calculateScaledIngredients(recipe, scaleAmount / recipe.totalAmount).map((ingredient, i) => (
          <li key={i}>{`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}</li>
        ))}
      </ul>
      <h4 className="text-md font-semibold text-teal-300">Hilfsmittel</h4>
      <p>{recipe.tools.join(', ')}</p>
      <h4 className="text-md font-semibold text-teal-300">Menge anpassen</h4>
      <input
        type="number"
        placeholder="Menge"
        value={scaleAmount}
        onChange={(e) => setScaleAmount(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={() => onEdit(recipe)} className="bg-teal-500 text-white p-2">Rezept bearbeiten</button>
    </div>
  );
};

export default RecipeDetails;