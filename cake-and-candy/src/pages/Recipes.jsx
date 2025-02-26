import React, { useState, useEffect } from 'react';
import RecipeForm from '../components/recipe/RecipeForm';
import RecipeList from '../components/recipe/RecipeList';
import RecipeDetails from '../components/recipe/RecipeDetails';
import { fetchZutaten } from '../api/zutaten'; // Importiere deine API-Funktion

const initialRecipes = [
  // Hier können initiale Rezeptdaten stehen
];

const Recipes = () => {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [ingredientsList, setIngredientsList] = useState([]); // Zutatenliste hinzufügen

  // Zutaten aus dem Backend laden
  useEffect(() => {
    const loadZutaten = async () => {
      try {
        const data = await fetchZutaten();
        setIngredientsList(data); // Zutatenliste im State speichern
      } catch (error) {
        console.error("Fehler beim Laden der Zutaten:", error);
      }
    };

    loadZutaten();
  }, []);

  // Berechnung des Gesamtpreises pro Zutat und Hinzufügen zu den Rezeptdaten
  const calculateIngredientTotalPrice = (ingredient) => {
    const amount = parseFloat(ingredient.amount); // amount als Zahl
    const ekPreis = parseFloat(ingredient.ekPreis); // ekPreis als Zahl
    return amount * ekPreis; // Berechnung des Gesamtpreises
  };

  // Berechnung des Gesamtpreises aller Zutaten im Rezept
  const calculateTotalPrice = (ingredients) => {
    return ingredients.reduce((total, ingredient) => total + calculateIngredientTotalPrice(ingredient), 0);
  };

  const handleSaveRecipe = (recipe) => {
    // Berechne totalPrice für jede Zutat
    const updatedIngredients = recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      totalprice: calculateIngredientTotalPrice(ingredient),
    }));
  
    // Berechne den Gesamtpreis des Rezepts
    const totalCost = calculateTotalPrice(updatedIngredients);
    const totalAmount = parseFloat(recipe.totalAmount) || 1; // Sicherstellen, dass totalAmount eine Zahl ist
    const unitPrice = totalCost / totalAmount; // Berechnung des Einzelpreises
  
    const updatedRecipe = {
      ...recipe,
      ingredients: updatedIngredients,
      totalCost: Number(totalCost.toFixed(2)), // Als Zahl speichern
      unitPrice: Number(unitPrice.toFixed(2)), // Einheitspreis mit 2 Nachkommastellen als Zahl
    };
  
    console.log("Gespeichertes Rezept:", updatedRecipe); // Debugging-Ausgabe
  
    if (editMode) {
      const updatedRecipes = recipes.map((r) => (r.id === recipe.id ? updatedRecipe : r));
      setRecipes(updatedRecipes);
      setEditMode(false);
    } else {
      setRecipes([...recipes, { ...updatedRecipe, id: recipes.length + 1 }]);
    }
  
    setShowNewRecipeForm(false);
    setSelectedRecipe(null);
  };
  
  

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowNewRecipeForm(true);
    setEditMode(true);
  };

  const handleDeleteRecipe = (id) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
    setRecipes(updatedRecipes);
    setSelectedRecipe(null);
  };

  const handleCancel = () => {
    setShowNewRecipeForm(false);
    setSelectedRecipe(null);
    setEditMode(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-teal-200 mb-4">Rezeptübersicht</h1>
      <button onClick={() => setShowNewRecipeForm(true)} className="bg-teal-600 text-white p-2 mb-4">
        Neu
      </button>
      {showNewRecipeForm && (
        <RecipeForm
          recipe={selectedRecipe || { name: '', ingredients: [{ name: '', amount: 0, ekPreis: 0 }], tools: [], totalAmount: 1 }}
          onSave={handleSaveRecipe}
          onCancel={handleCancel}
          ingredientsList={ingredientsList} // Zutatenliste als Prop an RecipeForm übergeben
        />
      )}
      <RecipeList recipes={recipes} onSelect={setSelectedRecipe} onDelete={handleDeleteRecipe} />
      {selectedRecipe && !showNewRecipeForm && (
        <div>
          <RecipeDetails recipe={selectedRecipe} onEdit={handleEditRecipe} />
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-teal-300">Gesamtpreis der Zutaten</h3>
            <ul>
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index} className="mb-2">
                  <strong>{ingredient.name}:</strong> {ingredient.totalprice.toFixed(2)} €
                </li>
              ))}
            </ul>
            <p className="text-lg">
              Gesamtpreis der Zutaten: {calculateTotalPrice(selectedRecipe.ingredients).toFixed(2)} €
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
