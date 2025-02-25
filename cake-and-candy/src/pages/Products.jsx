import { useEffect, useState } from "react";
import ZutatenForm from "../components/Zutaten/ZutatenForm";
import ZutatenListe from "../components/Zutaten/ZutatenListe";

const Products = () => {
  const [zutaten, setZutaten] = useState([]);

  // Funktion zum Laden der Zutaten
  const fetchZutaten = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/zutaten");
      const data = await response.json();
      setZutaten(data); // Zutaten im Zustand setzen
    } catch (error) {
      console.error("Fehler beim Laden der Zutaten:", error);
    }
  };

  useEffect(() => {
    fetchZutaten(); // Initiale Zutaten bei Seitenladen abrufen
  }, []);

  // Funktion zum Hinzufügen einer neuen Zutat
  const handleAddZutat = async (zutat) => {
    try {
      const response = await fetch("http://localhost:5000/api/zutaten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zutat),
      });
      const newZutat = await response.json();

      // Nach dem Hinzufügen der Zutat die Zutaten erneut vom Server abrufen
      fetchZutaten();  // Hier wird die fetchZutaten Funktion aufgerufen, um den Zustand zu aktualisieren
      console.log("Neue Zutat hinzugefügt:", newZutat);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  };

  // Funktion zum Löschen einer Zutat
  const handleDeleteZutat = async (id) => {
    if (!window.confirm("Willst du die Zutat wirklich löschen?")) return;

    try {
      await fetch(`http://localhost:5000/api/zutaten/${id}`, { method: "DELETE" });
      fetchZutaten();  // Zutaten nach Löschung erneut abrufen
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Produkte & Zutaten</h1>
      <ZutatenForm onAdd={handleAddZutat} />
      <ZutatenListe zutaten={zutaten} onDelete={handleDeleteZutat} />
    </div>
  );
};

export default Products;
