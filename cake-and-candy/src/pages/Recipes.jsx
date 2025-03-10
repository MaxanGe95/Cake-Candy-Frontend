import { useState, useEffect } from "react";
import RecipeForm from "../components/recipe/RecipeForm";
import RecipeList from "../components/recipe/RecipeList";
// import RecipeDetails from "../components/recipe/RecipeDetails";
import { fetchZutaten } from "../api/zutaten";
import { fetchRezepte, deleteRezept } from "../api/rezepte";
import { PrimaryButton } from "../components/form/Buttons";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [ingredientsList, setIngredientsList] = useState([]); // Zutatenliste hinzufügen

  // Zutaten, Rezepte aus dem Backend laden
  useEffect(() => {
    loadZutaten();
    loadRezepte();
  }, []);

  const loadRezepte = async () => {
    try {
      const data = await fetchRezepte();
      setRecipes(data);
    } catch (error) {
      console.error("Fehler beim Laden der Zutaten:", error);
    }
  };

  const loadZutaten = async () => {
    try {
      const data = await fetchZutaten();
      setIngredientsList(data); // Zutatenliste im State speichern
    } catch (error) {
      console.error("Fehler beim Laden der Zutaten:", error);
    }
  };

  const handleSaveRecipe = (recipe) => {
    console.log("Rezept gespeichert:", recipe);
    loadRezepte();
    setEditMode(false);
    setSelectedRecipe(null);
  };

  const handleEditRecipe = (recipe) => {
    // Rezept zum Bearbeiten setzen
    setSelectedRecipe(recipe);
    setEditMode(true);
  };

  const handleDeleteRecipe = async (id) => {
    await deleteRezept(id);
    loadRezepte();
    setSelectedRecipe(null);
  };

  const handleCancel = () => {
    setSelectedRecipe(null);
    setEditMode(false);
  };

  return (
    <div className="p-8 text-amber-100">
      <RecipeForm
        recipe={
          selectedRecipe || {
            name: "",
            ingredients: [{ name: "", amount: 0, ekPreis: 0 }],
            tools: [],
            totalAmount: 1,
          }
        }
        onSave={handleSaveRecipe}
        onCancel={handleCancel}
        ingredientsList={ingredientsList} // Zutatenliste als Prop an RecipeForm übergeben
      />
      <RecipeList
        recipes={recipes}
        onSelect={setSelectedRecipe}
        onDelete={handleDeleteRecipe}
        onEdit={handleEditRecipe}
      />
    </div>
  );
};

export default Recipes;
