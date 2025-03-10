import { useState, useEffect } from "react";
import RecipeForm from "../components/recipe/RecipeForm";
import RecipeList from "../components/recipe/RecipeList";
import { fetchZutaten } from "../api/zutaten";
import { fetchRezepte, deleteRezept } from "../api/rezepte";
import { PrimaryButton } from "../components/form/Buttons";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredientsList, setIngredientsList] = useState([]);

  // Zutaten und Rezepte aus dem Backend laden
  useEffect(() => {
    loadZutaten();
    loadRezepte();
  }, []);

  const loadRezepte = async () => {
    try {
      const data = await fetchRezepte();
      setRecipes(data);
    } catch (error) {
      console.error("Fehler beim Laden der Rezepte:", error);
    }
  };

  const loadZutaten = async () => {
    try {
      const data = await fetchZutaten();
      setIngredientsList(data);
    } catch (error) {
      console.error("Fehler beim Laden der Zutaten:", error);
    }
  };

  const handleSaveRecipe = (recipe) => {
    console.log("Rezept gespeichert:", recipe);
    loadRezepte(); // Rezepte neu laden
    setSelectedRecipe(null); // Rezept zurücksetzen
  };

  const handleEditRecipe = (recipe) => {
    // Rezept zum Bearbeiten setzen
    setSelectedRecipe(recipe);
  };

  const handleDeleteRecipe = async (id) => {
    await deleteRezept(id);
    loadRezepte(); // Rezepte nach dem Löschen neu laden
    setSelectedRecipe(null); // Ausgewähltes Rezept zurücksetzen
  };

  const handleCancel = () => {
    setSelectedRecipe(null); // Abbrechen setzt das Rezept zurück
  };

  const handleNewRecipe = () => {
    setSelectedRecipe({
      name: "",
      ingredients: [{ name: "", amount: 0, ekPreis: 0 }],
      tools: [],
      totalAmount: 1,
    }); // Leeres Rezept für neues Rezept
  };

  return (
    <div className="p-8 text-amber-100">
      {/* Rezeptformular immer sichtbar */}
      <RecipeForm
        recipe={selectedRecipe || {
          name: "",
          ingredients: [{ name: "", amount: 0, ekPreis: 0 }],
          tools: [],
          totalAmount: 1,
        }}
        onSave={handleSaveRecipe}
        onCancel={handleCancel}
        ingredientsList={ingredientsList}
      />

      {/* Rezeptliste immer sichtbar */}
      <RecipeList
        recipes={recipes}
        onSelect={setSelectedRecipe} // Rezept in der Liste auswählen
        onDelete={handleDeleteRecipe}
        onEdit={handleEditRecipe} // Rezept in der Liste bearbeiten
      />
      
      {/* Button zum Hinzufügen eines neuen Rezepts */}
      {/* <PrimaryButton onClick={handleNewRecipe} className="mb-4 mt-10">
        Neues Rezept hinzufügen
      </PrimaryButton> */}
    </div>
  );
};

export default Recipes;
