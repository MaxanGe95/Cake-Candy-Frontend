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
      .catch((error) =>
        console.error("Fehler beim Hinzufügen der Zutat:", error)
      );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 text-amber-100">
      <div className="flex">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Zutatname"
            required
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
          />
        </div>
        <div>
          <input
            type="text"
            value={typ}
            disabled
            placeholder="Typ"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
          />
        </div>
      </div>

      <div>
        <input
          type="number"
          value={ekPreis}
          onChange={(e) => setEkPreis(e.target.value)}
          placeholder="EK-Preis"
          required
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-100"
          step="0.01"
        />
      </div>

      <button
        type="submit"
        className="bg-teal-950 text-amber-100 p-2 rounded-md hover:bg-teal-800 transition duration-200"
      >
        Zutat hinzufügen
      </button>
    </form>
  );
};

export default ZutatenForm;
