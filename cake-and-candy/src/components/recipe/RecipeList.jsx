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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    /* const sortedRecipes = [...recipes].sort((a, b) => {
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";

      // Falls die Werte Zahlen sind, sortiere als Zahlen
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      } */

        const sortedData = [...recipes].map((recipe) => {
          // Prozentwert für die Zusatz-Spalte berechnen und hinzufügen
          const zusatzWert = Math.round(
            ((recipe.istlagerbestand || 0) / (recipe.solllagerbestand || 100)) * 100
          );
          return { ...recipe, zusatzWert }; // Prozentwert ins Objekt einfügen
        });
    
        const finalSortedData = sortedData.sort((a, b) => {
          const aValue = a[key] ?? "";
          const bValue = b[key] ?? "";
    
          const numberKeys = {
            "ek-Preis": "ekPreis",
            "b2b-Preis": "b2bPreis",
            "b2c-Preis": "b2cPreis",
            "ist-lagerbestand": "istlagerbestand",
            "soll-lagerbestand": "solllagerbestand",
            zusatz: "zusatzWert", // Hier der berechnete Prozentwert!
          };
    
          const mappedKey = numberKeys[key] || key;
    
          // Sortierung nach Zahlenwerten
          if (numberKeys[key] && typeof a[mappedKey] === "number") {
            return direction === "asc"
              ? a[mappedKey] - b[mappedKey]
              : b[mappedKey] - a[mappedKey];
          }
    
          // Allgemeine Zahlenerkennung für andere Felder
          const isNumber = !isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue));
          if (isNumber) {
            return direction === "asc"
              ? parseFloat(aValue) - parseFloat(bValue)
              : parseFloat(bValue) - parseFloat(aValue);
          }
    

      // Falls es Strings sind, sortiere lexikografisch
      return direction === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });

    setSortConfig({ key, direction });
    setRecipes(finalSortedData); // sortierte Liste direkt speichern
  };

  return (
    <div className="mt-10">
      <h4 className="text-2xl font-bold text-teal-200 mb-1">Rezepte-Liste</h4>
      <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
        <thead className="bg-teal-950">
          <tr>
            {[
              "name", // statt "rezeptname"
              "kategorie", 
              "hilfsmittel", 
              "output", 
              "zutaten",
              "ist-bestand", 
              "soll-bestand",
              "zusatz", 
            ].map((key) => (
              <th
                key={key}
                className="p-2 cursor-pointer"
                onClick={() => handleSort(key)}
              >
                {key.toUpperCase()}{" "}
                {sortConfig.key === key
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
            ))}
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
