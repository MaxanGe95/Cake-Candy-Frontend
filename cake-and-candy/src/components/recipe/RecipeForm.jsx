import { useState, useEffect } from "react";
import { fetchZutaten } from "../../api/zutaten";
import { DeleteButton, PrimaryButton, SecondaryButton } from "../form/Buttons";
import { addRezept, updateRezept } from "../../api/rezepte";
import {
  DropdownInput,
  InputNumber,
  InputString,
  InputTextarea,
  InputCurrency,
  MultipleDropdownInput,
} from "../form/Inputs";

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
    totalCost: recipe?.totalCost || 0,
    unitPrice: recipe?.unitPrice || 0,
    b2bPreis: recipe?.b2bPreis || 0,
    b2cPreis: recipe?.b2cPreis || 0,
    istlagerbestand: recipe?.istlagerbestand || 0,
    solllagerbestand: recipe?.solllagerbestand || 0,
    zusatz: recipe?.zusatz || "",
    ingredients: recipe?.ingredients || [],
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

  const handleIngredientChange = (index, field, value) => {
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

  const saveRecipe = async () => {
    if (!validateRecipe()) {
      alert("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }

    const totalCost = newRecipe.ingredients.reduce((sum, ingredient) => {
      return sum + ingredient.amount * ingredient.ekPreis;
    }, 0);

    const unitPrice = totalCost / newRecipe.totalAmount;

    if (isNaN(unitPrice) || unitPrice <= 0) {
      alert("Der unitPrice ist ungültig.");
      return;
    }

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
      console.log(JSON.stringify(finalRecipe));
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
    <div className="p-6">
      <h2 className="text-xl font-semibold mt-6">
        {recipe?._id ? "Rezept bearbeiten" : "Neues Rezept"}
      </h2>

      <InputString
        placeholder="Rezeptname"
        value={newRecipe.name}
        onChange={(v) => handleRecipeChange("name", v)}
        error={errors.name}
        className="mb-1"
      />

      <h3 className="text-lg font-semibold">Zusatztext</h3>
      <InputTextarea
        placeholder="Zusatz"
        value={newRecipe.zusatz}
        onChange={(v) => handleRecipeChange("zusatz", v)}
        error={errors.zusatz}
        className="mb-1"
      />
      <h3 className="text-lg font-semibold">Kategorie</h3>
      <DropdownInput
        className="w-full"
        options={categoryOptions}
        value={newRecipe.category}
        onChange={(v) => handleRecipeChange("category", v)}
        placeholder="Kategorie wählen"
        error={errors.name}
      />

      <h3 className="text-lg font-semibold">Hilfsmittel</h3>
      <MultipleDropdownInput
        className="w-full"
        options={toolsList}
        value={newRecipe.tools}
        onChange={(e) => handleRecipeChange("tools", e)}
        placeholder="Hilfsmittel wählen"
        error={errors.name}
      />

      <h3 className="text-lg font-semibold">Stückpreis</h3>
      <InputCurrency
        placeholder="Stückpreis"
        value={newRecipe.unitPrice}
        onChange={(v) => handleRecipeChange("unitPrice", v)}
        error={errors.unitPrice}
        className="mb-2"
      />

      <h3 className="text-lg font-semibold">Gesamtmenge</h3>
      <InputNumber
        placeholder="Gesamtmenge"
        value={newRecipe.totalAmount}
        onChange={(v) => handleRecipeChange("totalAmount", v)}
        error={errors.name}
        className="mb-2"
      />

      <h3 className="text-lg font-semibold">Gesamtkosten</h3>
      <InputCurrency
        placeholder="Gesamtkosten"
        value={newRecipe.totalCost}
        onChange={(v) => handleRecipeChange("totalCost", v)}
        error={errors.totalCost}
        className="mb-2"
      />

      <h3 className="text-lg font-semibold">B2B-Preis</h3>
      <InputCurrency
        placeholder="B2B-Preis"
        value={newRecipe.b2bPreis}
        onChange={(v) => handleRecipeChange("b2bPreis", v)}
        error={errors.b2bPreis}
        className="mb-2"
      />

      <h3 className="text-lg font-semibold">B2C-Preis</h3>
      <InputCurrency
        placeholder="B2C-Preis"
        value={newRecipe.b2cPreis}
        onChange={(v) => handleRecipeChange("b2cPreis", v)}
        error={errors.b2cPreis}
        className="mb-2"
      />

      <h3 className="text-lg font-semibold">Lagerbestand-Ist</h3>
      <InputNumber
        placeholder="Lagerbestand-Ist"
        value={newRecipe.istlagerbestand}
        onChange={(v) => handleRecipeChange("istlagerbestand", v)}
        error={errors.istlagerbestand}
        className="mb-2"
      />

      <h3 className="text-lg font-semibold">Lagerbestand-Soll</h3>
      <InputNumber
        placeholder="Lagerbestand-Soll"
        value={newRecipe.solllagerbestand}
        onChange={(v) => handleRecipeChange("solllagerbestand", v)}
        error={errors.solllagerbestand}
        className="mb-2"
      />

      <h3 className="text-lg font-semibold">Zutaten</h3>
      {newRecipe.ingredients.map((ingredient, index) => (
        <div key={index} className="flex mb-2 items-center">
          <DropdownInput
            className="w-3/4 mr-1"
            options={ingredientsList}
            value={ingredient.name}
            onChange={(v) => handleIngredientChange(index, "name", v)}
            valueKey="name"
            nameKey="name"
            placeholder="Zutat wählen"
            error={errors[`ingredient${index}_name`]}
          />{" "}
          <InputNumber
            placeholder="Menge"
            value={ingredient.amount}
            onChange={(v) => handleIngredientChange(index, "amount", v)}
            error={errors[`ingredient${index}_amount`]}
            className="w-1/4 mr-1"
          />
          <InputCurrency
            placeholder="EK-Preis"
            value={ingredient.ekPreis}
            onChange={(v) => handleIngredientChange(index, "ekPreis", v)}
            error={errors[`ingredient${index}_ekPreis`]}
            className="w-1/4"
          />
          <DeleteButton onClick={() => removeIngredient(index)} />
        </div>
      ))}
      <PrimaryButton onClick={addIngredient} className="mr-1">
        Zutat hinzufügen
      </PrimaryButton>

      <br />
      <PrimaryButton onClick={saveRecipe} className="mr-1 mt-2">
        Speichern
      </PrimaryButton>
      <SecondaryButton onClick={onCancel}>Abbrechen</SecondaryButton>
    </div>
  );
};

export default RecipeForm;
