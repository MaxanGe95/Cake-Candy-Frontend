import React, { useState, useEffect } from "react";
import { isAdmin, getUser } from "../api/auth";

const MitarbeiterTabelle = () => {
  const [data, setData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState({});
  const [selectedWeek, setSelectedWeek] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/salaries");
        let result = await response.json();
        // wenn der Nutzer kein Admin ist, dann nur sein eigenes Gehalt anzeigen
        // TODO sollte eigentlich im Backend gemacht werden
        if (!isAdmin()) {
          const employeeName = getUser().employeeName;
          result = result.filter(
            (obj) =>
              obj.employeeName?.toLowerCase().trim() ===
              employeeName?.toLowerCase().trim()
          );
        }

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
    const daysBetween = Math.floor(
      (tempDate - yearStart) / (1000 * 60 * 60 * 24)
    );
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
        const sortedWeeks = Object.keys(employee.months[month].weeks).sort(
          (a, b) => {
            const yearA =
              employee.months[month].weeks[a][0].dateObj.getFullYear();
            const yearB =
              employee.months[month].weeks[b][0].dateObj.getFullYear();
            const weekA = parseInt(a.split(" ")[1]);
            const weekB = parseInt(b.split(" ")[1]);

            return yearB - yearA || weekA - weekB; // Erst nach Jahr absteigend, dann nach KW aufsteigend
          }
        );

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
    <div className="container mx-auto p-14">
      <h1 className="text-center text-2xl text-teal-200 font-bold mb-4">Mitarbeiter-Übersicht</h1>
      {/* Hauptübersicht */}
      <table className="container mx-auto border rounded-[10px] overflow-hidden text-center">
        <thead className="bg-teal-950/80 text-amber-100">
          <tr className="">
            <th className="p-2 w-1/3">Mitarbeiter</th>
            <th className="p-2 w-1/3">Gesamtgehalt</th>
            <th className="p-2 w-1/3 ">Gesamtstunden</th>
          </tr>
        </thead>
        <tbody className="">
          {Object.entries(data).map(([employeeName, employee]) => (
            <React.Fragment key={employeeName}>
              <tr
                className="border border-none cursor-pointer  hover:bg-[#7ec6cc80] shadow-md transition duration-200 p-6 "
                onClick={() =>
                  setSelectedEmployee(
                    selectedEmployee === employeeName ? null : employeeName
                  )
                }
              >
                <td className="p-2">{employeeName}</td>
                <td className="p-2">{employee.totalSalary.toFixed(2)}$</td>
                <td className="p-2">
                  {employee.totalWorkingHours.toFixed(1)} h
                </td>
              </tr>

              {/* Monatstübersicht */}

              {selectedEmployee === employeeName && (
                <tr className="">
                  <td colSpan="3" className="p-4">
                    <table className="container mx-auto bg-[#57888c]/50 rounded-[10px] shadow-xl overflow-hidden text-center">
                      <thead className="bg-teal-950/70 text-amber-100">
                        <tr className="shadow-xl">
                          <th className="p-2 w-1/3">Monat</th>
                          <th className="p-2 w-1/3">Gesamtgehalt</th>
                          <th className="p-2">Gesamtstunden</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee === employeeName &&
                          Object.keys(employee.months).map((month) => (
                            <React.Fragment key={month}>
                              <tr
                                className="cursor-pointer hover:bg-[#7ec6cc80] transition duration-200 shadow-lg rounded-md"
                                onClick={() =>
                                  setSelectedMonth((prev) => ({
                                    ...prev,
                                    [employeeName]:
                                      prev[employeeName] === month
                                        ? null
                                        : month,
                                  }))
                                }
                              >
                                <td className="p-2">{month}</td>
                                <td>
                                  {employee.months[month].totalSalary.toFixed(
                                    2
                                  )}{" "}
                                  $
                                </td>
                                <td>
                                  {employee.months[
                                    month
                                  ].totalWorkingHours.toFixed(1)}{" "}
                                  h
                                </td>
                              </tr>

                              {/* Wochenübersicht  */}
                              {selectedMonth[employeeName] === month && (
                                <tr className="container mx-auto">
                                  <td colSpan="3" className="p-4">
                                    <table className="container mx-auto rounded-md shadow-lg overflow-hidden bg-[#57888c]/50">
                                      <thead className="bg-teal-950/65 shadow-xl text-amber-100">
                                        <tr className="">
                                          <th className="p-2 w-1/3">Woche</th>
                                          <th className="p-2 w-1/3">
                                            Gesamtgehalt
                                          </th>
                                          <th className="p-2 ">
                                            Gesamtstunden
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedMonth[employeeName] ===
                                          month &&
                                          Object.keys(
                                            employee.months[month].weeks
                                          ).map((week) => (
                                            <React.Fragment key={week}>
                                              <tr
                                                className="cursor-pointer transition duration-200 hover:bg-[#7ec6cc80] shadow-lg overflow-hidden"
                                                onClick={() =>
                                                  setSelectedWeek((prev) => ({
                                                    ...prev,
                                                    [`${employeeName}-${month}`]:
                                                      prev[
                                                        `${employeeName}-${month}`
                                                      ] === week
                                                        ? null
                                                        : week,
                                                  }))
                                                }
                                              >
                                                <td className="p-2">{week}</td>
                                                <td className="p-2">
                                                  {employee.months[month].weeks[
                                                    week
                                                  ]
                                                    .reduce(
                                                      (acc, entry) =>
                                                        acc + entry.salary,
                                                      0
                                                    )
                                                    .toFixed(2)}{" "}
                                                  $
                                                </td>
                                                <td className="p-2">
                                                  {employee.months[month].weeks[
                                                    week
                                                  ]
                                                    .reduce(
                                                      (acc, entry) =>
                                                        acc +
                                                        entry.workingHours,
                                                      0
                                                    )
                                                    .toFixed(1)}{" "}
                                                  h
                                                </td>
                                              </tr>

                                              {/*Datum-Übersicht */}
                                              {selectedWeek[
                                                `${employeeName}-${month}`
                                              ] === week && (
                                                <tr>
                                                  <td
                                                    colSpan="3"
                                                    className="p-4"
                                                  >
                                                    <table className=" w-full shadow-lg rounded-md overflow-hidden">
                                                      <thead className="bg-teal-950/60 ">
                                                        <tr className="container mx-auto shadow-xl">
                                                          <th className="p-2 text-amber-100">
                                                            Datum
                                                          </th>
                                                          <th className="p-2 text-amber-100">
                                                            Gesamtgehalt
                                                          </th>
                                                          <th className="p-2 text-amber-100">
                                                            Gesamtstunden
                                                          </th>
                                                        </tr>
                                                        {selectedWeek[
                                                          `${employeeName}-${month}`
                                                        ] === week &&
                                                          employee.months[
                                                            month
                                                          ].weeks[week].map(
                                                            (entry, index) => (
                                                              <tr
                                                                key={index}
                                                                className="shadow-sm bg-[#7ec6cc]/25 cursor-pointer transition duration-200 hover:bg-[#7ec6cc80] rounded-t-md"
                                                              >
                                                                <td className="p-2 w-1/3">
                                                                  {entry.date}
                                                                </td>
                                                                <td className="p-2">
                                                                  {entry.salary.toFixed(
                                                                    2
                                                                  )}{" "}
                                                                  $
                                                                </td>
                                                                <td className="p-2">
                                                                  {entry.workingHours.toFixed(
                                                                    1
                                                                  )}{" "}
                                                                  h
                                                                </td>
                                                              </tr>
                                                            )
                                                          )}
                                                      </thead>
                                                    </table>
                                                  </td>
                                                </tr>
                                              )}
                                            
                                            </React.Fragment>
                                          ))}
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

