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
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...zutatenState].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

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
                {sortConfig.key === key
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
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
                ${zutat.ekPreis?.toFixed(2) || "0.00"}
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
                  className={`w-16 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-amber-100 ${
                    zutat.typ?.toLowerCase() !== "endprodukt" ? " border-0" : ""
                  }`}
                  disabled={zutat.typ?.toLowerCase() !== "endprodukt"}
                />
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
                  className={`w-16 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-amber-100 ${
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
                  className="w-16 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </td>
              {(
                <meter
                  className="w-full h-6"
                  min={0}
                  max={zutat.solllagerbestand || 100} // Ziel-Lagerbestand
                  low={(zutat.solllagerbestand || 100) * 0.25} // Niedrig-Schwelle (25% des Soll-Lagerbestands)
                  high={(zutat.solllagerbestand || 100) * 0.75} // Hoch-Schwelle (75% des Soll-Lagerbestands)
                  optimum={(zutat.solllagerbestand || 100) * 0.5} // Optimal-Schwelle (50%)
                  value={zutat.istlagerbestand || 0} // Aktueller Bestand
                ></meter>
              )}
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

/* import React, { useState, useEffect } from "react";

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
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...zutatenState].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

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
                {sortConfig.key === key
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
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
                ${zutat.ekPreis?.toFixed(2) || "0.00"}
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
                  className={`w-16 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-amber-100 ${
                    zutat.typ?.toLowerCase() !== "endprodukt" ? " border-0" : ""
                  }`}
                  disabled={zutat.typ?.toLowerCase() !== "endprodukt"}
                />
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
                  className={`w-16 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-amber-100 ${
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
                  className="w-16 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </td>
              <td className="p-2 text-center">
                {zutat.zusatz || (
                  <meter
                  className="w-[100%] h-[20px] rounded-[5px]"
                    min={0}
                    max={zutat.solllagerbestand || 100} // Ziel-Lagerbestand
                    low={(zutat.solllagerbestand || 100) * 0.25} // Niedrig-Schwelle (25% des Soll-Lagerbestands)
                    high={(zutat.solllagerbestand || 100) * 0.75} // Hoch-Schwelle (75% des Soll-Lagerbestands)
                    optimum={(zutat.solllagerbestand || 100) * 0.5} // Optimal-Schwelle (50%)
                    value={zutat.istlagerbestand || 0} // Aktueller Bestand
                  ></meter>
                )}
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
 */
