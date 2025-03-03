import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../form/Buttons";
import { InputNumber } from "../form/Inputs";

const RecipeDetails = ({ recipe, onEdit, onCancel }) => {
  const [scaleAmount, setScaleAmount] = useState(recipe.totalAmount);

  const calculateScaledIngredients = (recipe, scale) => {
    return recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      amount: (ingredient.amount * scale).toFixed(2),
    }));
  };

  // Berechnung des Gesamtpreises pro Zutat und Hinzufügen zu den Rezeptdaten
  const calculateIngredientTotalPrice = (ingredient) => {
    const amount = parseFloat(ingredient.amount); // amount als Zahl
    const ekPreis = parseFloat(ingredient.ekPreis); // ekPreis als Zahl
    return amount * ekPreis; // Berechnung des Gesamtpreises
  };

  // Berechnung des Gesamtpreises aller Zutaten im Rezept
  const calculateTotalPrice = (ingredients) => {
    return ingredients.reduce(
      (total, ingredient) => total + calculateIngredientTotalPrice(ingredient),
      0
    );
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold mb-4">{recipe.name}</h1>
      <h4 className="text-md font-semibold">Zusatztext</h4>
      <pre>{recipe.zusatz}</pre>
      <h4 className="text-md font-semibold">Kategorie</h4>
      <p>{recipe.category}</p>
      <h4 className="text-md font-semibold">Hilfsmittel</h4>
      <p>{recipe.tools?.join(", ")}</p>
      <h4 className="text-md font-semibold">Stückpreis</h4>
      <p>{recipe.unitPrice}€</p>
      <h4 className="text-md font-semibold">Gesamtmenge</h4>
      <p>{recipe.totalAmount}</p>
      <h4 className="text-md font-semibold">Gesamtkosten</h4>
      <p>{recipe.totalCost}€</p>
      <h4 className="text-md font-semibold">B2B-Preis</h4>
      <p>{recipe.b2bPreis}€</p>
      <h4 className="text-md font-semibold">B2C-Preis</h4>
      <p>{recipe.b2cPreis}€</p>
      <h4 className="text-md font-semibold">Lagerbestand-Ist</h4>
      <p>{recipe.istlagerbestand}</p>
      <h4 className="text-md font-semibold">Lagerbestand-Soll</h4>
      <p>{recipe.solllagerbestand}</p>
      <h4 className="text-md font-semibold">Zutaten</h4>
      <div className="border rounded p-1 m-1">
        <ul>
          {calculateScaledIngredients(
            recipe,
            scaleAmount / recipe.totalAmount
          ).map((ingredient, i) => (
            <li
              key={i}
            >{`${ingredient.amount} ${ingredient.name} EK-Preis: ${ingredient.ekPreis} € `}</li>
          ))}
        </ul>
        <h4 className="text-md font-semibold">Menge anpassen</h4>
        <InputNumber
          type="number"
          placeholder="Menge"
          value={scaleAmount}
          onChange={(v) => setScaleAmount(v)}
        />
      </div>{" "}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Gesamtpreis der Zutaten</h3>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="mb-2">
              <strong>{ingredient.name}: </strong>
              {ingredient.amount}
              {" x "}
              {ingredient.ekPreis?.toFixed(2)} €
            </li>
          ))}
        </ul>
        <p className="text-lg">
          <span>Gesamtpreis: </span>
          {calculateTotalPrice(recipe.ingredients).toFixed(2)} €
        </p>
      </div>
      <PrimaryButton className="mt-1" onClick={() => onEdit(recipe)}>
        Rezept bearbeiten
      </PrimaryButton>
      <SecondaryButton className="ml-1 mt-1" onClick={() => onCancel(recipe)}>
        zur Rezeptliste
      </SecondaryButton>
    </div>
  );
};

export default RecipeDetails;
