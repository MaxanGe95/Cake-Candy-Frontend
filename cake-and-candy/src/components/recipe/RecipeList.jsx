import React, { useState } from "react";
import { DeleteButton, EditButton } from "../form/Buttons";
import { InputNumber } from "../form/Inputs";

const RecipeList = ({ recipes, onDelete, onEdit }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [scaleAmount, setScaleAmount] = useState(0);

  // const calculateScaledIngredients = (recipe, scale) => {
  //   return recipe.ingredients.map((ingredient) => ({
  //     ...ingredient,
  //     amount: (ingredient.amount * scale).toFixed(2),
  //   }));
  // };
  const calculateScaledIngredients = (recipe, scale) => {
    return recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      // Math.round(), um die Menge auf die nächste ganze Zahl zu runden
      amount: Math.round(ingredient.amount * scale),
    }));
  };
  const calculateIngredientTotalPrice = (ingredient) => {
    const amount = parseFloat(ingredient.amount);
    const ekPreis = parseFloat(ingredient.ekPreis);
    return amount * ekPreis;
  };

  const calculateTotalPrice = (ingredients) => {
    return ingredients.reduce(
      (total, ingredient) => total + calculateIngredientTotalPrice(ingredient),
      0
    );
  };

  const round = (calc) => {
    return "$" + (calc || 0).toFixed(2);
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setScaleAmount(recipe.totalAmount);
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null);
  };

  const toggleDropdown = (recipe) => {
    if (selectedRecipe && selectedRecipe._id === recipe._id) {
      handleCloseDetails();
    } else {
      handleSelectRecipe(recipe);
    }
  };

  return (
    <div className="mt-10">
      <h4 className="text-2xl font-bold text-teal-200 mb-1">Rezepte-Liste</h4>
      <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
        <thead className="bg-teal-950">
          <tr>
            <th className="p-2">Rezeptname</th>
            <th className="p-2">Kategorie</th>
            <th className="p-2">Hilfsmittel</th>
            <th className="p-2">Output</th>
            <th className="p-2">Zutaten</th>
            {/* <th className="p-2">Menge</th> */}
            <th className="p-2">Istbestand</th>
            <th className="p-2">Sollbestand</th>
            <th className="p-2">Zusatz</th>
            <th className="p-2">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <React.Fragment key={recipe._id}>
              <tr
                className="border cursor-pointer hover:bg-[#7ec6cc80]"
                onClick={() => toggleDropdown(recipe)}
              >
                <td className="p-2 text-center">{recipe.name}</td>
                <td className="p-2 text-center">{recipe.category}</td>
                <td className="p-2 text-center">{recipe.tools?.join(", ")}</td>
                <td className="p-2 text-center">{recipe.totalAmount}</td>
                <td className="p-2 text-center">Zutaten anzeigen</td>
                {/* <td className="p-2 text-center">{recipe.totalAmount}</td> */}
                <td className="p-2 text-center">{recipe.istlagerbestand}</td>
                <td className="p-2 text-center">{recipe.solllagerbestand}</td>
                <td className="p-2 text-center">-</td>
                <td className="p-2 text-center">
                  <EditButton onClick={() => onEdit(recipe)}>
                    Rezept bearbeiten
                  </EditButton>
                  <DeleteButton onClick={() => onDelete(recipe._id)} />
                </td>
              </tr>
              {selectedRecipe && selectedRecipe._id === recipe._id && (
                <tr>
                  <td colSpan="9" className="p-4">
                    <div className="bg-[#7ec6cc33] rounded-md shadow-lg p-4">
                      <table className=" bg-teal-950 min-w-full rounded-md overflow-hidden">
                        <thead className="bg-teal-900  text-amber-100 rounded-t-md">
                          <tr>
                            <th className="p-2">Zutaten</th>
                            <th className="p-2">Stück</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-center ">
                            <td className="p-2 ">
                              <ul>
                                {calculateScaledIngredients(
                                  selectedRecipe,
                                  scaleAmount / selectedRecipe.totalAmount
                                ).map((ingredient, i) => (
                                  <li key={i}>{`${ingredient.name}`}</li>
                                ))}
                              </ul>
                            </td>
                            <td className="p-2">
                              <ul>
                                {calculateScaledIngredients(
                                  selectedRecipe,
                                  scaleAmount / selectedRecipe.totalAmount
                                ).map((ingredient, i) => (
                                  <li key={i}>{`${ingredient.amount}`}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {/* <button
                        className="bg-teal-950 text-amber-100 p-2 rounded-md hover:bg-teal-800 transition duration-200"
                        onClick={handleCloseDetails}
                      >
                        Zurück
                      </button> */}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeList;
