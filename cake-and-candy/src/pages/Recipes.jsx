import React, { useState } from 'react';
import RecipeForm from '../components/recipe/RecipeForm';
import RecipeList from '../components/recipe/RecipeList';
import RecipeDetails from '../components/recipe/RecipeDetails';

const initialRecipes = [
  {
    id: 1,
    name: 'Pfannkuchen',
    description: 'Leckere Pfannkuchen mit Zucker und Zimt.',
    ingredients: [
      { name: 'Mehl', amount: 200, unit: 'g' },
      { name: 'Milch', amount: 300, unit: 'ml' },
      { name: 'Eier', amount: 2, unit: 'Stück' },
      { name: 'Zucker', amount: 50, unit: 'g' },
      { name: 'Butter', amount: 20, unit: 'g' }
    ],
    tools: ['Pfanne', 'Schneebesen'],
    totalAmount: 4
  }
];

const Recipes = () => {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleSaveRecipe = (recipe) => {
    if (editMode) {
      const updatedRecipes = recipes.map((r) => (r.id === recipe.id ? recipe : r));
      setRecipes(updatedRecipes);
      setEditMode(false);
    } else {
      setRecipes([...recipes, { ...recipe, id: recipes.length + 1 }]);
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
          recipe={selectedRecipe || { name: '', description: '', ingredients: [{ name: '', amount: 0, unit: '' }], tools: [], totalAmount: 1 }}
          onSave={handleSaveRecipe}
          onCancel={handleCancel}
        />
      )}
      <RecipeList recipes={recipes} onSelect={setSelectedRecipe} onDelete={handleDeleteRecipe} />
      {selectedRecipe && !showNewRecipeForm && (
        <RecipeDetails recipe={selectedRecipe} onEdit={handleEditRecipe} />
      )}
    </div>
  );
};

export default Recipes;