const API_URL = "http://localhost:5000/api/rezepte";

// Alle Rezepte abrufen
export const fetchRezepte = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Laden der Rezepte:", error);
    throw error;
  }
};

// Neues Rezept hinzufügen
export const addRezept = async (rezept) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rezept),
    });
    const newRezept = await response.json();
    return newRezept;
  } catch (error) {
    console.error("Fehler beim Speichern des Rezepts:", error);
    throw error;
  }
};

// Rezept aktualisieren (z.B. bearbeiten)
export const updateRezept = async (id, updatedRezept) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRezept),
    });
    const updatedData = await response.json();
    return updatedData;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Rezepts:", error);
    throw error;
  }
};

// Rezept löschen
export const deleteRezept = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  } catch (error) {
    console.error("Fehler beim Löschen des Rezepts:", error);
    throw error;
  }
};
