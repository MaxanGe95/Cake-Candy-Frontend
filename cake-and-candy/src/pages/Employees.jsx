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
    {
      id: 3,
      name: "Joe Doe",
      gehalt: "2.800€",
      wochenstunden: 35,
      wochenlohn: "600€",
      monatsstunden: 140,
      monatslohn: "2.800€",
      datum: "01.02.2025",
      gearbeiteteStunden: 35,
    },
    {
      id: 4,
      name: "Ernesto Ernst",
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
      <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
        <thead>
          <tr className="bg-teal-950">
            <th className=" p-2">Mitarbeitername</th>
            <th className=" p-2">Gehalt</th>
            <th className=" p-2">Wochen/h</th>
            <th className=" p-2">Wochenlohn</th>
            <th className=" p-2">Monats/h</th>
            <th className=" p-2">Monatslohn</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <tr
                className="border rounded-md cursor-pointer hover:bg-[#7ec6cc80]"
                onClick={() => toggleDropdown(row.id)}
              >
                <td className=" p-2 text-center">{row.name}</td>
                <td className=" p-2 text-center">{row.gehalt}</td>
                <td className=" p-2 text-center">{row.wochenstunden}</td>
                <td className=" p-2 text-center">{row.wochenlohn}</td>
                <td className=" p-2 text-center">{row.monatsstunden}</td>
                <td className=" p-2 text-center">{row.monatslohn}</td>
              </tr>
              {selectedRow === row.id && (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    <div className="bg-teal-950 rounded-md shadow-lg p-4">
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
