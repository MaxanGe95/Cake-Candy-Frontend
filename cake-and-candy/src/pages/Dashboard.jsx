import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6 text-amber-100">
      <div className="container mx-auto">
        <h1 className="text-center text-3xl font-bold mb-6">
     
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Verfügbares Budget */}
          <div className=" p-6 rounded-xl shadow-lg text-center bg-teal-950">
            <h2 className="text-xl font-semibold text-amber-100">Verfügbares Budget</h2>
            <p className="text-3xl text-green-600 font-bold">2.810 €</p>
          </div>

          {/* Einnahmen & Ausgaben */}
          <div className="p-6 rounded-xl shadow-lg bg-teal-950">
            <h2 className="text-xl font-semibold text-amber-100">Einnahmen</h2>
            <p className="text-2xl text-green-600 font-bold">16.372 €</p>
            <h2 className="text-xl font-semibold mt-4 text-amber-100">Ausgaben</h2>
            <p className="text-2xl text-red-600 font-bold">14.691 €</p>
          </div>

          {/* Ersparnisse & Sparquote */}
          <div className="p-6 rounded-xl shadow-lg bg-teal-950">
            <h2 className="text-xl font-semibold text-amber-100">Ersparnisse</h2>
            <p className="text-2xl text-orange-600 font-bold">1.681 €</p>
            <h2 className="text-xl font-semibold mt-4 text-amber-100">Sparquote</h2>
            <p className="text-2xl text-blue-600 font-bold">10%</p>
          </div>
        </div>

        {/* Tabellen für Einnahmen und Ausgaben */}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4 bg-teal-950 rounded p-2">Top Einnahmen & Ausgaben</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className=" p-6 rounded-xl shadow-lg bg-teal-950 ">
              <h3 className="font-semibold text-amber-100">Top Einnahmen</h3>
              <ul>
                <li className="flex justify-between text-amber-100">
                  Produkt 1 <span className="text-green-600">7.750 €</span>
                </li>
                <li className="flex justify-between text-amber-100">
                  Produkt 3 <span className="text-green-600">3.700 €</span>
                </li>
                <li className="flex justify-between text-amber-100">
                  Steuerrückerstattung <span className="text-green-600">2.522 €</span>
                </li>
              </ul>
            </div>

            <div className=" p-6 rounded-xl shadow-lg bg-teal-950 ">
              <h3 className="font-semibold text-amber-100">Top Ausgaben</h3>
              <ul>
                <li className="flex justify-between text-amber-100">
                  Miete <span className="text-red-600">6.951 €</span>
                </li>
                <li className="flex justify-between text-amber-100">
                  Gehälter <span className="text-red-600">2.840 €</span>
                </li>
                <li className="flex justify-between text-amber-100">
                  Steuern <span className="text-red-600">2.080 €</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
