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
    <div className="mt-4 border p-4 rounded bg-[#2a6d73]">
      <h2 className="text-lg font-semibold mb-2 text-[#5eeaff]">Zutaten-Liste</h2>
      <table className="w-full border-collapse  rounded-lg">
        <thead className="bg-[#2F4A4C] text-[#BEA86C] border p-2 rounded">
          <tr>
            <th className="p-2">Produkt</th>
            <th className="p-2">Typ</th>
            <th className="p-2">EK</th>
            <th className="p-2">B2B</th>
            <th className="p-2">B2C</th>
            <th className="p-2">Istlager</th>
            <th className="p-2">Solllager</th>
            <th className="p-2">Zusatz</th>
            <th className="p-2">Löschen</th>
          </tr>
        </thead>
        <tbody className="bg-[#2a6d73] text-[#5eeaff]">
          {zutatenState.map((zutat) => (
            <tr key={zutat._id} className="border-b">
              <td className="p-2">{zutat.name}</td>
              <td className="p-2">{zutat.typ}</td>
              <td className="p-2">
                {typeof zutat.ekPreis === "number"
                  ? `$${zutat.ekPreis.toFixed(2)}`
                  : "$0.00"}
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={zutat.b2bPreis || ""}
                  onChange={(e) => handleUpdate(zutat._id, "b2bPreis", e.target.value)}
                  className="w-16 p-1  text-[#5eeaff] border rounded focus:outline-none focus:ring-2 focus:ring-[#5eeaff]"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={zutat.b2cPreis || ""}
                  onChange={(e) => handleUpdate(zutat._id, "b2cPreis", e.target.value)}
                  className="w-16 p-1  text-[#5eeaff] border rounded focus:outline-none focus:ring-2 focus:ring-[#5eeaff]"
                />
              </td>
              <td className="p-2">{zutat.istlagerbestand || "0"}</td>
              <td className="p-2">
                <input
                  type="number"
                  value={zutat.solllagerbestand || ""}
                  onChange={(e) => handleUpdate(zutat._id, "solllagerbestand", e.target.value)}
                  className="w-16 p-1  text- border rounded focus:outline-none focus:ring-2 focus:ring-[#5eeaff]"
                />
              </td>
              <td className="p-2">{zutat.zusatz || "-"}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(zutat._id)}
                  className=" text-[#5eeaff] px-3 py-1 rounded hover:bg-[#5eeaff]"
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
