function Futterplatz() {
  return (
    <div className="container mx-auto p-6">
      <h1>Willkommen bei Futterplatz</h1>
      <form action="submit" name="work-experience" className="text-center">
        <label
          htmlFor="work-experience"
          name="work-experience"
          className="text-center"
        >
          Inputfeld für RDP Rechnungsvordruck
        </label>
        <textarea
          name="work-experience"
          rows="10"
          cols="150"
          className="bg-slate-300 border-2 rounded text-black p-4"
        ></textarea>

        <button
          type="submit"
          className="bg-teal-950 cursor-pointer border-1 rounded px-4 py-2 my-4"
        >
          Rein ins Backend
        </button>
      </form>
      <fieldset>
        <legend>Meine Lieblings-Programmiersprache:</legend>
        <div>
          <input type="radio" id="B2B" name="B2B" value="B2B" />
          <label htmlFor="B2B">B2B</label>
        </div>
        <div>
          <input type="radio" id="B2C" name="language" value="B2C" />
          <label htmlFor="javascript-language">B2C</label>
        </div>
      </fieldset>

      <label for="welcheFirma">Firma/ Privatkunde:</label>
        <select id="computer-os" name="computer-os">
          <option value="ubuntu">Ubuntu</option>
          <option value="macos">MacOS</option>
          <option value="windows">Windows</option>
        </select>

      <form action="submit" name="work-experience2" className="text-center">
        <label htmlFor="work-experience2" className="text-center">
          Inputfeld für RDP Kontoauzug
        </label>
        <textarea
          name="work-experience2"
          rows="10"
          cols="150"
          className="bg-slate-300 border-2 rounded text-black p-4"
        ></textarea>
        <button
          type="submit"
          className="bg-teal-950 cursor-pointer border-1 rounded px-4 py-2 my-4"
        >
          Rein ins Backend
        </button>
      </form>

      <form action="submit" name="work-experience3" className="text-center">
        <label htmlFor="work-experience3" className="text-center">
          Inputfeld für Inventurliste
        </label>
        <textarea
          name="work-experience3"
          rows="10"
          cols="150"
          className="bg-slate-300 border-2 rounded text-black p-4"
        ></textarea>
        <button
          type="submit"
          className="bg-teal-950 cursor-pointer border-1 rounded px-4 py-2 my-4"
        >
          Rein ins Backend
        </button>
      </form>
      <fieldset>
        <legend>Meine Lieblings-Programmiersprache:</legend>
        <div>
          <input type="radio" id="css-language" name="language" value="css" />
          <label htmlFor="css-language">CSS</label>
        </div>
        <div>
          <input
            type="radio"
            id="html-language"
            name="language"
            value="html"
            checked
          />
          <label htmlFor="html-language">HTML</label>
        </div>
        <div>
          <input
            type="radio"
            id="javascript-language"
            name="language"
            value="javascript"
          />
          <label htmlFor="javascript-language">Javascript</label>
        </div>
      </fieldset>
    </div>
  );
}

export default Futterplatz;
