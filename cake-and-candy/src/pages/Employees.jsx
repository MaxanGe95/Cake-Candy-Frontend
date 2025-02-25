/* function Employees() {
  return (
    <div className="flex justify-center flex-col">
      <h1 className="text-center p-5 text-2xl">
        Willkommen bei Mitarbeiter Gehalt
      </h1>

      <table className="table-auto text-center">
        <thead className="bg-red-200">
          <tr className="border-2">
            <th className="p-2">Name</th>
            <th className="p-2">Gehalt</th>
            <th className="p-2">Wochen/h</th>
            <th className="p-2">Wochen/Lohn</th>
            <th className="p-2">Monats/h</th>
            <th className="p-2">Monat/Lohn</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-2 cursor-crosshair">
            <td className="p-2">Max Mustermann</td>
            <td className="p-2">60€</td>
            <td className="p-2">32h</td>
            <td className="p-2">632€</td>
            <td className="p-2">127h</td>
            <td className="p-2">1347€</td>
          </tr>
          <tr className="border-2 cursor-pointer">
            <td className="p-2">Malcolm Lockyer</td>
            <td className="p-2 flex justify-center">60€</td>
            <td className="p-2">32h</td>
            <td className="p-2">632€</td>
            <td className="p-2">127h</td>
            <td className="p-2">1347€</td>
          </tr>
          <tr className="border-2 cursor-pointer">
            <td className="p-2">Mustermann Max</td>
            <td className="p-2">60€</td>
            <td className="p-2">32h</td>
            <td className="p-2">632€</td>
            <td className="p-2">127h</td>
            <td className="p-2">1347€</td>
          </tr>{" "}
          <tr className="border-2 cursor-pointer">
            <td className="p-2">Mustermann Max</td>
            <td className="p-2">60€</td>
            <td className="p-2">32h</td>
            <td className="p-2">632€</td>
            <td className="p-2">127h</td>
            <td className="p-2">1347€</td>
          </tr>{" "}
          <tr className="border-2 cursor-pointer">
            <td className="p-2">Mustermann Max</td>
            <td className="p-2">60€</td>
            <td className="p-2">32h</td>
            <td className="p-2">632€</td>
            <td className="p-2">127h</td>
            <td className="p-2">1347€</td>
          </tr>{" "}
          <tr className="border-2 cursor-pointer">
            <td className="p-2">Mustermann Max</td>
            <td className="p-2">60€</td>
            <td className="p-2">32h</td>
            <td className="p-2">632€</td>
            <td className="p-2">127h</td>
            <td className="p-2">1347€</td>
          </tr>{" "}
          <tr className="border-2 cursor-pointer">
            <td className="p-2">Mustermann Max</td>
            <td className="p-2">60€</td>
            <td className="p-2">32h</td>
            <td className="p-2">632€</td>
            <td className="p-2">127h</td>
            <td className="p-2">1347€</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
 */


import React, { useState } from "react";

const MitarbeiterTabelle = () => {
  const [selectedRow, setSelectedRow] = useState(null);

  const data = [
    {
      id: 1,
      name: "Max Mustermann",
      gehalt: "3.000€",
      wochenstunden: 40,
      wochenlohn: "700€",
      monatsstunden: 160,
      monatslohn: "3.000€",
      datum: "01.02.2025",
      gearbeiteteStunden: 40,
    },
    {
      id: 2,
      name: "Erika Musterfrau",
      gehalt: "2.800€",
      wochenstunden: 35,
      wochenlohn: "600€",
      monatsstunden: 140,
      monatslohn: "2.800€",
      datum: "01.02.2025",
      gearbeiteteStunden: 35,
    },
  ];

  const toggleDropdown = (id) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full table-auto rounded-lg shadow-md table-auto text-center">
        <thead className=" border-2">
          <tr className=" border-2">
            <th className="px-4 py-2">Mitarbeitername</th>
            <th className="px-4 py-2">Gehalt</th>
            <th className="px-4 py-2">Wochen/h</th>
            <th className="px-4 py-2">Wochenlohn</th>
            <th className="px-4 py-2">Monats/h</th>
            <th className="px-4 py-2">Monatslohn</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <tr
                className="border-2 cursor-pointer hover:bg-[#555555]"
                onClick={() => toggleDropdown(row.id)}
              >
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2">{row.gehalt}</td>
                <td className="px-4 py-2">{row.wochenstunden}</td>
                <td className="px-4 py-2">{row.wochenlohn}</td>
                <td className="px-4 py-2">{row.monatsstunden}</td>
                <td className="px-4 py-2">{row.monatslohn}</td>
              </tr>
              {selectedRow === row.id && (
                <tr>
                  <td colSpan="6" className="p-4">
                    <div className=" rounded-lg shadow-lg p-4">
                      <p>
                        <strong>Datum:</strong> {row.datum}
                      </p>
                      <p>
                        <strong>Gearbeitete Stunden:</strong> {row.gearbeiteteStunden}
                      </p>
                      <p>
                        <strong>Gesamtes Gehalt:</strong> {row.gehalt}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MitarbeiterTabelle;
