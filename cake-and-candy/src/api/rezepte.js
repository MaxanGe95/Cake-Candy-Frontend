export const fetchRezepte = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/rezepte");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Laden der Rezepte:", error);
    throw error;
  }
};

export const addRezept = async (rezept) => {
  try {
    const response = await fetch("http://localhost:5000/api/rezepte", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rezept),
    });
    const newRezept = await response.json();
    return newRezept;
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    throw error;
  }
};

export const updateRezept = async (rezept) => {
  console.log(rezept, rezept._id, rezept.id);
  try {
    const response = await fetch(
      `http://localhost:5000/api/rezepte/${rezept._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rezept),
      }
    );
    const newRezept = await response.json();
    return newRezept;
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    throw error;
  }
};

export const deleteRezept = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/rezepte/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/rezepte");
    const data = await response.json();
    // TODO kann effizienter im backend gemacht werden
    return data.filter(recipe => recipe.typ === "Endprodukt").map(recipe => recipe.category);
  } catch (error) {
    console.error("Fehler beim Laden der Endprodukte:", error);
    throw error;
  }
};

export const fetchEndProdukte = async (category) => {
  try {
    const response = await fetch("http://localhost:5000/api/rezepte");
    const data = await response.json();
    // TODO kann effizienter im backend gemacht werden
    return data.filter(recipe => recipe.category === category);
  } catch (error) {
    console.error("Fehler beim Laden der Endprodukte:", error);
    throw error;
  }
};