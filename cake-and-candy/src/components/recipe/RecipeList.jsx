import { DeleteButton, EditButton } from "../form/Buttons";

const RecipeList = ({ recipes, onSelect, onDelete, onEdit }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold">Gespeicherte Rezepte</h2>
      <ul>
        {recipes.map((recipe, index) => (
          <li
            key={index}
            className="border-t py-2 flex justify-between items-center"
          >
            <span className="cursor-pointer" onClick={() => onSelect(recipe)}>
              {recipe.name}
            </span>

            <div>
              <EditButton onClick={() => onEdit(recipe)}>
                Rezept bearbeiten{" "}
              </EditButton>
              <DeleteButton onClick={() => onDelete(recipe._id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
