import { useEffect, useState } from "react";
import ZutatenForm from "../components/Zutaten/ZutatenForm";
import ZutatenListe from "../components/Zutaten/ZutatenListe";

const Products = () => {
  const [zutaten, setZutaten] = useState([]);

  // Funktion zum Laden der Zutaten
  const fetchZutaten = async () => {
    try {
      const [zutatenRes, inventoryRes] = await Promise.all([
        fetch("http://localhost:5000/api/zutaten"),
        fetch("http://localhost:5000/api/inventory") // Korrigierte Route
      ]);
  
      if (!zutatenRes.ok || !inventoryRes.ok) {
        throw new Error("Fehler beim Abrufen der Daten");
      }
  
      const zutatenData = await zutatenRes.json();
      const inventoryData = await inventoryRes.json();
  
      console.log("🔍 Zutaten aus API:", zutatenData);
      console.log("🔍 Inventar aus API:", inventoryData);
  
      // Zutaten mit Istbestand aus Inventory aktualisieren
      const updatedZutaten = zutatenData.map((zutat) => {
        if (!zutat.name) {
          console.error("❌ Fehler: Zutat ohne Name gefunden:", zutat);
          return { ...zutat, istlagerbestand: 0 }; 
        }
      
        const matchingInventory = inventoryData.find(inv => 
          inv.itemName && zutat.name && inv.itemName.trim().toLowerCase() === zutat.name.trim().toLowerCase()
        );
      
        return {
          ...zutat,
          istlagerbestand: matchingInventory ? matchingInventory.quantity : 0, // `quantity` ist der Istbestand
        };
      });
      
      
  
      console.log("✅ Aktualisierte Zutatenliste:", updatedZutaten);
      setZutaten(updatedZutaten);
    } catch (error) {
      console.error("❌ Fehler beim Laden der Zutaten oder Inventardaten:", error);
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-teal-200 mt-6">Zutaten hinzufügen</h1>
      <ZutatenForm onAdd={handleAddZutat} />
      
      <h2 className="text-2xl font-bold text-teal-200 mt-6">Zutaten-Liste</h2>
      <ZutatenListe zutaten={zutaten} onDelete={handleDeleteZutat} />
    </div>
  );
};

export default Products;
