import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { IconChevronDown } from "@tabler/icons-react";
import { fetchZutaten } from "../../api/zutaten";

const toolsList = ["Industrietopf", "Pralinenform", "Tafelform", "Kaffeemühle", "Backblech"];
const categoryOptions = [
  "Pralinen", "Tafeln", "Kuchen", "Torten", "Backwaren", "Süßes", "Getränke", 
  "Zwischenprodukte", "Kooperationsprodukte", "Saisonprodukte", "Sonstiges"
];

const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const [newRecipe, setNewRecipe] = useState({
    ...recipe,
    tools: recipe.tools || "", // Sicherstellen, dass tools ein String ist
    category: recipe.category || "" // Kategorie hinzufügen
  });

  const [errors, setErrors] = useState({});
  const [ingredientsList, setIngredientsList] = useState([]);

  useEffect(() => {
    const loadZutaten = async () => {
      try {
        const data = await fetchZutaten();
        setIngredientsList(data);
      } catch (error) {
        console.error("Fehler beim Laden der Zutaten:", error);
      }
    };

    loadZutaten();
  }, []);

  const addIngredient = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { name: "", amount: 0 }]
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = newRecipe.ingredients.filter((_, i) => i !== index);
    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = newRecipe.ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
  };

  const handleRecipeChange = (field, value) => {
    setNewRecipe({ ...newRecipe, [field]: value });
  };

  const validateRecipe = () => {
    const newErrors = {};
    if (!newRecipe.name) newErrors.name = true;
    if (!newRecipe.totalAmount) newErrors.totalAmount = true;
    newRecipe.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name) newErrors[`ingredient${index}name`] = true;
      if (!ingredient.amount) newErrors[`ingredient${index}amount`] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveRecipe = () => {
    if (!validateRecipe()) {
      alert("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }
    
    console.log("Rezept-Daten vor dem Speichern:", JSON.stringify(newRecipe, null, 2));
    onSave(newRecipe);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-teal-300">
        {recipe.id ? "Rezept bearbeiten" : "Neues Rezept"}
      </h2>
      <input
        type="text"
        placeholder="Rezeptname"
        value={newRecipe.name}
        onChange={(e) => handleRecipeChange("name", e.target.value)}
        className={`border p-2 mb-2 w-full ${errors.name ? "border-red-500" : ""}`}
      />
      {/* Dropdown für Kategorie */}
      <select
        value={newRecipe.category}
        onChange={(e) => handleRecipeChange("category", e.target.value)}
        className={`border p-2 mb-2 w-full  bg-amber-400 ${errors.category ? "border-red-500" : ""}`}
      >
        <option value="">Kategorie wählen</option>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <h3 className="text-lg font-semibold text-teal-400">Zutaten</h3>
      {newRecipe.ingredients.map((ingredient, index) => (
        <div key={index} className="flex mb-2 items-center -mx-1">
          <div className="relative w-2/4 mx-1">
            <select
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
              className={`block bg-amber-400 appearance-none w-full border px-4 py-2 pr-8 rounded shadow leading-tight h-10 focus:outline-none focus:shadow-outline ${
                errors[`ingredient${index}name`] ? "border-red-500" : ""
              }`}
            >
              <option value="">Zutat wählen</option>
              {ingredientsList.map((ingredientItem) => (
                <option key={ingredientItem._id} value={ingredientItem.name}>
                  {ingredientItem.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              X
            </div>
          </div>
          <h4 className="text-sm font-medium text-gray-700 ml-2">Menge</h4>
          <input
            type="number"
            placeholder="Menge"
            value={ingredient.amount}
            onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
            className={`border p-2 m-1 w-1/4 h-10 rounded ${errors[`ingredient${index}amount`] ? "border-red-500" : ""}`}
          />
          <button
            onClick={() => removeIngredient(index)}
            className="bg-red-500 text-white m-1 p-2 cursor-pointer h-10 w-10 transition ease-in-out hover:scale-110 "
          >
            X
          </button>
        </div>
      ))}
      <button onClick={addIngredient} className="bg-teal-500 text-white p-2 mb-2">
        Zutat hinzufügen
      </button>
      <h3 className="text-lg font-semibold text-teal-400">Hilfsmittel</h3>
      <select
        value={Array.isArray(newRecipe.tools) ? newRecipe.tools[0] || "" : newRecipe.tools}
        onChange={(e) => handleRecipeChange("tools", e.target.value)}
        className="border p-2 mb-2 w-full bg-amber-400 appearance-none w-full border px-4 py-2 pr-8 rounded shadow leading-tight"
      >
        <option value="">Hilfsmittel wählen</option>
        {toolsList.map((tool) => (
          <option key={tool} value={tool}>
            {tool}
          </option>
        ))}
      </select>
      <h3 className="text-lg font-semibold text-teal-400">Output</h3>
      <input
        type="number"
        placeholder="Gesamtmenge"
        value={newRecipe.totalAmount}
        onChange={(e) => handleRecipeChange("totalAmount", e.target.value)}
        className={`border p-2 mb-2 w-full ${errors.totalAmount ? "border-red-500" : ""}`}
      />
      <button onClick={saveRecipe} className="bg-teal-600 text-white p-2">
        {recipe.id ? "Rezept aktualisieren" : "Rezept speichern"}
      </button>
      <button onClick={onCancel} className="bg-gray-500 text-white p-2 ml-2">
        Abbrechen
      </button>
    </div>
  );
};

export default RecipeForm;