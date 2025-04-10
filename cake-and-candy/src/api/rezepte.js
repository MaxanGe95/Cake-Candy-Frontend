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
    const result = data
      .filter((recipe) => recipe.typ === "Endprodukt")
      .map((recipe) => recipe.category);
    // eindeutige Kategorien
    let id = 0;
    return [...new Set(result)].map((category) => {
      return { name: category, id: id++ };
    });
  } catch (error) {
    console.error("Fehler beim Laden der Endprodukte:", error);
    throw error;
  }
};

export const fetchEndProdukte = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/rezepte");
    const data = await response.json();
    // TODO kann effizienter im backend gemacht werden
    return data.filter((recipe) => recipe.typ === "Endprodukt");
  } catch (error) {
    console.error("Fehler beim Laden der Endprodukte:", error);
    throw error;
  }
};

export const fetchHighlightProdukte = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/rezepte");
    const data = await response.json();
    // TODO sollte vielleicht im Schema festgelegt werden können, welche Produkte auf der LandingPage angezeigt werden
    // workaround: erstmal nur die ersten 6 Endprodukte nehmen
    return data.filter((recipe) => recipe.typ === "Endprodukt").slice(0,6);
  } catch (error) {
    console.error("Fehler beim Laden der Endprodukte:", error);
    throw error;
  }
};

export const fetchNeuEingetroffen = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/rezepte");
    const data = await response.json();
    // TODO sollte vielleicht im Schema festgelegt werden können, welche Produkte auf der LandingPage angezeigt werden
    // workaround: erstmal nur die letzten 6 Endprodukte nehmen
    return data.filter((recipe) => recipe.typ === "Endprodukt").reverse().slice(0,6);
  } catch (error) {
    console.error("Fehler beim Laden der Endprodukte:", error);
    throw error;
  }
};

// Bild im Backend hinzufügen
// das backend speichert es irgendwo, wo genau ist dem frontend egal
export const uploadImage = async (rezept, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `http://localhost:5000/api/rezepte/${rezept._id}/image`,
      {
        method: "POST",
        body: formData,
      }
    );
    return response;
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    throw error;
  }
};

// Url um das Bild abzurufen zusammenbauen
export const rezeptImage = (rezept) => {
  return `http://localhost:5000/api/rezepte/${rezept._id}/image`;
};
