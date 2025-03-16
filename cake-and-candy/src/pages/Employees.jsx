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
    tempDate.setDate(tempDate.getDate() - tempDate.getDay()); // Setzt den Tag auf den letzten Sonntag
    const yearStart = new Date(tempDate.getFullYear(), 0, 1); // Der erste Tag des Jahres
    const daysBetween = Math.floor((date - yearStart) / (1000 * 60 * 60 * 24)); // Tage bis zum Datum
    const week = Math.floor(daysBetween / 7) + 1; // KW berechnen
    return `KW ${week}`;
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
      grouped[entry.employeeName].months[month].totalWorkingHours += entry.workingHours;

      grouped[entry.employeeName].months[month].weeks[week].push({ ...entry, dateObj });
    });

    // Sortiere die Mitarbeiter alphabetisch
    const sortedEmployees = Object.keys(grouped).sort();

    const sortedGrouped = {};

    sortedEmployees.forEach((employeeName) => {
      const employee = grouped[employeeName];

      // Sortiere Monate chronologisch
      const sortedMonths = Object.keys(employee.months).sort((a, b) => {
        const monthsOrder = [
          "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        return monthsOrder.indexOf(a) - monthsOrder.indexOf(b);
      });

      sortedGrouped[employeeName] = { ...employee, months: {} };

      sortedMonths.forEach((month) => {
        const sortedWeeks = Object.keys(employee.months[month].weeks).sort((a, b) => {
          return parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]);
        });

        sortedGrouped[employeeName].months[month] = {
          ...employee.months[month],
          weeks: {},
        };

        sortedWeeks.forEach((week) => {
          sortedGrouped[employeeName].months[month].weeks[week] = employee.months[month].weeks[week].sort(
            (a, b) => a.dateObj - b.dateObj
          );
        });
      });
    });

    return sortedGrouped;
  };

  return (
    <div className="container mx-auto p-6">

       <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden text-center">
        <thead className="bg-teal-950">
          <tr className="text-white">
            <th className="p-2">Mitarbeiter</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamtstunden</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(data).map(([employeeName, employee]) => (
            <React.Fragment key={employeeName}>
              <tr
                className="cursor-pointer border border-amber-100 text-white"
                onClick={() => setSelectedEmployee(selectedEmployee === employeeName ? null : employeeName)}
              >
                <td className="p-2 text-left">{employeeName}</td>
                <td className="p-2">{employee.totalSalary.toFixed(2)}$</td>
                <td className="p-2">{employee.totalWorkingHours.toFixed(1)} h</td>
              </tr>





              {selectedEmployee === employeeName &&
                Object.keys(employee.months).map((month) => (
                  <React.Fragment key={month}>
                    <tr
                      className="cursor-pointer bg-teal-900 text-white"
                      onClick={() => setSelectedMonth((prev) => ({
                        ...prev,
                        [employeeName]: prev[employeeName] === month ? null : month,
                      }))}
                    >
                      <td className="p-2" colSpan={1}>{month}</td>
                      <td colSpan={1}>{employee.months[month].totalSalary.toFixed(2)}$</td>
                      <td colSpan={1}>{employee.months[month].totalWorkingHours.toFixed(1)}$</td>
                    </tr>




                    {selectedMonth[employeeName] === month &&
                      Object.keys(employee.months[month].weeks).map((week) => (
                        <React.Fragment key={week}>
                          <tr
                            className="cursor-pointer bg-teal-800 text-white border-1 border-amber-300"
                            onClick={() => setSelectedWeek((prev) => ({
                              ...prev,
                              [`${employeeName}-${month}`]: prev[`${employeeName}-${month}`] === week ? null : week,
                            }))}
                          >
                            <td className="p-2" colSpan={1}>{week}</td>
                            <td className="p-2" colSpan={1}>{employee.months[month].weeks[week].reduce((acc, entry) => acc + entry.salary, 0).toFixed(2)}$</td>
                            <td className="p-2" colSpan={1}>{employee.months[month].weeks[week].reduce((acc, entry) => acc + entry.workingHours, 0).toFixed(1)} h</td>
                          </tr>



                          {selectedWeek[`${employeeName}-${month}`] === week &&
                            employee.months[month].weeks[week].map((entry, index) => (
                              <tr key={index} className="bg-teal-600">
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2">{entry.salary.toFixed(2)}$</td>
                                <td className="p-2">{entry.workingHours.toFixed(1)} h</td>
                              </tr>
                            ))
                          }
                        </React.Fragment>
                      ))
                    }
                  </React.Fragment>
                ))
              }
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
    
    // Berechne den ersten Sonntag des Jahres
    tempDate.setDate(tempDate.getDate() - tempDate.getDay()); // Setzt den Tag auf den letzten Sonntag
    const yearStart = new Date(tempDate.getFullYear(), 0, 1); // Der erste Tag des Jahres
    
    // Berechne die Kalenderwoche (KW)
    const daysBetween = Math.floor((date - yearStart) / (1000 * 60 * 60 * 24)); // Tage bis zum Datum
    const week = Math.floor(daysBetween / 7) + 1; // KW berechnen
    
    return `KW ${week}`;
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
      const week = getUserFriendlyWeek(dateObj); // Benutzerfreundliche Woche

      if (!grouped[entry.employeeName].months[month]) {
        grouped[entry.employeeName].months[month] = {};
      }
      if (!grouped[entry.employeeName].months[month][week]) {
        grouped[entry.employeeName].months[month][week] = [];
      }

      grouped[entry.employeeName].months[month][week].push({ ...entry, dateObj });
    });

    // Sortiere die Mitarbeiter alphabetisch
    const sortedEmployees = Object.keys(grouped).sort();

    const sortedGrouped = {};

    sortedEmployees.forEach((employeeName) => {
      const employee = grouped[employeeName];

      // Sortiere Monate chronologisch
      const sortedMonths = Object.keys(employee.months).sort((a, b) => {
        const monthsOrder = [
          "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        return monthsOrder.indexOf(a) - monthsOrder.indexOf(b);
      });

      sortedGrouped[employeeName] = { ...employee, months: {} };

      sortedMonths.forEach((month) => {
        const sortedWeeks = Object.keys(employee.months[month]).sort((a, b) => {
          return parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]);
        });

        sortedGrouped[employeeName].months[month] = {};

        sortedWeeks.forEach((week) => {
          sortedGrouped[employeeName].months[month][week] = employee.months[month][week].sort(
            (a, b) => a.dateObj - b.dateObj
          );
        });
      });
    });

    return sortedGrouped;
  };

  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2">Mitarbeiter</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamtstunden</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([employeeName, employee]) => (
            <React.Fragment key={employeeName}>
              <tr
                className="cursor-pointer bg-gray-700 text-white"
                onClick={() => setSelectedEmployee(selectedEmployee === employeeName ? null : employeeName)}
              >
                <td className="p-2">{employeeName}</td>
                <td className="p-2">{employee.totalSalary.toFixed(2)}$</td>
                <td className="p-2">{employee.totalWorkingHours.toFixed(1)} h</td>
              </tr>

              {selectedEmployee === employeeName &&
                Object.keys(employee.months).map((month) => (
                  <React.Fragment key={month}>
                    <tr
                      className="cursor-pointer bg-gray-600 text-white"
                      onClick={() => setSelectedMonth((prev) => ({
                        ...prev,
                        [employeeName]: prev[employeeName] === month ? null : month,
                      }))}
                    >
                      <td className="p-2" colSpan={""}>{month}</td>
                      <td className="p-2" colSpan={""}>{employeeName}</td>
                      <td className="p-2" colSpan={""}>{month}</td>


                    </tr>

                    {selectedMonth[employeeName] === month &&
                      Object.keys(employee.months[month]).map((week) => (
                        <React.Fragment key={week}>
                          <tr
                            className="cursor-pointer bg-gray-500 text-white"
                            onClick={() => setSelectedWeek((prev) => ({
                              ...prev,
                              [`${employeeName}-${month}`]: prev[`${employeeName}-${month}`] === week ? null : week,
                            }))}
                          >
                            <td className="p-2" colSpan={3}>{week}</td>
                          </tr>

                          {selectedWeek[`${employeeName}-${month}`] === week &&
                            employee.months[month][week].map((entry, index) => (
                              <tr key={index} className="bg-gray-400 text-black">
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2">{entry.salary.toFixed(2)}$</td>
                                <td className="p-2">{entry.workingHours.toFixed(1)} h</td>
                              </tr>
                            ))
                          }
                        </React.Fragment>
                      ))
                    }
                  </React.Fragment>
                ))
              }
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MitarbeiterTabelle; */


