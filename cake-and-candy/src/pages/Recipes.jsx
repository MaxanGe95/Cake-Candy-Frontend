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
    setShowNewRecipeForm(false);
    setSelectedRecipe(null);
  };

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowNewRecipeForm(true);
    setEditMode(true);
  };

  const handleDeleteRecipe = async (id) => {
    deleteRezept(id)
      .then(loadRezepte)
      .then(() => setSelectedRecipe(null));
  };

  const handleCancel = () => {
    setShowNewRecipeForm(false);
    setSelectedRecipe(null);
    setEditMode(false);
  };

  return (
    <div className="p-8 text-amber-100">
      {showNewRecipeForm && (
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
      )}
      {!selectedRecipe && !showNewRecipeForm && (
        <div>
                <h2 className="text-2xl font-bold text-teal-200 mt-6">
        Neues Rezept hinzufügen
      </h2>
          <PrimaryButton
            onClick={() => setShowNewRecipeForm(true)}
            className="mb-4 mt-6"
          >
            Hinzufügen
          </PrimaryButton>
          <RecipeList
            recipes={recipes}
            onSelect={setSelectedRecipe}
            onDelete={handleDeleteRecipe}
            onEdit={handleEditRecipe}
          />
        </div>
      )}
      {selectedRecipe && !showNewRecipeForm && (
        <div>
          <RecipeDetails
            recipe={selectedRecipe}
            onEdit={handleEditRecipe}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default Recipes;
