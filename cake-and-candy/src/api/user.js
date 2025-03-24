const API_URL = "http://localhost:5000/api/users";

// Benutzer abrufen
export const fetchUsers = async () => {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Laden der Benutzer:", error);
    throw error;
  }
};

// Benutzer hinzufügen
export const addUser = async (user) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Speichern des Benutzers:", error);
    throw error;
  }
};

// Benutzer aktualisieren
export const updateUser = async (user) => {
  try {
    const response = await fetch(`${API_URL}/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Benutzers:", error);
    throw error;
  }
};

// Benutzer löschen
export const deleteUser = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  } catch (error) {
    console.error("Fehler beim Löschen des Benutzers:", error);
    throw error;
  }
};
