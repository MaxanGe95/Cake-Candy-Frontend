import React, { useState, useEffect } from "react";

const ZutatenListe = ({ zutaten, onDelete, onUpdate }) => {
  const [zutatenState, setZutatenState] = useState(zutaten);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    setZutatenState(zutaten);
  }, [zutaten]);

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
        setZutatenState(zutatenState.filter((zutat) => zutat._id !== id));
      })
      .catch((error) => console.error(error));
  };

  const handleUpdate = (id, field, value) => {
    if (!id) {
      console.error("Ungültige ID:", id);
      return;
    }

    fetch(`http://localhost:5000/api/zutaten/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    })
      .then((response) => response.json())
      .then(() => {
        setZutatenState(
          zutatenState.map((zutat) =>
            zutat._id === id ? { ...zutat, [field]: value } : zutat
          )
        );
      })
      .catch((error) => console.error("Fehler beim Aktualisieren:", error));
  };

  const handleSort = (key) => {
    // Umschalten zwischen "asc" und "desc"
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

    // Sortierte Kopie des Arrays erstellen und zusatzWert mitberechnen
    const sortedData = [...zutatenState]
      .map((zutat) => ({
        ...zutat,
        zusatzWert: Math.round(
          ((zutat.istlagerbestand || 0) / (zutat.solllagerbestand || 100)) * 100
        ),
      }))
      .sort((a, b) => {
        const numberKeys = {
          "ek-Preis": "ekPreis",
          "b2b-Preis": "b2bPreis",
          "b2c-Preis": "b2cPreis",
          "ist-lagerbestand": "istlagerbestand",
          "soll-lagerbestand": "solllagerbestand",
          zusatz: "zusatzWert",
        };

        const mappedKey = numberKeys[key] || key;

        // Sortierung für numerische Felder
        if (
          typeof a[mappedKey] === "number" &&
          typeof b[mappedKey] === "number"
        ) {
          return direction === "asc"
            ? a[mappedKey] - b[mappedKey]
            : b[mappedKey] - a[mappedKey];
        }

        // Fehlende Werte auf "" setzen, um stabil zu sortieren
        const aValue = (a[mappedKey] ?? "").toString().toLowerCase();
        const bValue = (b[mappedKey] ?? "").toString().toLowerCase();

        // Alphabetische Sortierung für String-Werte
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });

    // Sortierzustand aktualisieren
    setSortConfig({ key, direction });
    setZutatenState(sortedData);
  };

  return (
    <div>
      <table className="min-w-full text-amber-100 border-collapse border border-teal-950 rounded-md overflow-hidden">
        <thead>
          <tr className="bg-teal-950">
            {[
              "name",
              "typ",
              "ek-Preis",
              "b2b-Preis",
              "b2c-Preis",
              "ist-lagerbestand",
              "soll-lagerbestand",
              "zusatz",
            ].map((key) => (
              <th
                key={key}
                className="p-2 cursor-pointer"
                onClick={() => handleSort(key)}
              >
                {key.toUpperCase()}{" "}
                {sortConfig.key === key && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            ))}
            <th className="p-2">Löschen</th>
          </tr>
        </thead>

        <tbody>
          {zutatenState.map((zutat) => (
            <tr
              key={zutat._id}
              className="border hover:bg-[#7ec6cc80] transition duration-200"
            >
              <td className="p-2 text-center">{zutat.name}</td>
              <td className="p-2 text-center">{zutat.typ}</td>
              <td className="p-2 text-center">
                $ {zutat.ekPreis?.toFixed(2) || "0.00"}
              </td>
              <td className="p-2 text-center">
                <input
                  type="number"
                  value={zutat.b2bPreis || ""}
                  onChange={(e) =>
                    handleUpdate(
                      zutat._id,
                      "b2bPreis",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={`w-13 p-1 border no-spinner rounded focus:outline-none focus:ring-2 focus:ring-amber-100 ${
                    zutat.typ?.toLowerCase() !== "endprodukt" ? " border-0" : ""
                  }`}
                  disabled={zutat.typ?.toLowerCase() !== "endprodukt"}
                />
                {zutat.typ?.toLowerCase() === "endprodukt" && (
                    <span className="text-xs text-white">
                      {zutat.ekPreis > 0
                        ? `(${((zutat.b2bPreis / zutat.ekPreis) * 100).toFixed(
                            0
                          )}%)`
                        : "-"}
                    </span>
                  )}
              </td>

              <td className="p-2 text-center">
                <input
                  type="number"
                  value={zutat.b2cPreis || ""}
                  onChange={(e) =>
                    handleUpdate(
                      zutat._id,
                      "b2cPreis",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className={`w-13 p-1 border no-spinner rounded focus:outline-none focus:ring-2 focus:ring-amber-100 ${
                    zutat.typ?.toLowerCase() !== "endprodukt"
                      ? "  border-0"
                      : ""
                  }`}
                  disabled={zutat.typ?.toLowerCase() !== "endprodukt"}
                />
              </td>

              <td className="p-2 text-center">
                {zutat.istlagerbestand ?? "0"}
              </td>

              <td className="p-2 text-center">
                <input
                  type="number"
                  value={zutat.solllagerbestand || ""}
                  onChange={(e) =>
                    handleUpdate(zutat._id, "solllagerbestand", e.target.value)
                  }
                  className="w-13 p-1 border no-spinner rounded focus:outline-none focus:ring-2 focus:ring-amber-100 text-center -spinner"
                />
                  <style>{`
        /* Benutzerdefiniertes CSS zum Entfernen der Spinner */
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
              </td>

              {/* //zusatz */}

              <td className="p-2 text-center text-sm">
                <div className="relative w-full h-6 bg-gray-300 rounded-lg">
                  <div
                    className={`
        absolute top-0 left-0 h-6 rounded-lg
        flex items-center ${
          (zutat.istlagerbestand || 0) / (zutat.solllagerbestand || 100) < 0.2
            ? "justify-start pl-2" // Prozentzahl links, wenn Balken sehr klein
            : "justify-center" // Prozentzahl mittig bei größerem Balken
        }
        ${
          zutat.istlagerbestand < (zutat.solllagerbestand || 100) * 0.25
            ? "bg-red-500"
            : zutat.istlagerbestand < (zutat.solllagerbestand || 100) * 0.5
            ? "bg-orange-500"
            : zutat.istlagerbestand < (zutat.solllagerbestand || 100) * 0.75
            ? "bg-yellow-500"
            : "bg-green-500"
        }
      `}
                    style={{
                      width: `${
                        ((zutat.istlagerbestand || 0) /
                          (zutat.solllagerbestand || 100)) *
                        100
                      }%`,
                      maxWidth: "100%",
                    }}
                  >
                    <span
                      className={`${
                        (zutat.istlagerbestand || 0) /
                          (zutat.solllagerbestand || 100) <
                        0.2
                          ? "text-black" // Textfarbe ändern, wenn der Balken schmal ist
                          : "text-white"
                      } font-bold`}
                    >
                      {Math.round(
                        ((zutat.istlagerbestand || 0) /
                          (zutat.solllagerbestand || 100)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                </div>
              </td>

              <td className="p-2 text-center">
                <button
                  onClick={() => handleDelete(zutat._id)}
                  className="px-3 py-1 rounded hover:bg-teal-800"
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
