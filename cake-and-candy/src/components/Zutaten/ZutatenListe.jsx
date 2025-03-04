import React, { useState, useEffect } from "react";

const ZutatenListe = ({ zutaten, onDelete, onUpdate }) => {
  const [zutatenState, setZutatenState] = useState(zutaten);

  useEffect(() => {
    setZutatenState(zutaten);
  }, [zutaten]); // Wenn zutaten geändert wird, setze den Zustand

  const handleDelete = (id) => {
    if (!id) {
      console.error("Ungültige ID:", id);
      return;
    }

    fetch(`http://localhost:5000/api/zutaten/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Löschen der Zutat");
        }
        console.log("Zutat erfolgreich gelöscht");
        // Lösche die Zutat aus dem Zustand
        setZutatenState(zutatenState.filter(zutat => zutat._id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdate = (id, field, value) => {
    if (!id) {
      console.error("Ungültige ID:", id);
      return;
    }

    const updatedZutat = {
      [field]: value,
    };

    fetch(`http://localhost:5000/api/zutaten/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedZutat),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Zutat erfolgreich aktualisiert", data);
        // Aktualisiere den Zustand der Zutat in der Liste
        setZutatenState(zutatenState.map(zutat => 
          zutat._id === id ? { ...zutat, [field]: value } : zutat
        ));
      })
      .catch((error) => console.error("Fehler beim Aktualisieren:", error));
  };

  return (
    <div>
      <table className="min-w-full text-amber-100 border-collapse border border-teal-950 rounded-md overflow-hidden">
        <thead className="">
          <tr className="bg-teal-950">
            <th className="border p-2">Produkt</th>
            <th className="border p-2">Typ</th>
            <th className="border p-2">EK</th>
            <th className="border p-2">B2B</th>
            <th className="border p-2">B2C</th>
            <th className="border p-2">Istlager</th>
            <th className="border p-2">Solllager</th>
            <th className="border p-2">Zusatz</th>
            <th className="border p-2">Löschen</th>
          </tr>
        </thead>
        <tbody>
          {zutatenState.map((zutat) => (
            <tr key={zutat._id} className="border hover:bg-[#7ec6cc80] transition duration-200">
              <td className="border p-2 text-center">{zutat.name}</td>
              <td className="border p-2 text-center">{zutat.typ}</td>
              <td className="border p-2 text-center">
                {typeof zutat.ekPreis === "number"
                  ? `$${zutat.ekPreis.toFixed(2)}`
                  : "$0.00"}
              </td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  value={zutat.b2bPreis || ""}
                  onChange={(e) => handleUpdate(zutat._id, "b2bPreis", e.target.value)}
                  className="w-16 p-1  border rounded focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </td>
              <td className=" border p-2 text-center">
                <input
                  type="number"
                  value={zutat.b2cPreis || ""}
                  onChange={(e) => handleUpdate(zutat._id, "b2cPreis", e.target.value)}
                  className="w-16 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </td>
              <td className="border p-2 text-center">{zutat.istlagerbestand || "0"}</td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  value={zutat.solllagerbestand || ""}
                  onChange={(e) => handleUpdate(zutat._id, "solllagerbestand", e.target.value)}
                  className="w-16 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </td>
              <td className="border p-2 text-center">{zutat.zusatz || "-"}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(zutat._id)}
                  className=" px-3 py-1 rounded hover:bg-teal-800"
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ZutatenListe;
