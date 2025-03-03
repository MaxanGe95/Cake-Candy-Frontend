import { useState } from "react";

function Futterplatz() {
  const [inputText1, setInputText1] = useState("");
  const [isB2B, setIsB2B] = useState(false);
  const [isB2C, setIsB2C] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");

  const [inputText2, setInputText2] = useState("");
  const [inputText3, setInputText3] = useState("");

  const companies = ["Lona Markt", "LTD", "Pattys Eis"];

  function parseInvoiceData(text) {
    const regex = /(\d{2}\.\d{2}\.\d{4})\s+Rechnung\s+([\w\s-]+)\s+([\d,.]+) €/g;
    let matches;
    const result = [];

    while ((matches = regex.exec(text)) !== null) {
      result.push({
        date: matches[1],
        clientName: matches[2].trim(),
        amount: parseFloat(matches[3].replace(',', '.')),
        isB2B: isB2B,
        isB2C: isB2C,
        company: selectedCompany
      });
    }
    return result;
  }

  function parseSalaryData(text) {
    const regex = /(\d{2}\.\d{2}\.\d{4})\s00:00\s+Lastschrift durch Cake & Candy\s+([\w\s]+) \(#(\d+)\) - Gehalt "([\w\s]+)" \(([\d,\.]+) h\)\n(-?[\d,\.]+) \$/g;
    let matches;
    const result = [];
  
    while ((matches = regex.exec(text)) !== null) {
      result.push({
        date: matches[1],
        employeeName: matches[2].trim(),
        kontoNumber: matches[3],
        workingHours: parseFloat(matches[5].replace(',', '.')),
        salary: Math.abs(parseFloat(matches[6].replace(',', '.'))) // Absoluten Wert verwenden
      });
    }
  
    return result;
  }
  
  

  function parseInventoryData(text) {
    const regex = /Artikel: ([\w\s-]+), Menge: (\d+), Preis: ([\d,.]+) €/g;
    let matches;
    const result = [];

    while ((matches = regex.exec(text)) !== null) {
      result.push({
        itemName: matches[1].trim(),
        quantity: parseInt(matches[2]),
        price: parseFloat(matches[3].replace(',', '.'))
      });
    }
    return result;
  }

  async function handleSubmit(e, inputData, inputType) {
    e.preventDefault();
  
    let extractedData;
    if (inputType === "invoice") {
      extractedData = parseInvoiceData(inputData);
    } else if (inputType === "salary") {
      extractedData = parseSalaryData(inputData);
      // Datum ins richtige Format konvertieren
      extractedData = extractedData.map(data => ({
        ...data,
        date: data.date 
      }));
    } else if (inputType === "inventory") {
      extractedData = parseInventoryData(inputData);
    }
  
    console.log("Extrahierte Daten:", extractedData);  // Daten prüfen
  
    try {
      const url =
        inputType === "salary"
          ? "http://localhost:5000/api/salaries"
          : inputType === "invoice"
          ? "http://localhost:5000/api/invoices"
          : "http://localhost:5000/api/inventory"; // Beispiel für Inventar
  
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extractedData),
      });
  
      if (response.ok) {
        console.log("Daten erfolgreich gesendet");
      } else {
        console.error("Fehler beim Senden der Daten:", response.statusText);
        throw new Error("Fehler beim Senden der Daten");
      }
    } catch (error) {
      console.error("Fehler:", error);
    }
  }
  
  
  
  
  
  // Hilfsfunktion zur Prüfung auf vorhandene Daten
  async function checkIfDataExists(data, inputType) {
    const url =
      inputType === "salary"
        ? "http://localhost:5000/api/salaries"
        : inputType === "invoice"
        ? "http://localhost:5000/api/invoices"
        : "http://localhost:5000/api/inventory"; // Beispiel für Inventar
  
    const response = await fetch(url);
    const existingData = await response.json();
  
    // Anpassen der Logik basierend auf den Daten, die du speicherst
    if (inputType === "salary") {
      return existingData.filter(
        (item) =>
          item.date === data.date &&
          item.employeeName === data.employeeName &&
          item.kontoNumber === data.kontoNumber // Beispiel für Gehaltsabrechnung
      );
    }
  
    if (inputType === "invoice") {
      return existingData.filter(
        (item) =>
          item.date === data.date &&
          item.clientName === data.clientName &&
          item.amount === data.amount &&
          item.company === data.company // Beispiel für Rechnung
      );
    }
  
    if (inputType === "inventory") {
      return existingData.filter(
        (item) =>
          item.itemName === data.itemName &&
          item.quantity === data.quantity &&
          item.price === data.price // Beispiel für Inventardaten
      );
    }
  
    return [];
  }
  
  

  return (
    <div className="container mx-auto p-6 text-amber-100">
      <h1>Willkommen bei Futterplatz</h1>

      {/* 🧾 Inputfeld 1 - Rechnungsvordruck */}
      <form onSubmit={(e) => handleSubmit(e, inputText1, "invoice")}>
        <label htmlFor="invoice-input" className="text-center text-sm">
          Inputfeld für RDP Rechnungsvordruck
        </label>
        <textarea
          value={inputText1}
          onChange={(e) => setInputText1(e.target.value)}
          rows="10"
          cols="150"
          className="border border-gray-300 p-2 m-5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
        ></textarea>

        {/* B2B/B2C Auswahl */}
        <div className="my-2">
          <label className="text-sm mr-4">Kundentyp:</label>
          <input
            type="radio"
            id="b2b-radio"
            name="customerType"
            checked={isB2B}
            onChange={() => { setIsB2B(true); setIsB2C(false); }}
            className="mr-2"
          />
          <label htmlFor="b2b-radio">B2B</label>

          <input
            type="radio"
            id="b2c-radio"
            name="customerType"
            checked={isB2C}
            onChange={() => { setIsB2C(true); setIsB2B(false); }}
            className="ml-4"
          />
          <label htmlFor="b2c-radio">B2C</label>
        </div>

        {/* Dropdown für Firmenauswahl */}
        <div className="my-2">
          <label htmlFor="company-select">Firma:</label>
          <select
            id="company-select"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border p-2 rounded-md ml-2"
          >
            <option value="">Bitte Firma wählen</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-teal-950 cursor-pointer border-1 rounded px-4 py-2 my-4">
          Rein ins Backend (Rechnung)
        </button>
      </form>

      {/* 💰 Inputfeld 2 - Gehaltsabrechnung */}
      <form onSubmit={(e) => handleSubmit(e, inputText2, "salary")}>
        <label htmlFor="salary-input" className="text-center text-sm">
          Inputfeld für RDP Kontoauszug
        </label>
        <textarea
          value={inputText2}
          onChange={(e) => setInputText2(e.target.value)}
          rows="10"
          cols="150"
          className="border border-gray-300 p-2 m-5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
        ></textarea>
        <button type="submit" className="bg-teal-950 cursor-pointer border-1 rounded px-4 py-2 my-4">
          Rein ins Backend (Gehalt)
        </button>
      </form>

      {/* 📦 Inputfeld 3 - Inventurliste */}
      <form onSubmit={(e) => handleSubmit(e, inputText3, "inventory")}>
        <label htmlFor="inventory-input" className="text-center text-sm">
          Inputfeld für Inventurliste
        </label>
        <textarea
          value={inputText3}
          onChange={(e) => setInputText3(e.target.value)}
          rows="10"
          cols="150"
          className="border border-gray-300 p-2 m-5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
        ></textarea>
        <button type="submit" className="bg-teal-950 cursor-pointer border-1 rounded px-4 py-2 my-4">
          Rein ins Backend (Inventar)
        </button>
      </form>
    </div>
  );
}

export default Futterplatz;
