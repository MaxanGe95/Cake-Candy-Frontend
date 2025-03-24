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

  // Benutzerfreundliche Kalenderwoche berechnen
  const getUserFriendlyWeek = (date) => {
    const tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() - tempDate.getDay()); // Auf den letzten Sonntag setzen
    const year = tempDate.getFullYear();
    const yearStart = new Date(year, 0, 1); // Der erste Tag des Jahres
    const daysBetween = Math.floor((tempDate - yearStart) / (1000 * 60 * 60 * 24));
    const week = Math.floor(daysBetween / 7) + 1;
  
    return `KW ${week} (${year})`; // Jahr hinzufügen
  };
  

  const groupData = (data) => {
    const grouped = {};

    data.forEach((entry) => {
      if (!grouped[entry.employeeName]) {
        grouped[entry.employeeName] = {
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
      const week = getUserFriendlyWeek(dateObj);

      if (!grouped[entry.employeeName].months[month]) {
        grouped[entry.employeeName].months[month] = {
          totalSalary: 0,
          totalWorkingHours: 0,
          weeks: {},
        };
      }
      if (!grouped[entry.employeeName].months[month].weeks[week]) {
        grouped[entry.employeeName].months[month].weeks[week] = [];
      }

      grouped[entry.employeeName].months[month].totalSalary += entry.salary;
      grouped[entry.employeeName].months[month].totalWorkingHours +=
        entry.workingHours;

      grouped[entry.employeeName].months[month].weeks[week].push({
        ...entry,
        dateObj,
      });
    });

    // Sortiere die Mitarbeiter alphabetisch
    const sortedEmployees = Object.keys(grouped).sort();

    const sortedGrouped = {};

    sortedEmployees.forEach((employeeName) => {
      const employee = grouped[employeeName];

      // Sortiere Monate chronologisch
      const sortedMonths = Object.keys(employee.months).sort((a, b) => {
        const monthsOrder = [
          "Januar",
          "Februar",
          "März",
          "April",
          "Mai",
          "Juni",
          "Juli",
          "August",
          "September",
          "Oktober",
          "November",
          "Dezember",
        ];
        return monthsOrder.indexOf(a) - monthsOrder.indexOf(b);
      });

      sortedGrouped[employeeName] = { ...employee, months: {} };

      sortedMonths.forEach((month) => {
        const sortedWeeks = Object.keys(employee.months[month].weeks).sort((a, b) => {
          const yearA = employee.months[month].weeks[a][0].dateObj.getFullYear();
          const yearB = employee.months[month].weeks[b][0].dateObj.getFullYear();
          const weekA = parseInt(a.split(" ")[1]);
          const weekB = parseInt(b.split(" ")[1]);
        
          return yearB - yearA || weekA - weekB; // Erst nach Jahr absteigend, dann nach KW aufsteigend
        });
        

        sortedGrouped[employeeName].months[month] = {
          ...employee.months[month],
          weeks: {},
        };

        sortedWeeks.forEach((week) => {
          sortedGrouped[employeeName].months[month].weeks[week] =
            employee.months[month].weeks[week].sort(
              (a, b) => a.dateObj - b.dateObj
            );
        });
      });
    });

    return sortedGrouped;
  };

  return (
    <div className="container mx-auto p-6"> 
      {/* Hauptübersicht */}
      <table className="min-w-full  text-amber-100 border rounded-md overflow-hidden text-center">
        <thead className="bg-teal-950/80">
          <tr className="">
            <th className="p-2">Mitarbeiter</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamtstunden</th>
          </tr>
        </thead>
        <tbody className="">
          {Object.entries(data).map(([employeeName, employee]) => (
            <React.Fragment key={employeeName}>
              <tr className="border border-amber-100 cursor-pointer hover:bg-[#7ec6cc80] "
                  onClick={() => setSelectedEmployee( selectedEmployee === employeeName ? null : employeeName )}>
                <td className="p-2 text-left">{employeeName}</td>
                <td className="p-2">{employee.totalSalary.toFixed(2)}$</td>
                <td className="p-2">{employee.totalWorkingHours.toFixed(1)} h</td>
              </tr>

              {/* Monatstübersicht */}

              {selectedEmployee === employeeName && (
             <tr className="">
             <td colSpan="3" className="p-4">
              <table className="w-full bg-teal-950/80 rounded-md overflow-hidden text-center">
                <thead className="">
                  <tr className="text-amber-100">
                    <th className="p-2">Monat</th>
                    <th className="p-2">Gesamtgehalt</th>
                    <th className="p-2">Gesamtstunden</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEmployee === employeeName && 
                    Object.keys(employee.months).map((month) => (
                      <React.Fragment key={month}>
                        <tr className="cursor-pointer hover:bg-[#7ec6cc80] shadow-lg bg-teal-300/35 rounded-md"
                           onClick={() =>
                            setSelectedMonth((prev) => ({ ...prev,[employeeName]: prev[employeeName] === month ? null : month
                            }))}>
                              <td className="p-2">{month}</td>
                              <td>{employee.months[month].totalSalary.toFixed(2)}$</td>
                              <td>{employee.months[month].totalWorkingHours.toFixed(1)} $</td>
                            </tr>
                        
                        {/* {selectedEmployee === employeeName &&
                        Object.keys(employee.months).map((month) => (
                        <React.Fragment key={month}>
                         <tr
                       className="cursor-pointer hover:bg-[#7ec6cc80] bg-teal-900"
                      onClick={() => setSelectedMonth((prev) => ({
                        ...prev,
                        [employeeName]: prev[employeeName] === month ? null : month,
                      }))}
                    >
                      <td className="p-2" colSpan={1}>{month}</td>
                      <td colSpan={1}>{employee.months[month].totalSalary.toFixed(2)}$</td>
                      <td colSpan={1}>{employee.months[month].totalWorkingHours.toFixed(1)}$</td>
                    </tr> */}

                    {selectedMonth[employeeName] === month && (
                      <tr>
                        <td colSpan="3">
                        <table className="w-full bg-teal-900 rounded-md shadow-lg overflow-hidden">
                          <thead className="bg-teal-950 ">
                            <tr className="">
                              <th className="p-2">KW</th>
                              <th className="p-2">Gesamtgehalt</th>
                              <th className="p-2">Gesamtstunden</th>
                            </tr>
                          </thead>
                          <tbody>
                          {selectedMonth[employeeName] === month &&
                            Object.keys(employee.months[month].weeks).map((week) => (
                                <React.Fragment key={week}>
                                  <tr className="cursor-pointer hover:bg-[#7ec6cc80] bg-teal-800 shadow-lg border-1 border-amber-300"
                                    onClick={() =>
                                      setSelectedWeek((prev) => ({...prev,[`${employeeName}-${month}`]: prev[`${employeeName}-${month}`] === week ? null : week}))}>
                    
                                      <td className="p-2">{week}</td>
                                      <td className="p-2">{employee.months[month].weeks[week].reduce(
                                          (acc, entry) => acc + entry.salary,0).toFixed(2)} $</td>
                                      <td className="p-2">{employee.months[month].weeks[week].reduce(
                                          (acc, entry) => acc + entry.workingHours,0).toFixed(1)} h</td>
                                
                                  </tr>

                       {/* {selectedMonth[employeeName] === month &&
                      Object.keys(employee.months[month].weeks).map((week) => (
                        <React.Fragment key={week}>
                          <tr className="cursor-pointer hover:bg-[#7ec6cc80] bg-teal-800 shadow-lg border-1 border-amber-300"
                            onClick={() => setSelectedWeek((prev) => ({
                              ...prev,
                              [`${employeeName}-${month}`]: prev[`${employeeName}-${month}`] === week ? null : week,
                            }))}
                          >
                            <td className="p-2" colSpan={1}>{week}</td>
                            <td className="p-2" colSpan={1}>{employee.months[month].weeks[week].reduce((acc, entry) => acc + entry.salary, 0).toFixed(2)}$</td>
                            <td className="p-2" colSpan={1}>{employee.months[month].weeks[week].reduce((acc, entry) => acc + entry.workingHours, 0).toFixed(1)} h</td>
                          </tr> */}

            {/* Wochenübersicht */}
            {selectedWeek[`${employeeName}-${month}`] === week &&(
            <tr>    
              <td colSpan="3">    
                 <table className="w-full bg-teal-900 rounded-md shadow-lg overflow-hidden">
                          <thead className="bg-teal-950 ">
                            <tr className="">
                              <th className="p-2">Datum</th>
                              <th className="p-2">Gesamtgehalt</th>
                              <th className="p-2">Gesamtstunden</th>
                            </tr>
                           {selectedWeek[`${employeeName}-${month}`] === week && 
                              employee.months[month].weeks[week].map((entry, index) => (
                                    <tr key={index} className="bg-teal-600">
                                        <td className="p-2">{entry.date}</td>
                                        <td className="p-2">{entry.salary.toFixed(2)} $</td>
                                        <td className="p-2">{entry.workingHours.toFixed(1)} h</td>
                                    </tr>
                                      )
                                    )}
                          </thead>
                  </table>
              </td>      
             </tr>
            )}
                                  {/* {selectedWeek[`${employeeName}-${month}`] === week &&
                            employee.months[month].weeks[week].map((entry, index) => (
                              <tr key={index} className="bg-teal-600">
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2">{entry.salary.toFixed(2)}$</td>
                                <td className="p-2">{entry.workingHours.toFixed(1)} h</td>
                              </tr>  )) } */}
                                </React.Fragment>
                              )                    
                            )}
                            
                        </tbody>
                        </table>
                        </td>
                        </tr>
                        )}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
              </td>
              </tr>)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MitarbeiterTabelle;

//<------------------------------------------------------------------------------------------------------------->>

/* import React, { useState, useEffect } from "react";

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

  const monthOrder = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

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
      grouped[entry.employeeName].months[month][week].push({
        ...entry,
        formattedDate,
      });
    });

    // Sortiere die Monate und Wochen chronologisch
    Object.values(grouped).forEach((employee) => {
      employee.months = Object.keys(employee.months)
        .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
        .reduce((acc, key) => {
          acc[key] = employee.months[key];
          return acc;
        }, {});

      Object.keys(employee.months).forEach((month) => {
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
      [`${employee}-${month}`]:
        prev[`${employee}-${month}`] === week ? null : week,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full border border-gray-500">
        <thead>
          <tr className="bg-teal-950 text-white">
            <th className="p-2">Mitarbeitername</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamte Wochenstunden</th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee) => (
            <React.Fragment key={employee.employeeName}>
              <tr
                className="cursor-pointer "
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
                          <div className="pl-4">
                            {Object.keys(employee.months[month]).map((week) => (
                              <div key={week} className="mb-2">
                                <button
                                  className="w-full text-left bg-green-500 text-white p-2"
                                  onClick={() =>
                                    toggleWeek(
                                      employee.employeeName,
                                      month,
                                      week
                                    )
                                  }
                                >
                                  {week}
                                </button>
                                {selectedWeek[
                                  `${employee.employeeName}-${month}`
                                ] === week && (
                                  <table className="w-full border mt-2">
                                    <thead>
                                      <tr className="bg-gray-600 text-white">
                                        <th className="p-2">Datum</th>
                                        <th className="p-2">Gehalt</th>
                                        <th className="p-2">Stunden</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {employee.months[month][week].map(
                                        (entry, index) => (
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
                                        )
                                      )}
                                      <tr className="bg-gray-300 font-bold">
                                        <td className="p-2 text-center">
                                          Gesamt
                                        </td>
                                        <td className="p-2 text-center">
                                          {Object.values(employee.months[month])
                                            .flat()
                                            .reduce(
                                              (sum, e) => sum + e.salary,
                                              0
                                            )
                                            .toFixed(2)}
                                          €
                                        </td>
                                        <td className="p-2 text-center">
                                          {Object.values(employee.months[month])
                                            .flat()
                                            .reduce(
                                              (sum, e) => sum + e.workingHours,
                                              0
                                            )
                                            .toFixed(1)}{" "}
                                          h
                                        </td>
                                      </tr>
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
 */

/* import React, { useState, useEffect } from "react";

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

  const monthOrder = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];

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
      grouped[entry.employeeName].months[month][week].push({
        ...entry,
        formattedDate,
      });
    });

    Object.values(grouped).forEach((employee) => {
      employee.months = Object.keys(employee.months)
        .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
        .reduce((acc, key) => {
          acc[key] = employee.months[key];
          return acc;
        }, {});
    });

    return Object.values(grouped);
  };

  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full border border-gray-500">
        <thead>
          <tr className="bg-teal-950 text-white">
            <th className="p-2">Mitarbeitername</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamte Wochenstunden</th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee) => (
            <React.Fragment key={employee.employeeName}>
              <tr className="cursor-pointer" onClick={() => setSelectedEmployee(selectedEmployee === employee.employeeName ? null : employee.employeeName)}>
                <td className="p-2 text-center">{employee.employeeName}</td>
                <td className="p-2 text-center">{employee.totalSalary.toFixed(2)}€</td>
                <td className="p-2 text-center">{employee.totalWorkingHours.toFixed(1)} h</td>
              </tr>
              {selectedEmployee === employee.employeeName && (
                <tr>
                  <td colSpan="3" className="p-4">
                    {Object.keys(employee.months).map((month) => (
                      <div key={month} className="mb-2">
                        <button className="w-full text-left bg-blue-500 text-white p-2" onClick={() => setSelectedMonth(prev => ({ ...prev, [employee.employeeName]: prev[employee.employeeName] === month ? null : month }))}>
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
                              {Object.values(employee.months[month]).flat().map((entry, index) => (
                                <tr key={index} className="border">
                                  <td className="p-2 text-center">{entry.date}</td>
                                  <td className="p-2 text-center">{entry.salary.toFixed(2)}€</td>
                                  <td className="p-2 text-center">{entry.workingHours.toFixed(1)} h</td>
                                </tr>
                              ))}
                              <tr className="bg-gray-300 font-bold">
                                <td className="p-2 text-center">Gesamt</td>
                                <td className="p-2 text-center">
                                  {Object.values(employee.months[month]).flat().reduce((sum, e) => sum + e.salary, 0).toFixed(2)}€
                                </td>
                                <td className="p-2 text-center">
                                  {Object.values(employee.months[month]).flat().reduce((sum, e) => sum + e.workingHours, 0).toFixed(1)} h
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

export default MitarbeiterTabelle;  */
