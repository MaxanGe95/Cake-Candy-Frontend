import { useState } from "react";

const ZutatenForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [typ, setTyp] = useState("Rohprodukt");
  const [ekPreis, setEkPreis] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !ekPreis) return;

    const neueZutat = {
      name,
      typ,
      ekPreis: parseFloat(ekPreis),
    };

    fetch("http://localhost:5000/api/zutaten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(neueZutat),
    })
      .then((response) => response.json())
      .then((data) => {
        const zutatMitId = { ...data, id: data._id }; // MongoDB ID verwenden
        onAdd(zutatMitId); // Die Zutat mit der ID weitergeben
        setName("");
        setEkPreis("");
      })
      .catch((error) => console.error("Fehler beim Hinzufügen der Zutat:", error));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div>
        <label>Zutatname:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label>Typ:</label>
        <input type="text" value={typ} disabled className="border p-2 rounded w-full bg-gray-200" />
      </div>

      <div>
        <label>EK-Preis ($):</label>
        <input
          type="number"
          value={ekPreis}
          onChange={(e) => setEkPreis(e.target.value)}
          required
          className="border p-2 rounded w-full"
          step="0.01"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Zutat hinzufügen
      </button>
    </form>
  );
};

export default ZutatenForm;
