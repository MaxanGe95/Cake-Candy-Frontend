function Futterplatz() {
  return (
    <div className="container mx-auto p-6 ">
      <h1>Willkommen bei Futterplatz</h1>
      <form action="submit" name="work-experience" className="text-center">
        <label htmlFor="work-experience" className="text-center text-sm">
          Inputfeld für RDP Rechnungsvordruck
        </label>
        <textarea
          name="work-experience"
          rows="10"
          cols="150"
          className="border border-gray-300 p-2 m-5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
        ></textarea>
        <button
          type="submit"
          className="bg-teal-950 cursor-pointer border-1 rounded px-4 py-2 my-4"
        >
          Rein ins Backend
        </button>
      </form>
      <fieldset>
        <div>
          <input type="radio" id="B2B" name="B2B" value="B2B" />
          <label htmlFor="B2B">B2B</label>
        </div>
        <div>
          <input type="radio" id="B2C" name="B2C" value="B2C" />
          <label htmlFor="B2C">B2C</label>
        </div>
      </fieldset>

      {/*       <label htmlFor="welcheFirma">Firma/ Privatkunde:</label>
      <select id="welcheFirma" name="welcheFirma" className="bg-slate-300 border-2 rounded text-black p-2 ml-3">
        <option value="firma">Firma</option>
        <option value="privatkunde">Privat Kunde</option>
      </select> */}

      <label htmlFor="auswahl">Firma/ Privatkunde:</label>
      <select
        id="auswahl"
        name="auswahl"
        className="bg-slate-300 border-2 rounded text-black p-2 ml-2"
      >
        <optgroup label="Firma">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </optgroup>
        <optgroup label="Privat Kunde">
          <option value="11">11</option>
          <option value="111">111</option>
          <option value="1111">1111</option>
        </optgroup>
      </select>

      <form action="submit" name="work-experience2" className="text-center">
        <label htmlFor="work-experience2" className="text-center text-sm">
          Inputfeld für RDP Kontoauzug
        </label>
        <textarea
          name="work-experience2"
          rows="10"
          cols="150"
          className="border border-gray-300 p-2 m-5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
        ></textarea>
        <button
          type="submit"
          className="bg-teal-950 cursor-pointer border-1 rounded px-4 py-2 my-4"
        >
          Rein ins Backend
        </button>
      </form>

      <form action="submit" name="work-experience3" className="text-center">
        <label htmlFor="work-experience3" className="text-center text-sm">
          Inputfeld für Inventurliste
        </label>
        <textarea
          name="work-experience3"
          rows="10"
          cols="150"
          className="border border-gray-300 p-2 m-5 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-100"
        ></textarea>
        <button
          type="submit"
          className="bg-teal-950 cursor-pointer border-1 rounded px-4 py-2 my-4"
        >
          Rein ins Backend
        </button>
      </form>
    </div>
  );
}

export default Futterplatz;
