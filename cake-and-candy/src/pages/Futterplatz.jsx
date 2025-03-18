import { useState, useEffect } from "react";

function Futterplatz() {
  const [inputText1, setInputText1] = useState(""); // Für Rechnungsdaten
  const [inputText2, setInputText2] = useState(""); // Für Gehaltsdaten
  const [inputText3, setInputText3] = useState(""); // Für Inventardaten

  const [isB2B, setIsB2B] = useState(false);
  const [isB2C, setIsB2C] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [companies, setCompanies] = useState([]);

  // Laden der Firmen aus dem Backend
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("http://localhost:5001/api/companies");
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Fehler beim Laden der Firmen:", error);
      }
    }
    fetchCompanies();
  }, []);

  // Rechnungsdaten parsen
  function parseInvoiceData(text) {
    const productRegex =
      /([A-Za-zÄÖÜäöüß0-9\s\(\)-]+)[\s\t]*\|[\s\t]*([\d,\.]+)[\s\$€£]*\/ Stk\.[\s\t]*\|[\s\t]*(\d+)[\s\t]*Stk\.[\s\t]*\|[\s\t]*([\d,\.]+)[\s\$€£]*/g;
    const amountRegex = /Rechnungsbetrag:[\s\t]*([\d,\.]+)[\s\$€£]*/;

    let matches;
    const products = [];
    let totalAmount = 0;

    console.log("Verarbeite den folgenden Text:", text);

    while ((matches = productRegex.exec(text)) !== null) {
      const productName = matches[1].trim();
      const pricePerUnit = parseFloat(matches[2].replace(",", "."));
      const quantity = parseInt(matches[3]);
      const totalPrice = parseFloat(matches[4].replace(",", "."));

      products.push({
        productName,
        pricePerUnit,
        quantity,
        totalPrice,
      });

      totalAmount += totalPrice;
    }

    const amountMatches = text.match(amountRegex);
    if (amountMatches && amountMatches[1]) {
      totalAmount = parseFloat(amountMatches[1].replace(",", "."));
    }

    return {
      products,
      totalAmount,
      company: selectedCompany,
      customerType: isB2B ? "B2B" : "B2C",
    };
  }

  // Gehaltsdaten parsen
  function parseSalaryData(text) {
    const regex =
      /(\d{2}\.\d{2}\.\d{4})\s00:00\s+Lastschrift durch Cake & Candy\s+([\w\s]+) \(#(\d+)\) - Gehalt "([\w\s]+)" \(([\d,\.]+) h\)\n(-?[\d,\.]+) \$/g;
    let matches;
    const result = [];

    while ((matches = regex.exec(text)) !== null) {
      result.push({
        date: matches[1],
        employeeName: matches[2].trim(),
        kontoNumber: matches[3],
        workingHours: parseFloat(matches[5].replace(",", ".")),
        salary: Math.abs(parseFloat(matches[6].replace(",", "."))),
      });
    }

    return result;
  }

  // Inventardaten parsen
  function parseInventoryData(text) {
    const regex = /([A-Za-zÄÖÜäöüß\s\-]+)\s+(\d+)\s+([^\n]+)/g;
    let matches;
    const result = [];

    while ((matches = regex.exec(text)) !== null) {
      const itemName = matches[1].trim();
      const quantity = parseInt(matches[2]);
      const location = matches[3].trim() || "Nicht angegeben";

      result.push({
        itemName: itemName,
        quantity: quantity,
        location: location,
      });
    }

    console.log("Extrahierte Inventardaten:", result);
    return result;
  }

  // Daten absenden
  async function handleSubmit(e, inputData, inputType) {
    e.preventDefault();

    let extractedData;
    if (inputType === "invoice") {
      extractedData = parseInvoiceData(inputData);
      extractedData = {
        ...extractedData,
        company: selectedCompany,
        customerType: isB2B ? "B2B" : isB2C ? "B2C" : "",
      };
    } else if (inputType === "salary") {
      extractedData = parseSalaryData(inputData);
      extractedData = extractedData.map((data) => ({
        ...data,
        date: data.date,
      }));
    } else if (inputType === "inventory") {
      extractedData = parseInventoryData(inputData);
    }

    console.log("Extrahierte Daten:", extractedData);

    try {
      const url =
        inputType === "salary"
          ? "http://localhost:5001/api/salaries"
          : inputType === "invoice"
          ? "http://localhost:5001/api/invoices"
          : "http://localhost:5001/api/inventory";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extractedData),
      });

      if (response.ok) {
        console.log("Daten erfolgreich gesendet");
        //input leeren
        if (inputType === "invoice") {
          setInputText1("");
        } else if (inputType === "salary") {
          setInputText2("");
        } else if (inputType === "inventory") {
          setInputText3("");
        }
        //----------------------------------------------------------
      } else {
        console.error("Fehler beim Senden der Daten:", response.statusText);
        throw new Error("Fehler beim Senden der Daten");
      }
    } catch (error) {
      console.error("Fehler:", error);
    }
  }

  // Neue Firma hinzufügen
  async function handleAddNewCompany() {
    if (newCompany && !companies.includes(newCompany)) {
      setCompanies([...companies, newCompany]);
      setSelectedCompany(newCompany);
      setNewCompany(""); // Clear the input field after adding

      try {
        const response = await fetch(
          "http://localhost:5001/api/companies/add",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newCompany }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Firma erfolgreich hinzugefügt:", data);
        } else {
          const errorData = await response.json();
          console.error("Fehler beim Hinzufügen der Firma:", errorData.message);
        }
      } catch (error) {
        console.error("Fehler:", error);
      }
    }
  }

  // Validierungsfunktion für Rechnungsdaten
  function isInvoiceFormValid() {
    return (
      inputText1.trim() !== "" && (isB2B || isB2C) && selectedCompany !== ""
    );
  }

  // Validierungsfunktion für Gehaltsdaten
  function isSalaryFormValid() {
    return inputText2.trim() !== "";
  }

  // Validierungsfunktion für Inventardaten
  function isInventoryFormValid() {
    return inputText3.trim() !== "";
  }

  return (
    <div className="container mx-auto p-6 text-amber-100">
      <h1 className="py-5 text-center">Willkommen bei Futterplatz</h1>

      {/* 🧾 Inputfeld 1 - Rechnungsvordruck */}
      <form onSubmit={(e) => handleSubmit(e, inputText1, "invoice")}>
        <label htmlFor="invoice-input" className="text-center text-sm">
          Inputfeld für RDP Rechnungsvordruck
        </label>
        <textarea
          value={inputText1}
          onChange={(e) => setInputText1(e.target.value)}
          rows="10"
          cols={""}
          className="w-full border border-gray-300 p-2  rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
        ></textarea>

        {/* B2B/B2C Auswahl */}
        <div className="my-2">
          <label className="text-sm mr-4">Kundentyp:</label>
          <input
            type="radio"
            id="b2b-radio"
            name="customerType"
            checked={isB2B}
            onChange={() => {
              setIsB2B(true);
              setIsB2C(false);
            }}
            className="mr-2"
          />
          <label htmlFor="b2b-radio">B2B</label>

          <input
            type="radio"
            id="b2c-radio"
            name="customerType"
            checked={isB2C}
            onChange={() => {
              setIsB2C(true);
              setIsB2B(false);
            }}
            className="mr-2"
          />
          <label htmlFor="b2c-radio">B2C</label>
        </div>

        {/* Auswahl der Firma */}
        <div>
          <label className="text-sm text-gray-200">Firma:</label>
          <select
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="" disabled>
              Wählen Sie eine Firma aus
            </option>
            {companies.map((company, index) => (
              <option key={index} value={company.name} className="bg-teal-900">
                {company.name} {/* Zeige nur den Namen an */}
              </option>
            ))}
          </select>

          {/* Neue Firma hinzufügen */}
          <div>
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="Neue Firma hinzufügen"
              className="p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleAddNewCompany}
              /* disabled={!isInvoiceFormValid()} */
              className="bg-green-500 text-white rounded-full px-6 py-2 my-3"
            >
              Firma hinzufügen
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isInvoiceFormValid()}
          className={`bg-amber-100 text-gray-700 rounded-full px-6 py-2 my-3 
            ${!isInvoiceFormValid() ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Daten absenden
        </button>
      </form>

      {/* 🧾 Inputfeld 2 - Gehaltsdaten */}
      <form onSubmit={(e) => handleSubmit(e, inputText2, "salary")}>
        <label htmlFor="salary-input" className="text-center text-sm">
          Gehaltsdaten (z.B. für Lastschrift)
        </label>
        <textarea
          value={inputText2}
          onChange={(e) => setInputText2(e.target.value)}
          rows="10"
          cols="150"
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
        ></textarea>

        <button
          type="submit"
          disabled={!isSalaryFormValid()}
          className={`bg-amber-100 text-gray-700 rounded-full px-6 py-2 my-3 
            ${!isSalaryFormValid() ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Daten absenden
        </button>
      </form>

      {/* 🧾 Inputfeld 3 - Inventardaten */}
      <form onSubmit={(e) => handleSubmit(e, inputText3, "inventory")}>
        <label htmlFor="inventory-input" className="text-center text-sm">
          Inventardaten (z.B. für Bestände)
        </label>
        <textarea
          value={inputText3}
          onChange={(e) => setInputText3(e.target.value)}
          rows="10"
          cols="150"
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
        ></textarea>

        <button
          type="submit"
          disabled={isInventoryFormValid()}
          className={`bg-amber-100 text-gray-700 rounded-full px-6 py-2 my-3 
            ${!isInventoryFormValid() ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Daten absenden
        </button>
      </form>

      {/* Weitere Eingabeformulare... */}
    </div>
  );
}

export default Futterplatz;
