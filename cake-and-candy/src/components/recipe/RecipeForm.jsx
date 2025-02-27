import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { fetchZutaten } from "../../api/zutaten";

const toolsList = ["Industrietopf", "Pralinenform", "Tafelform", "Kaffeemühle", "Backblech"];
const categoryOptions = [
  "Pralinen", "Tafeln", "Kuchen", "Torten", "Backwaren", "Süßes", "Getränke", 
  "Zwischenprodukte", "Kooperationsprodukte", "Saisonprodukte", "Sonstiges"
];

const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const [newRecipe, setNewRecipe] = useState({
    name: recipe?.name || "",
    tools: recipe?.tools || [],
    category: recipe?.category || "",
    totalAmount: recipe?.totalAmount || "",
    ingredients: recipe?.ingredients || []
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
      ingredients: [...newRecipe.ingredients, { name: "", amount: 0, ekPreis: 0 }]
    });
  };

  const removeIngredient = (index) => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const handleIngredientSelect = (index, ingredientName) => {
    const selectedIngredient = ingredientsList.find((ing) => ing.name === ingredientName);
    if (selectedIngredient) {
      setNewRecipe((prev) => ({
        ...prev,
        ingredients: prev.ingredients.map((ing, i) =>
          i === index ? { ...ing, name: ingredientName, ekPreis: selectedIngredient.ekPreis } : ing
        )
      }));
    }
  };

  const handleRecipeChange = (field, value) => {
    setNewRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const validateRecipe = () => {
    const newErrors = {};
    if (!newRecipe.name) newErrors.name = true;
    if (!newRecipe.totalAmount) newErrors.totalAmount = true;

    newRecipe.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name) newErrors[`ingredient${index}_name`] = true;
      if (!ingredient.amount) newErrors[`ingredient${index}_amount`] = true;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveRecipe = async () => {
    if (!validateRecipe()) {
      alert("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }

    const totalCost = newRecipe.ingredients.reduce((sum, ingredient) => {
      return sum + (ingredient.amount * ingredient.ekPreis);
    }, 0);

    const unitPrice = totalCost / newRecipe.totalAmount;

    if (isNaN(unitPrice) || unitPrice <= 0) {
      alert("Der unitPrice ist ungültig.");
      return;
    }

    const recipeType = newRecipe.category === "Zwischenprodukte" ? "Zwischenprodukt" : "Endprodukt";

    const finalRecipe = {
      ...newRecipe,
      totalCost,
      unitPrice,
      typ: recipeType,
    };

    try {
      const response = await fetch("http://localhost:5000/api/rezepte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalRecipe),
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Speichern des Rezepts: ${response.statusText}`);
      }

      const savedRecipe = await response.json();
      onSave(savedRecipe);
    } catch (error) {
      console.error("Fehler beim Speichern des Rezepts:", error);
      alert(`Es gab einen Fehler beim Speichern des Rezepts: ${error.message}`);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-teal-300">
        {recipe?.id ? "Rezept bearbeiten" : "Neues Rezept"}
      </h2>

      <input
        type="text"
        placeholder="Rezeptname"
        value={newRecipe.name}
        onChange={(e) => handleRecipeChange("name", e.target.value)}
        className={`border p-2 mb-2 w-full ${errors.name ? "border-red-500" : ""}`}
      />

      <select
        value={newRecipe.category}
        onChange={(e) => handleRecipeChange("category", e.target.value)}
        className="border p-2 mb-2 w-full bg-amber-400"
      >
        <option value="">Kategorie wählen</option>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <h3 className="text-lg font-semibold text-teal-400">Zutaten</h3>
      {newRecipe.ingredients.map((ingredient, index) => (
        <div key={index} className="flex mb-2 items-center">
          <select
            value={ingredient.name}
            onChange={(e) => handleIngredientSelect(index, e.target.value)}
            className="border p-2 mb-2 w-1/2 bg-amber-400"
          >
            <option value="">Zutat wählen</option>
            {ingredientsList.map((item) => (
              <option key={item._id} value={item.name}>{item.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Menge"
            value={ingredient.amount}
            onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
            className="border p-2 mb-2 w-1/4"
          />
          <button onClick={() => removeIngredient(index)} className="bg-red-500 text-white p-2">X</button>
        </div>
      ))}
      <button onClick={addIngredient} className="bg-teal-500 text-white p-2">Zutat hinzufügen</button>

      <h3 className="text-lg font-semibold text-teal-400">Hilfsmittel</h3>
      <select
        value={Array.isArray(newRecipe.tools) ? newRecipe.tools[0] || "" : newRecipe.tools}
        onChange={(e) => handleRecipeChange("tools", [e.target.value])}
        className="border p-2 mb-2 w-full bg-amber-400"
      >
        <option value="">Hilfsmittel wählen</option>
        {toolsList.map((tool) => (
          <option key={tool} value={tool}>{tool}</option>
        ))}
      </select>

      <h3 className="text-lg font-semibold text-teal-400">Outputmenge</h3>
      <input
        type="number"
        placeholder="Gesamtmenge"
        value={newRecipe.totalAmount}
        onChange={(e) => handleRecipeChange("totalAmount", e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <button onClick={saveRecipe} className="bg-teal-600 text-white p-2">Speichern</button>
      <button onClick={onCancel} className="bg-gray-500 text-white p-2 ml-2">Abbrechen</button>
    </div>
  );
};

export default RecipeForm;
