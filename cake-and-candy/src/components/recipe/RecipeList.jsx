import React, { useState, useEffect } from "react";
import { DeleteButton, EditButton } from "../form/Buttons";
import { InputNumber } from "../form/Inputs";
import { isAdmin } from "../../api/auth";

const RecipeList = ({ onDelete, onEdit }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [scaleAmount, setScaleAmount] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

        // Füge berechneten Prozentwert für die Zusatz-Spalte hinzu
        const recipesWithPercentage = recipesData.map(recipe => ({
          ...recipe,
          percentage: Math.round(
            ((recipe.istlagerbestand || 0) / (recipe.solllagerbestand || 100)) * 100
          )
        }));

        setRecipes(recipesWithPercentage);
      } catch (error) {
        console.error("❌ Fehler beim Laden der Rezeptdaten:", error);
      }
    };

    fetchData();
  }, []);

  // Mapping zwischen Tabellenkopfnamen und Objekteigenschaften
  const columnMapping = {
    "name": "name",
    "kategorie": "category",
    "hilfsmittel": "tools",
    "output": "totalAmount",
    "zutaten": "ingredients",
    "ist-bestand": "istlagerbestand",
    "soll-bestand": "solllagerbestand",
    "lagerstatus": "percentage" // Der berechnete Prozentwert
  };

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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    // Ermittle die tatsächliche Eigenschaft aus dem Mapping
    const property = columnMapping[key];
    
    const sortedRecipes = [...recipes].sort((a, b) => {
      // Hole die Werte für den Vergleich
      let aValue = a[property];
      let bValue = b[property];
      
      // Spezialbehandlung für Arrays (z.B. tools)
      if (Array.isArray(aValue)) {
        aValue = aValue.join(", ");
        bValue = bValue.join(", ");
      }
      
      // Spezialbehandlung für ingredients (Anzahl der Zutaten)
      if (property === "ingredients") {
        aValue = a.ingredients.length;
        bValue = b.ingredients.length;
      }

      // Falls die Werte Zahlen sind, sortiere als Zahlen
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Falls es Strings sind, sortiere lexikografisch
      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setSortConfig({ key, direction });
    setRecipes(sortedRecipes);
  };

  // Funktion zur Formatierung der Zelleninhalte
  const formatCellContent = (recipe, key) => {
    const property = columnMapping[key];
    const value = recipe[property];
    
    switch (key) {
      case "hilfsmittel":
        return Array.isArray(value) ? value.join(", ") : "";
      case "zutaten":
        return "Zutaten anzeigen";
      case "lagerstatus":
        return (
          <div className="relative w-full h-6 bg-gray-300 rounded-lg">
            <div
              className={`
                absolute top-0 left-0  h-6 rounded-lg
                flex items-center ${
                  (recipe.istlagerbestand || 0) / (recipe.solllagerbestand || 100) < 0.2
                    ? "justify-start pl-2"
                    : "justify-center"
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
                width: `${recipe.percentage}%`,
                maxWidth: "100%",
              }}
            >
              <span
                className={`${
                  (recipe.istlagerbestand || 0) / (recipe.solllagerbestand || 100) < 0.2
                    ? "text-black"
                    : "text-white"
                } font-bold`}
              >
                {recipe.percentage}%
              </span>
            </div>
          </div>
        );
      default:
        return value;
    }
  };

  return (
    <div className="mt-10">
      <h4 className="text-2xl font-bold text-teal-200 mb-1">Rezepte-Liste</h4>
      <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
        <thead className="bg-teal-950">
          <tr>
            {[
              "name",
              "kategorie", 
              "hilfsmittel", 
              "output", 
              "zutaten",
              "ist-bestand", 
              "soll-bestand",
              "lagerstatus", 
            ].map((key) => (
              <th
                key={key}
                className="p-2 cursor-pointer hover:bg-teal-900"
                onClick={() => handleSort(key)}
              >
                <div className="">
                  <span>{key.toUpperCase()}</span>
                  {sortConfig.key === key && (
                    <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
            ))}
            {isAdmin() && <th className="p-2">Aktionen</th>}
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <React.Fragment key={recipe._id}>
              <tr
                className="border cursor-pointer hover:bg-[#7ec6cc80] transition duration-200"
                onClick={() => toggleDropdown(recipe)}
              >
                {[
                  "name",
                  "kategorie", 
                  "hilfsmittel", 
                  "output", 
                  "zutaten",
                  "ist-bestand", 
                  "soll-bestand",
                  "lagerstatus", 
                ].map((key) => (
                  <td key={key} className="p-2 text-center">
                    {formatCellContent(recipe, key)}
                  </td>
                ))}
                
                {isAdmin() && (
                  <td className="p-2 text-center">
                    <EditButton onClick={(e) => {
                      e.stopPropagation();
                      onEdit(recipe);
                    }}>
                      Rezept bearbeiten
                    </EditButton>
                    <DeleteButton onClick={(e) => {
                      e.stopPropagation();
                      onDelete(recipe._id);
                    }} />
                  </td>
                )}
              </tr>
              {selectedRecipe && selectedRecipe._id === recipe._id && (
                <tr>
                  <td colSpan={isAdmin() ? 9 : 8} className="p-4">
                    <div className="bg-[#7ec6cc33] rounded-md shadow-lg p-4">
                      <table className="bg-teal-950 min-w-full rounded-md overflow-hidden">
                        <thead className="bg-teal-900 text-amber-100 rounded-t-md">
                          <tr>
                            <th className="p-2">Zutaten</th>
                            <th className="p-2">Menge</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-center">
                            <td className="p-2">
                              <ul>
                                {calculateScaledIngredients(
                                  selectedRecipe,
                                  scaleAmount / selectedRecipe.totalAmount
                                ).map((ingredient, i) => (
                                  <li key={i}>{ingredient.name}</li>
                                ))}
                              </ul>
                            </td>
                            <td className="p-2">
                              <ul>
                                {calculateScaledIngredients(
                                  selectedRecipe,
                                  scaleAmount / selectedRecipe.totalAmount
                                ).map((ingredient, i) => (
                                  <li key={i}>{ingredient.amount}</li>
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