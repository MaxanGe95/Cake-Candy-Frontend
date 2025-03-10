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
                className="border rounded-md cursor-pointer "
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
                      <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
                        <thead>
                          <tr className="bg-teal-950">
                            <th className="p-2">Datum</th>
                            <th className="p-2">Gehalt</th>
                            <th className="p-2">Stunden</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.details.map((detail, index) => (
                            <tr key={index} className="border rounded-md">
                              <td className="p-2 text-center">{detail.date}</td>
                              <td className="p-2 text-center">
                                {detail.salary}€
                              </td>
                              <td className="p-2 text-center">
                                {detail.workingHours} h
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