/* import React, { useState, useEffect } from "react";

const MitarbeiterTabelle = () => {
  // State, um die Daten zu speichern, die vom Backend kommen
  const [data, setData] = useState([]);
  
  // State für ausgewählten Mitarbeiter, Monat und Woche
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState({});
  const [selectedWeek, setSelectedWeek] = useState({});

  // useEffect wird einmal beim Laden der Seite ausgeführt, um die Daten zu holen
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hole die Daten vom Backend (zum Beispiel vom lokalen Server)
        const response = await fetch("http://localhost:5000/api/salaries");
        const result = await response.json();
        
        // Verarbeite die Daten und setze sie im State
        setData(groupData(result));
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    };

    fetchData();
  }, []);

  // Funktion, die die Daten nach Mitarbeiter, Monat, Woche und Tag gruppiert
  const groupData = (data) => {
    const grouped = {};

    // Gehe durch jedes Element und gruppiere nach Mitarbeiter und Datum
    data.forEach((entry) => {
      if (!grouped[entry.employeeName]) {
        grouped[entry.employeeName] = {
          totalSalary: 0,
          totalWorkingHours: 0,
          months: {},
        };
      }

      // Summiere Gehalt und Stunden für jeden Mitarbeiter
      grouped[entry.employeeName].totalSalary += entry.salary;
      grouped[entry.employeeName].totalWorkingHours += entry.workingHours;

      // Extrahiere Tag, Monat und Jahr aus dem Datum (z.B. 10.03.2025)
      const [day, monthNum, year] = entry.date.split(".");
      const formattedDate = `${year}-${monthNum}-${day}`;
      const dateObj = new Date(formattedDate);

      // Hole den Monat und die Woche
      const month = dateObj.toLocaleString("de-DE", { month: "long" });
      const week = `KW ${getISOWeek(dateObj)}`;

      // Gruppiere nach Monat und Woche
      if (!grouped[entry.employeeName].months[month]) {
        grouped[entry.employeeName].months[month] = {};
      }
      if (!grouped[entry.employeeName].months[month][week]) {
        grouped[entry.employeeName].months[month][week] = [];
      }
      
      // Füge den Datensatz der entsprechenden Woche hinzu
      grouped[entry.employeeName].months[month][week].push({ ...entry, dateObj });
    });

    // Sortiere die Mitarbeiter alphabetisch
    const sortedEmployees = Object.keys(grouped).sort();

    // Neue strukturierte Liste mit sortierten Mitarbeitern, Monaten und Wochen
    const sortedGrouped = {};

    sortedEmployees.forEach((employeeName) => {
      const employee = grouped[employeeName];

      // Sortiere Monate chronologisch
      const sortedMonths = Object.keys(employee.months).sort((a, b) => {
        const monthsOrder = [
          "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
        ];
        return monthsOrder.indexOf(a) - monthsOrder.indexOf(b); // Vergleiche Monate
      });

      sortedGrouped[employeeName] = { ...employee, months: {} };

      sortedMonths.forEach((month) => {
        const sortedWeeks = Object.keys(employee.months[month]).sort((a, b) => {
          return parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]); // Sortiere Wochen chronologisch (KW 1, KW 2, ...)
        });

        sortedGrouped[employeeName].months[month] = {};

        sortedWeeks.forEach((week) => {
          sortedGrouped[employeeName].months[month][week] = employee.months[month][week].sort(
            (a, b) => a.dateObj - b.dateObj // Sortiere Tage chronologisch
          );
        });
      });
    });

    return sortedGrouped;
  };

  // Holt die Kalenderwoche basierend auf dem Datum
  const getISOWeek = (date) => {
    const tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    return Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
  };

  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2">Mitarbeiter</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamtstunden</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([employeeName, employee]) => (
            <React.Fragment key={employeeName}>
              <tr
                className="cursor-pointer bg-gray-700 text-white"
                onClick={() => setSelectedEmployee(selectedEmployee === employeeName ? null : employeeName)}
              >
                <td className="p-2">{employeeName}</td>
                <td className="p-2">{employee.totalSalary.toFixed(2)}$</td>
                <td className="p-2">{employee.totalWorkingHours.toFixed(1)} h</td>
              </tr>

              {selectedEmployee === employeeName &&
                Object.keys(employee.months).map((month) => (
                  <React.Fragment key={month}>
                    <tr
                      className="cursor-pointer bg-gray-600 text-white"
                      onClick={() => setSelectedMonth((prev) => ({
                        ...prev,
                        [employeeName]: prev[employeeName] === month ? null : month,
                      }))}
                    >
                      <td className="p-2" colSpan={3}>{month}</td>
                    </tr>

                    {selectedMonth[employeeName] === month &&
                      Object.keys(employee.months[month]).map((week) => (
                        <React.Fragment key={week}>
                          <tr
                            className="cursor-pointer bg-gray-500 text-white"
                            onClick={() => setSelectedWeek((prev) => ({
                              ...prev,
                              [`${employeeName}-${month}`]: prev[`${employeeName}-${month}`] === week ? null : week,
                            }))}
                          >
                            <td className="p-2" colSpan={3}>{week}</td>
                          </tr>

                          {selectedWeek[`${employeeName}-${month}`] === week &&
                            employee.months[month][week].map((entry, index) => (
                              <tr key={index} className="bg-gray-400 text-black">
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2">{entry.salary.toFixed(2)}$</td>
                                <td className="p-2">{entry.workingHours.toFixed(1)} h</td>
                              </tr>
                            ))
                          }
                        </React.Fragment>
                      ))
                    }
                  </React.Fragment>
                ))
              }
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
        setData(groupData(result)); // Gruppiere und sortiere die Daten beim Laden
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    };

    fetchData();
  }, []);

  // Funktion zur Berechnung der benutzerfreundlichen Kalenderwoche
  const getUserFriendlyWeek = (date) => {
    const tempDate = new Date(date);
    
    // Zuerst sicherstellen, dass das Jahr korrekt gesetzt wird
    const year = tempDate.getFullYear();
    
    // Berechne den Start der ersten Kalenderwoche des Jahres
    const startOfYear = new Date(year, 0, 1); 
    const dayOfYear = Math.floor((tempDate - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    
    // Bestimme die Kalenderwoche
    const weekNumber = Math.ceil(dayOfYear / 7);
    
    // Falls der Tag im Dezember liegt und in die erste Woche des neuen Jahres fällt, korrigiere dies
    if (tempDate.getMonth() === 0 && weekNumber === 1) {
      return `KW 1`;  // Januar-Woche als KW 1 anzeigen
    }

    return `KW ${weekNumber}`;
  };

  // Gruppierung und chronologische Sortierung der Daten
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
      const dateObj = new Date(formattedDate); // Datum in ein Date-Objekt umwandeln

      const month = dateObj.toLocaleString("de-DE", { month: "long" });
      const week = getUserFriendlyWeek(dateObj); // Benutzerfreundliche Kalenderwoche

      if (!grouped[entry.employeeName].months[month]) {
        grouped[entry.employeeName].months[month] = {};
      }
      if (!grouped[entry.employeeName].months[month][week]) {
        grouped[entry.employeeName].months[month][week] = [];
      }
      grouped[entry.employeeName].months[month][week].push({ ...entry, dateObj });
    });

    // Sortiere Daten chronologisch
    Object.keys(grouped).forEach((employeeName) => {
      const employee = grouped[employeeName];
      Object.keys(employee.months).forEach((month) => {
        const weeks = employee.months[month];
        
        // Sortiere Wochen innerhalb eines Monats nach Datum
        Object.keys(weeks).forEach((week) => {
          weeks[week].sort((a, b) => a.dateObj - b.dateObj); // Sortiere nach Datum
        });
      });
    });

    return grouped;
  };

  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2">Mitarbeiter</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamtstunden</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([employeeName, employee]) => (
            <React.Fragment key={employeeName}>
              <tr
                className="cursor-pointer bg-gray-700 text-white"
                onClick={() => setSelectedEmployee(selectedEmployee === employeeName ? null : employeeName)}
              >
                <td className="p-2">{employeeName}</td>
                <td className="p-2">{employee.totalSalary.toFixed(2)}$</td>
                <td className="p-2">{employee.totalWorkingHours.toFixed(1)} h</td>
              </tr>

              {selectedEmployee === employeeName &&
                Object.keys(employee.months).map((month) => (
                  <React.Fragment key={month}>
                    <tr
                      className="cursor-pointer bg-gray-600 text-white"
                      onClick={() => setSelectedMonth((prev) => ({
                        ...prev,
                        [employeeName]: prev[employeeName] === month ? null : month,
                      }))}
                    >
                      <td className="p-2" colSpan={3}>{month}</td>
                    </tr>

                    {selectedMonth[employeeName] === month &&
                      Object.keys(employee.months[month]).map((week) => (
                        <React.Fragment key={week}>
                          <tr
                            className="cursor-pointer bg-gray-500 text-white"
                            onClick={() => setSelectedWeek((prev) => ({
                              ...prev,
                              [`${employeeName}-${month}`]: prev[`${employeeName}-${month}`] === week ? null : week,
                            }))}
                          >
                            <td className="p-2" colSpan={3}>{week}</td>
                          </tr>

                          {selectedWeek[`${employeeName}-${month}`] === week &&
                            employee.months[month][week].map((entry, index) => (
                              <tr key={index} className="bg-gray-400 text-black">
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2">{entry.salary.toFixed(2)}$</td>
                                <td className="p-2">{entry.workingHours.toFixed(1)} h</td>
                              </tr>
                            ))
                          }
                        </React.Fragment>
                      ))
                    }
                  </React.Fragment>
                ))
              }
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MitarbeiterTabelle; */

