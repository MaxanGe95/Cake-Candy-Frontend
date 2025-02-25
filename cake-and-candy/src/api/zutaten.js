export const fetchZutaten = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/zutaten");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fehler beim Laden der Zutaten:", error);
      throw error;
    }
  };
  
  export const addZutat = async (zutat) => {
    try {
      const response = await fetch("http://localhost:5000/api/zutaten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zutat),
      });
      const newZutat = await response.json();
      return newZutat;
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      throw error;
    }
  };
  
  export const deleteZutat = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/zutaten/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      throw error;
    }
  };