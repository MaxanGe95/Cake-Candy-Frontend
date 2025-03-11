import React, { useState, useEffect } from "react";

const MitarbeiterTabelle = () => {
  const [data, setData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState({});
  const [selectedWeek, setSelectedWeek] = useState({});

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

  const getISOWeek = (date) => {
    const tempDate = new Date(date);
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
    return `KW ${weekNo}`;
  };

  const monthOrder = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

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
      const dateObj = new Date(formattedDate);
      const month = dateObj.toLocaleString("de-DE", { month: "long" });
      const week = getISOWeek(dateObj);

      if (!grouped[entry.employeeName].months[month]) {
        grouped[entry.employeeName].months[month] = {};
      }
      if (!grouped[entry.employeeName].months[month][week]) {
        grouped[entry.employeeName].months[month][week] = [];
      }
      grouped[entry.employeeName].months[month][week].push({ ...entry, formattedDate });
    });
    
    // Sortiere die Monate und Wochen chronologisch
    Object.values(grouped).forEach(employee => {
      employee.months = Object.keys(employee.months)
        .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
        .reduce((acc, key) => {
          acc[key] = employee.months[key];
          return acc;
        }, {});

      Object.keys(employee.months).forEach(month => {
        employee.months[month] = Object.keys(employee.months[month])
          .sort()
          .reduce((acc, key) => {
            acc[key] = employee.months[month][key];
            return acc;
          }, {});
      });
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

  const toggleWeek = (employee, month, week) => {
    setSelectedWeek((prev) => ({
      ...prev,
      [`${employee}-${month}`]: prev[`${employee}-${month}`] === week ? null : week,
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
              <tr className="cursor-pointer bg-gray-200" onClick={() => toggleEmployee(employee.employeeName)}>
                <td className="p-2 text-center">{employee.employeeName}</td>
                <td className="p-2 text-center">{employee.totalSalary.toFixed(2)}€</td>
                <td className="p-2 text-center">{employee.totalWorkingHours.toFixed(1)} h</td>
              </tr>
              {selectedEmployee === employee.employeeName && (
                <tr>
                  <td colSpan="3" className="p-4">
                    {Object.keys(employee.months).map((month) => (
                      <div key={month} className="mb-2">
                        <button className="w-full text-left bg-blue-500 text-white p-2" onClick={() => toggleMonth(employee.employeeName, month)}>
                          {month}
                        </button>
                        {selectedMonth[employee.employeeName] === month && (
                          <div className="pl-4">
                            {Object.keys(employee.months[month]).map((week) => (
                              <div key={week} className="mb-2">
                                <button className="w-full text-left bg-green-500 text-white p-2" onClick={() => toggleWeek(employee.employeeName, month, week)}>
                                  {week}
                                </button>
                                {selectedWeek[`${employee.employeeName}-${month}`] === week && (
                                  <table className="w-full border mt-2">
                                    <thead>
                                      <tr className="bg-gray-600 text-white">
                                        <th className="p-2">Datum</th>
                                        <th className="p-2">Gehalt</th>
                                        <th className="p-2">Stunden</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {employee.months[month][week].map((entry, index) => (
                                        <tr key={index} className="border">
                                          <td className="p-2 text-center">{entry.date}</td>
                                          <td className="p-2 text-center">{entry.salary.toFixed(2)}€</td>
                                          <td className="p-2 text-center">{entry.workingHours.toFixed(1)} h</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            ))}
                          </div>
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