/* import React, { useState, useEffect } from "react";

const MitarbeiterTabelle = () => {
  // State-Hooks für Daten und Auswahl
  const [data, setData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState({});
  const [selectedWeek, setSelectedWeek] = useState({});

  // useEffect: Ruft die Daten von der API ab
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/salaries");
        const result = await response.json();
        setData(groupData(result)); // Daten gruppieren
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    };

    fetchData();
  }, []);

  // Funktion zur Berechnung der ISO-Woche aus einem Datum
  const getISOWeek = (date) => {
    const tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    return `KW ${Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7)}`;
  };

  // Funktion zum Gruppieren der Daten (Mitarbeiter → Monat → Woche → Tag)
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
      const week = getISOWeek(dateObj);

      if (!grouped[entry.employeeName].months[month]) {
        grouped[entry.employeeName].months[month] = {};
      }
      if (!grouped[entry.employeeName].months[month][week]) {
        grouped[entry.employeeName].months[month][week] = [];
      }
      grouped[entry.employeeName].months[month][week].push({ ...entry, dateObj });
    });

    return grouped;
  };

  // **JSX Rendering**: Tabelle für die Mitarbeiterdaten
  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2">Mitarbeiter</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamtstunden</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([employeeName, employee]) => (
            <React.Fragment key={employeeName}>
              
              <tr
                className="cursor-pointer bg-gray-700 text-white"
                onClick={() => setSelectedEmployee(selectedEmployee === employeeName ? null : employeeName)}
              >
                <td className="p-2">{employeeName}</td>
                <td className="p-2">{employee.totalSalary.toFixed(2)}$</td>
                <td className="p-2">{employee.totalWorkingHours.toFixed(1)} h</td>
              </tr>

            
              {selectedEmployee === employeeName && (
                Object.keys(employee.months).map((month) => (
                  <React.Fragment key={month}>
                    <tr
                      className="cursor-pointer bg-gray-600 text-white"
                      onClick={() => setSelectedMonth((prev) => ({
                        ...prev,
                        [employeeName]: prev[employeeName] === month ? null : month,
                      }))}
                    >
                      <td className="p-2" colSpan={3}>{month}</td>
                    </tr>

                    {selectedMonth[employeeName] === month && (
                      Object.keys(employee.months[month]).map((week) => (
                        <React.Fragment key={week}>
                          <tr
                            className="cursor-pointer bg-gray-500 text-white"
                            onClick={() => setSelectedWeek((prev) => ({
                              ...prev,
                              [`${employeeName}-${month}`]: prev[`${employeeName}-${month}`] === week ? null : week,
                            }))}
                          >
                            <td className="p-2" colSpan={3}>{week}</td>
                          </tr>

                          {selectedWeek[`${employeeName}-${month}`] === week && (
                            employee.months[month][week].map((entry, index) => (
                              <tr key={index} className="bg-gray-400 text-black">
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2">{entry.salary.toFixed(2)}$</td>
                                <td className="p-2">{entry.workingHours.toFixed(1)} h</td>
                              </tr>
                            ))
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </React.Fragment>
                ))
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
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    return `KW ${Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7)}`;
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
      const week = getISOWeek(dateObj);

      if (!grouped[entry.employeeName].months[month]) {
        grouped[entry.employeeName].months[month] = {};
      }
      if (!grouped[entry.employeeName].months[month][week]) {
        grouped[entry.employeeName].months[month][week] = [];
      }
      grouped[entry.employeeName].months[month][week].push({ ...entry, dateObj });
    });

    return grouped;
  };

  return (
    <div className="container mx-auto p-6">
      <table className="min-w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2">Mitarbeiter</th>
            <th className="p-2">Gesamtgehalt</th>
            <th className="p-2">Gesamtstunden</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([employeeName, employee]) => (
            <React.Fragment key={employeeName}>
              <tr
                className="cursor-pointer bg-gray-700 text-white"
                onClick={() => setSelectedEmployee(selectedEmployee === employeeName ? null : employeeName)}
              >
                <td className="p-2">{employeeName}</td>
                <td className="p-2">{employee.totalSalary.toFixed(2)}$</td>
                <td className="p-2">{employee.totalWorkingHours.toFixed(1)} h</td>
              </tr>

              {selectedEmployee === employeeName && (
                Object.keys(employee.months).map((month) => (
                  <React.Fragment key={month}>
                    <tr
                      className="cursor-pointer bg-gray-600 text-white"
                      onClick={() => setSelectedMonth((prev) => ({
                        ...prev,
                        [employeeName]: prev[employeeName] === month ? null : month,
                      }))}
                    >
                      <td className="p-2" colSpan={3}>{month}</td>
                    </tr>
                    
                    {selectedMonth[employeeName] === month && (
                      Object.keys(employee.months[month]).map((week) => (
                        <React.Fragment key={week}>
                          <tr
                            className="cursor-pointer bg-gray-500 text-white"
                            onClick={() => setSelectedWeek((prev) => ({
                              ...prev,
                              [`${employeeName}-${month}`]: prev[`${employeeName}-${month}`] === week ? null : week,
                            }))}
                          >
                            <td className="p-2" colSpan={3}>{week}</td>
                          </tr>
                          
                          {selectedWeek[`${employeeName}-${month}`] === week && (
                            employee.months[month][week].map((entry, index) => (
                              <tr key={index} className="bg-gray-400 text-black">
                                <td className="p-2">{entry.date}</td>
                                <td className="p-2">{entry.salary.toFixed(2)}$</td>
                                <td className="p-2">{entry.workingHours.toFixed(1)} h</td>
                              </tr>
                            ))
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </React.Fragment>
                ))
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MitarbeiterTabelle; */


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
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    return `KW ${Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7)}`;
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
      const week = getISOWeek(dateObj);

      if (!grouped[entry.employeeName].months[month]) {
        grouped[entry.employeeName].months[month] = {};
      }
      if (!grouped[entry.employeeName].months[month][week]) {
        grouped[entry.employeeName].months[month][week] = [];
      }
      grouped[entry.employeeName].months[month][week].push({ ...entry, dateObj });
    });

    return grouped;
  };

  return (
    <div className="container mx-auto p-6">
      {Object.entries(data).map(([employeeName, employee]) => (
        <div key={employeeName} className="mb-4 border p-4 rounded-lg bg-gray-800 text-white">
          <div
            className="cursor-pointer font-bold text-lg bg-blue-900 p-2 rounded-md text-center"
            onClick={() => setSelectedEmployee(selectedEmployee === employeeName ? null : employeeName)}
          >
            {employeeName} - {employee.totalSalary.toFixed(2)}$ - {employee.totalWorkingHours.toFixed(1)} h
          </div>

          {selectedEmployee === employeeName && (
            <div className="mt-2">
              {Object.keys(employee.months).map((month) => (
                <div key={month} className="w-full p-2 bg-gray-700 mt-2 rounded-md">
                  <div
                    className="cursor-pointer font-semibold bg-blue-700 p-2 rounded-md text-center"
                    onClick={() =>
                      setSelectedMonth((prev) => ({
                        ...prev,
                        [employeeName]: prev[employeeName] === month ? null : month,
                      }))
                    }
                  >
                    {month}
                  </div>

                  {selectedMonth[employeeName] === month && (
                    <div className="mt-2">
                      {Object.keys(employee.months[month]).map((week) => (
                        <div key={week} className="w-full p-2 bg-gray-600 mt-2 rounded-md">
                          <div
                            className="cursor-pointer font-medium bg-blue-500 p-2 rounded-md text-center"
                            onClick={() =>
                              setSelectedWeek((prev) => ({
                                ...prev,
                                [`${employeeName}-${month}`]: prev[`${employeeName}-${month}`] === week ? null : week,
                              }))
                            }
                          >
                            {week}
                          </div>

                          {selectedWeek[`${employeeName}-${month}`] === week && (
                            <div className="mt-2 p-2 bg-gray-500 rounded-md">
                              {employee.months[month][week].map((entry, index) => (
                                <div key={index} className="p-2 border-b border-gray-400 flex justify-between">
                                  <span>{entry.date}</span>
                                  <span>{entry.salary.toFixed(2)}$</span>
                                  <span>{entry.workingHours.toFixed(1)} h</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MitarbeiterTabelle; */


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
        dateObj,
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
      <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
        <thead className="bg-teal-950">
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
                className="cursor-pointer border"
                onClick={() =>
                  setSelectedEmployee(
                    selectedEmployee === employee.employeeName
                      ? null
                      : employee.employeeName
                  )
                }
              >
                <td className="p-2 text-center">{employee.employeeName}</td>
                <td className="p-2 text-center">
                  {employee.totalSalary.toFixed(2)}$
                </td>
                <td className="p-2 text-center">
                  {employee.totalWorkingHours.toFixed(1)} h
                </td>
              </tr>

              {selectedEmployee === employee.employeeName && (
                <tr>
                  <td  className="p-4 flex flex-col">
                    {Object.keys(employee.months).map((month) => (
                      <div key={month} className="mb-2 bg-black min-w-full">
                        <tr
                          className="w-full text-left bg-blue-900 text-white p-2 cursor-pointer rounded-md"
                          onClick={() =>
                            setSelectedMonth((prev) => ({
                              ...prev,
                              [employee.employeeName]:
                                prev[employee.employeeName] === month
                                  ? null
                                  : month,
                            }))
                          }
                        >
                          <td className="p-2 text-center">{month}</td>
                          <td className="p-2 text-center">
                            {Object.values(employee.months[month])
                              .flat()
                              .reduce((sum, entry) => sum + entry.salary, 0)
                              .toFixed(2)}
                            $
                          </td>
                          <td className="p-2 text-center">
                            {Object.values(employee.months[month])
                              .flat()
                              .reduce(
                                (sum, entry) => sum + entry.workingHours,
                                0
                              )
                              .toFixed(1)}
                            h
                          </td>
                        </tr>
                        

                
                        {selectedMonth[employee.employeeName] === month && (
                          <table className="min-w-full text-amber-100 border border-teal-950 rounded-md overflow-hidden">
                            <thead className="bg-teal-950 ">
                              <tr className="bg-teal-800 text-white">
                                <th className="p-2">Datum</th>
                                <th className="p-2">Gehalt</th>
                                <th className="p-2">Stunden</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.values(employee.months[month])
                                .flat()
                                .sort(
                                  (a, b) =>
                                    new Date(a.dateObj) - new Date(b.dateObj)
                                )
                                .map((entry, index) => (
                                  <tr
                                    key={index}
                                    className="hover:bg-[#5eeaff] border"
                                  >
                                    <td className="p-2 text-center">
                                      {entry.date}
                                    </td>
                                    <td className="p-2 text-center">
                                      {entry.salary.toFixed(2)} $
                                    </td>
                                    <td className="p-2 text-center">
                                      {entry.workingHours.toFixed(1)} h
                                    </td>
                                  </tr>
                                ))}
                              <tr className="bg-teal-500 font-bold">
                                <td className="p-2 text-center">Gesamt</td>
                                <td className="p-2 text-center">
                                  {Object.values(employee.months[month])
                                    .flat()
                                    .reduce((sum, e) => sum + e.salary, 0)
                                    .toFixed(2)}
                                  $
                                </td>
                                <td className="p-2 text-center">
                                  {Object.values(employee.months[month])
                                    .flat()
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

export default MitarbeiterTabelle; */

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
