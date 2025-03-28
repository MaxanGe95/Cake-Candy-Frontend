import { useState, useEffect } from "react";
import { fetchZutaten } from "../../api/zutaten";
import { DeleteButton, PrimaryButton, SecondaryButton } from "../form/Buttons";
import { addRezept, updateRezept } from "../../api/rezepte";
import { DropdownInput, InputNumber, InputString } from "../form/Inputs";

const toolsList = [
  "Industrietopf",
  "Pralinenform",
  "Tafelform",
  "Kaffeemühle",
  "Backblech",
];
const categoryOptions = [
  "Pralinen",
  "Tafeln",
  "Kuchen",
  "Torten",
  "Backwaren",
  "Süßes",
  "Getränke",
  "Zwischenprodukte",
  "Kooperationsprodukte",
  "Saisonprodukte",
  "Sonstiges",
];

const RecipeForm = ({ recipe, onSave, onCancel }) => {
  const [newRecipe, setNewRecipe] = useState({
    _id: recipe?._id,
    name: recipe?.name || "",
    tools: recipe?.tools || [],
    category: recipe?.category || "",
    totalAmount: recipe?.totalAmount || "",
    istlagerbestand: recipe?.istlagerbestand || 0,
    solllagerbestand: recipe?.solllagerbestand || 0,
    zusatz: recipe?.zusatz || "",
    ingredients: recipe?.ingredients || [],
  });

  const [errors, setErrors] = useState({});
  const [ingredientsList, setIngredientsList] = useState([]);

  useEffect(() => {
    if (recipe) {
      setNewRecipe({
        _id: recipe._id,
        name: recipe.name || "",
        tools: recipe.tools || [],
        category: recipe.category || "",
        totalAmount: recipe.totalAmount || 0,
        istlagerbestand: recipe.istlagerbestand || 0,
        solllagerbestand: recipe.solllagerbestand || 0,
        zusatz: recipe.zusatz || "",
        ingredients: recipe.ingredients || [],
      });
    }
    loadZutaten(); // Zutaten aus der API laden
  }, [recipe]);

  const handleCancel = () => {
    // Rezept zurücksetzen auf die ursprünglichen Werte
    setNewRecipe({
      _id: recipe?._id,
      name: recipe?.name || "",
      tools: recipe?.tools || [],
      category: recipe?.category || "",
      totalAmount: recipe?.totalAmount || "",
      istlagerbestand: recipe?.istlagerbestand || 0,
      solllagerbestand: recipe?.solllagerbestand || 0,
      zusatz: recipe?.zusatz || "",
      ingredients: recipe?.ingredients || [],
    });
    // setErrors({}); // Fehler zurücksetzen
    onCancel(); //  zusätzliche Funktion zum Abbrechen gewünscht
  };
  const loadZutaten = async () => {
    try {
      const data = await fetchZutaten();
      console.log("Zutaten geladen:", data); // Überprüfe, was zurückgegeben wird
      setIngredientsList(data);
    } catch (error) {
      console.error("Fehler beim Laden der Zutaten:", error);
    }
  };

  const addIngredient = (e) => {
    e.preventDefault();
    setNewRecipe({
      ...newRecipe,
      ingredients: [
        ...newRecipe.ingredients,
        { name: "", amount: 0, ekPreis: 0 },
      ],
    });
  };

  const removeIngredient = (index) => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (index, value) => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, name: value.name, ekPreis: value.ekPreis } : ing
      ),
    }));
  };

  const handleIngredientChangeField = (index, field, value) => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      ),
    }));
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

  const saveRecipe = async (e) => {
    e.preventDefault();
    if (!validateRecipe()) {
      alert("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }

    const totalCost = newRecipe.ingredients.reduce((sum, ingredient) => {
      return sum + ingredient.amount * ingredient.ekPreis;
    }, 0);

    let unitPrice = totalCost / newRecipe.totalAmount;

    if (isNaN(unitPrice) || unitPrice <= 0) {
      alert("Der unitPrice ist ungültig.");
      return;
    }

    // runden auf 2 Nachkommastellen
    unitPrice = unitPrice.toFixed(2);

    const recipeType =
      newRecipe.category === "Zwischenprodukte"
        ? "Zwischenprodukt"
        : "Endprodukt";

    const finalRecipe = {
      ...newRecipe,
      totalCost,
      unitPrice,
      typ: recipeType,
    };

    try {
      let recipe;
      if (finalRecipe._id) {
        recipe = await updateRezept(finalRecipe);
      } else {
        recipe = await addRezept(finalRecipe);
      }
      onSave(recipe);
    } catch (error) {
      console.error("Fehler beim Speichern des Rezepts:", error);
      alert(`Es gab einen Fehler beim Speichern des Rezepts: ${error.message}`);
    }
  };

  return (
    <form className="mx-auto">
      <h2 className="text-2xl font-bold text-teal-200 mt-6">
        {recipe?._id ? "Rezept bearbeiten" : "Neues Rezept"}
      </h2>
      <div className="ml-2 grid md:grid-cols-5 gap-1 text-amber-100 mt-4">
        <div className="">
          <label htmlFor="Rezeptname" className="mb-1 text-sm font-medium">
            Rezeptname
          </label>
          <InputString
            value={newRecipe.name}
            onChange={(v) => handleRecipeChange("name", v)}
            error={errors.name}
            className=""
          />
        </div>
        <div className="col-start-2">
          <label htmlFor="Ergebnismenge" className="mb-1 text-sm font-medium">
            Ergebnismenge
          </label>
          <InputNumber
            placeholder="Ergebnismenge"
            value={newRecipe.totalAmount}
            onChange={(v) => handleRecipeChange("totalAmount", v)}
            error={errors.name}
            className="w-35"
          />
        </div>
        <div className="">
          <label htmlFor="Hilfsmittel" className="mb-1 text-sm font-medium">
            Hilfsmittel
          </label>
          <DropdownInput
            className="w-70"
            options={toolsList}
            value={newRecipe.tools[0]}
            onChange={(e) => handleRecipeChange("tools", [e])}
            placeholder="Hilfsmittel wählen"
            error={errors.name}
          />
        </div>
        <div className="">
          <label htmlFor="Kategorie" className="mb-1 text-sm font-medium">
            Kategorie
          </label>
          <DropdownInput
            className="w-70"
            options={categoryOptions}
            value={newRecipe.category}
            onChange={(v) => handleRecipeChange("category", v)}
            placeholder="Kategorie wählen"
            error={errors.name}
          />
        </div>
        <div className="row-start-2 mb-30">
          {newRecipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center ">
              <div className="flex-1">
                <label htmlFor="Zutaten" className="mb-1 text-sm font-medium">
                  Zutaten
                </label>
                <DropdownInput
                  className="w-70"
                  options={ingredientsList}
                  value={ingredient.name} // Hier sollte der Name der Zutat aus 'newRecipe.ingredients' kommen
                  onChangeObject={(v) => handleIngredientChange(index, v)} // Überprüfe, ob 'v' das richtige Objekt ist
                  valueKey="name"
                  nameKey="name"
                  placeholder="Zutat wählen"
                  error={errors[`ingredient${index}_name`]}
                />
              </div>
              <div className="flex-1 ml-6">
                <label htmlFor="Menge" className="ml-1 text-sm font-medium">
                  Menge
                </label>
                <div className="flex items-center ">
                  <InputNumber
                    placeholder="Menge"
                    value={ingredient.amount}
                    onChange={(v) =>
                      handleIngredientChangeField(index, "amount", v)
                    }
                    error={errors[`ingredient${index}_amount`]}
                    className="w-35 ml-0.5"
                  />
                  <DeleteButton
                    className=""
                    onClick={() => removeIngredient(index)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-start-5 row-start-2 mt-5">
          {" "}
          <div className="">
            <PrimaryButton
              type="submit"
              onClick={addIngredient}
              className="w-41 ml-17 mb-2"
            >
              Zutat Hinzufügen
            </PrimaryButton>
          </div>
          <div className="ml-10">
            <PrimaryButton type="submit" onClick={saveRecipe} className="w-27 ">
              Speichern
            </PrimaryButton>
            <SecondaryButton
              type="submit"
              onClick={handleCancel}
              className="ml-1 w-27"
            >
              Abbrechen
            </SecondaryButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RecipeForm;
