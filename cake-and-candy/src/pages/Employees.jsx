import React, { useState, useEffect } from "react";

const MitarbeiterTabelle = () => {
  const [data, setData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/salaries");
        const result = await response.json();
        setData(groupData(result));
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
          months: {},
        };
      }
      grouped[entry.employeeName].totalSalary += entry.salary;
      grouped[entry.employeeName].totalWorkingHours += entry.workingHours;

      const [day, monthNum, year] = entry.date.split(".");
      const formattedDate = `${year}-${monthNum}-${day}`;
      const month = new Date(formattedDate).toLocaleString("de-DE", {
        month: "long",
      });

      if (!grouped[entry.employeeName].months[month]) {
        grouped[entry.employeeName].months[month] = [];
      }
      grouped[entry.employeeName].months[month].push(entry);
    });
    return Object.values(grouped);
  };

  const toggleEmployee = (name) => {
    setSelectedEmployee(selectedEmployee === name ? null : name);
  };

  const toggleMonth = (employee, month) => {
    setSelectedMonth((prev) => ({
      ...prev,
      [employee]: prev[employee] === month ? null : month,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full border border-gray-500">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2">Mitarbeitername</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamte Wochenstunden</th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee) => (
            <React.Fragment key={employee.employeeName}>
              <tr
                className="cursor-pointer bg-gray-200"
                onClick={() => toggleEmployee(employee.employeeName)}
              >
                <td className="p-2 text-center">{employee.employeeName}</td>
                <td className="p-2 text-center">
                  {employee.totalSalary.toFixed(2)}€
                </td>
                <td className="p-2 text-center">
                  {employee.totalWorkingHours.toFixed(1)} h
                </td>
              </tr>
              {selectedEmployee === employee.employeeName && (
                <tr>
                  <td colSpan="3" className="p-4">
                    {Object.keys(employee.months).map((month) => (
                      <div key={month} className="mb-2">
                        <button
                          className="w-full text-left bg-blue-500 text-white p-2"
                          onClick={() =>
                            toggleMonth(employee.employeeName, month)
                          }
                        >
                          {month}
                        </button>
                        {selectedMonth[employee.employeeName] === month && (
                          <table className="w-full border mt-2">
                            <thead>
                              <tr className="bg-gray-600 text-white">
                                <th className="p-2">Datum</th>
                                <th className="p-2">Gehalt</th>
                                <th className="p-2">Stunden</th>
                              </tr>
                            </thead>
                            <tbody>
                              {employee.months[month].map((entry, index) => (
                                <tr key={index} className="border">
                                  <td className="p-2 text-center">
                                    {entry.date}
                                  </td>
                                  <td className="p-2 text-center">
                                    {entry.salary.toFixed(2)}€
                                  </td>
                                  <td className="p-2 text-center">
                                    {entry.workingHours.toFixed(1)} h
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-gray-300 font-bold">
                                <td className="p-2 text-center">Gesamt</td>
                                <td className="p-2 text-center">
                                  {employee.months[month]
                                    .reduce((sum, e) => sum + e.salary, 0)
                                    .toFixed(2)}
                                  €
                                </td>
                                <td className="p-2 text-center">
                                  {employee.months[month]
                                    .reduce((sum, e) => sum + e.workingHours, 0)
                                    .toFixed(1)}{" "}
                                  h
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
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

/* import React, { useState, useEffect } from "react";

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
 */
