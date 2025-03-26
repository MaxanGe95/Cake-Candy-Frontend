import React, { useState, useEffect } from "react";
import { DeleteButton, EditButton } from "../form/Buttons";
import { InputNumber } from "../form/Inputs";
import { isAdmin } from "../../api/auth";

const RecipeList = ({ onDelete, onEdit }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [scaleAmount, setScaleAmount] = useState(0);

  // Rezepte und Lagerbestand abrufen
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rezepte");

        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Rezeptdaten");
        }

        const recipesData = await response.json();
        console.log("🔍 Rezepte aus API:", recipesData);

        setRecipes(recipesData);
      } catch (error) {
        console.error("❌ Fehler beim Laden der Rezeptdaten:", error);
      }
    };

    fetchData();
  }, []);

  const calculateScaledIngredients = (recipe, scale) => {
    return recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      amount: Math.round(ingredient.amount * scale),
    }));
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
            <th className="p-2">Istbestand</th>
            <th className="p-2">Sollbestand</th>
            <th className="p-2">Zusatz</th>
            {isAdmin() && <th className="p-2">Aktionen</th>}
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
                <td className="p-2 text-center">{recipe.istlagerbestand}</td>
                <td className="p-2 text-center">{recipe.solllagerbestand}</td>
                
                {/* //zusatz */}
                <td className="p-2 text-center text-sm">
                  <div className="relative w-full h-6 bg-gray-300 rounded-lg">
                    <div
                      className={`
        absolute top-0 left-0 h-6 rounded-lg
        flex items-center ${
          (recipe.istlagerbestand || 0) / (recipe.solllagerbestand || 100) < 0.2
            ? "justify-start pl-2" // Prozentzahl links, wenn Balken sehr klein
            : "justify-center" // Prozentzahl mittig bei größerem Balken
        }
        ${
          recipe.istlagerbestand < (recipe.solllagerbestand || 100) * 0.25
            ? "bg-red-500"
            : recipe.istlagerbestand < (recipe.solllagerbestand || 100) * 0.5
            ? "bg-orange-500"
            : recipe.istlagerbestand < (recipe.solllagerbestand || 100) * 0.75
            ? "bg-yellow-500"
            : "bg-green-500"
        }
      `}
                      style={{
                        width: `${
                          ((recipe.istlagerbestand || 0) /
                            (recipe.solllagerbestand || 100)) *
                          100
                        }%`,
                        maxWidth: "100%",
                      }}
                    >
                      <span
                        className={`${
                          (recipe.istlagerbestand || 0) /
                            (recipe.solllagerbestand || 100) <
                          0.2
                            ? "text-black" // Textfarbe ändern, wenn der Balken schmal ist
                            : "text-white"
                        } font-bold`}
                      >
                        {Math.round(
                          ((recipe.istlagerbestand || 0) /
                            (recipe.solllagerbestand || 100)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </td>

                {isAdmin() && (
                  <td className="p-2 text-center">
                    <EditButton onClick={() => onEdit(recipe)}>
                      Rezept bearbeiten
                    </EditButton>
                    <DeleteButton onClick={() => onDelete(recipe._id)} />
                  </td>
                )}
              </tr>
              {selectedRecipe && selectedRecipe._id === recipe._id && (
                <tr>
                  <td colSpan="8" className="p-4">
                    <div className="bg-[#7ec6cc33] rounded-md shadow-lg p-4">
                      <table className=" bg-teal-950 min-w-full rounded-md overflow-hidden">
                        <thead className="bg-teal-900  text-amber-100 rounded-t-md">
                          <tr>
                            <th className="p-2">Zutaten</th>
                            <th className="p-2">Menge</th>
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
