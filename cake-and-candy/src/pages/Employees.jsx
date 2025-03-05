/* 

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
 */

import React, { useState, useEffect } from "react";

const MitarbeiterTabelle = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/salaries");
        const result = await response.json();
        console.log(result);

        const groupedData = groupData(result);
        setData(groupedData);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    };

    fetchData();
  }, []);

  const groupData = (data) => {
    const grouped = {};

    data.forEach((entry) => {
      if (!grouped[entry.employeeName]) {
        grouped[entry.employeeName] = {
          employeeName: entry.employeeName,
          totalSalary: 0,
          totalWorkingHours: 0,
          details: [],
        };
      }
      grouped[entry.employeeName].totalSalary += entry.salary;
      grouped[entry.employeeName].totalWorkingHours += entry.workingHours;
      grouped[entry.employeeName].details.push({
        salary: entry.salary,
        workingHours: entry.workingHours,
        date: entry.date,
      });
    });

    Object.values(grouped).forEach((employee) => {
      employee.details.sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return Object.values(grouped);
  };

  const toggleDropdown = (employeeName) => {
    setSelectedRow(selectedRow === employeeName ? null : employeeName);
  };

  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
        <thead>
          <tr className="bg-teal-950">
            <th className="p-2">Mitarbeitername</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamte Wochenstunden</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <React.Fragment key={row.employeeName}>
              <tr
                className="border rounded-md cursor-pointer hover:bg-teal-950"
                onClick={() => toggleDropdown(row.employeeName)}
              >
                <td className="p-2 text-center">{row.employeeName}</td>
                <td className="p-2 text-center">{row.totalSalary}€</td>
                <td className="p-2 text-center">{row.totalWorkingHours} h</td>
              </tr>
              {selectedRow === row.employeeName && (
                <tr>
                  <td colSpan="3" className="p-4 text-center">
                    <div className="bg-teal-950 rounded-md shadow-lg p-4">
                      <h3 className="text-lg font-bold mb-2">Details</h3>
                      <ul>
                        {row.details.map((detail, index) => (
                          <li key={index} className="mb-2">
                            <strong>Datum:</strong> {detail.date}, <strong>Gehalt:</strong> {detail.salary}€, <strong>Stunden:</strong> {detail.workingHours} h
                          </li>
                        ))}
                      </ul>
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
