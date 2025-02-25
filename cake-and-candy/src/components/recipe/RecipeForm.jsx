import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { IconChevronDown } from "@tabler/icons-react";
import { fetchZutaten } from "../../api/zutaten"; // Importiere die Methode

const unitsList = ["g", "kg", "ml", "l", "Stück"];

const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const [newRecipe, setNewRecipe] = useState(recipe);
  const [errors, setErrors] = useState({});
  const [ingredientsList, setIngredientsList] = useState([]); // Zustand für Zutatenliste

  useEffect(() => {
    const loadZutaten = async () => {
      try {
        const data = await fetchZutaten();
        setIngredientsList(data); // Zutatenliste im Zustand setzen
      } catch (error) {
        console.error("Fehler beim Laden der Zutaten:", error);
      }
    };

    loadZutaten(); // Zutatenliste beim Laden der Komponente abrufen
  }, []);

  const addIngredient = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [
        ...newRecipe.ingredients,
        { name: "", amount: 0, unit: "" },
      ],
    });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = newRecipe.ingredients.filter(
      (_, i) => i !== index
    );
    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = newRecipe.ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
    validateField(`ingredient${index}${field}`, value);
  };

  const handleRecipeChange = (field, value) => {
    setNewRecipe({ ...newRecipe, [field]: value });
    validateField(field, value);
  };

  const validateField = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: !value,
    }));
  };

  const validateRecipe = () => {
    const newErrors = {};
    if (!newRecipe.name) newErrors.name = true;
    if (!newRecipe.description) newErrors.description = true;
    if (!newRecipe.totalAmount) newErrors.totalAmount = true;
    newRecipe.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name) newErrors[`ingredient${index}name`] = true;
      if (!ingredient.amount) newErrors[`ingredient${index}amount`] = true;
      if (!ingredient.unit) newErrors[`ingredient${index}unit`] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveRecipe = () => {
    if (!validateRecipe()) {
      alert("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }
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
        className={`border p-2 mb-2 w-full ${
          errors.name ? "border-red-500" : ""
        }`}
      />
      <textarea
        placeholder="Beschreibung"
        value={newRecipe.description}
        onChange={(e) => handleRecipeChange("description", e.target.value)}
        className={`border p-2 mb-2 w-full resize-none ${
          errors.description ? "border-red-500" : ""
        }`}
        rows={Math.max(3, newRecipe.description.split("\n").length)}
      />
      <h3 className="text-lg font-semibold text-teal-400">Zutaten</h3>
      {newRecipe.ingredients.map((ingredient, index) => (
        <div key={index} className="flex mb-2 items-center -mx-1">
          <div className="relative w-2/4 mx-1">
            <select
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, "name", e.target.value)
              }
              className={`block appearance-none w-full border px-4 py-2 pr-8 rounded shadow leading-tight h-10 focus:outline-none focus:shadow-outline ${
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
              <IconChevronDown className="w-4 h-4" />
            </div>
          </div>
          <input
            type="number"
            placeholder="Menge"
            value={ingredient.amount}
            onChange={(e) =>
              handleIngredientChange(index, "amount", e.target.value)
            }
            className={`border p-2 m-1 w-1/4 h-10 rounded ${
              errors[`ingredient${index}amount`] ? "border-red-500" : ""
            }`}
          />
          <div className="relative w-1/4 m-1">
            <select
              value={ingredient.unit}
              onChange={(e) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
              className={`block appearance-none w-full border px-4 py-2 pr-8 rounded shadow leading-tight h-10 focus:outline-none focus:shadow-outline ${
                errors[`ingredient${index}unit`] ? "border-red-500" : ""
              }`}
            >
              <option value="">Einheit wählen</option>
              {unitsList.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <IconChevronDown className="w-4 h-4" />
            </div>
          </div>
          <button
            onClick={() => removeIngredient(index)}
            className="bg-red-500 text-white m-1 p-2 cursor-pointer h-10 w-10 transition ease-in-out hover:scale-110 "
          >
            <FaTrash className="m-auto" />
          </button>
        </div>
      ))}
      <button
        onClick={addIngredient}
        className="bg-teal-500 text-white p-2 mb-2"
      >
        Zutat hinzufügen
      </button>
      <h3 className="text-lg font-semibold text-teal-400">Hilfsmittel</h3>
      <input
        type="text"
        placeholder="Hilfsmittel"
        value={newRecipe.tools.join(", ")}
        onChange={(e) =>
          handleRecipeChange("tools", e.target.value.split(", "))
        }
        className="border p-2 mb-2 w-full"
      />
      <h3 className="text-lg font-semibold text-teal-400">Gesamtmenge</h3>
      <input
        type="number"
        placeholder="Gesamtmenge"
        value={newRecipe.totalAmount}
        onChange={(e) => handleRecipeChange("totalAmount", e.target.value)}
        className={`border p-2 mb-2 w-full ${
          errors.totalAmount ? "border-red-500" : ""
        }`}
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