import React, { useState, useEffect } from "react";
import Popup from "./Popup";  // Popup-Komponente importieren

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);  // Zustand für das Popup

  const usernameRegex = /^[a-zA-Z0-9]+$/;

  useEffect(() => {
    let newErrors = { username: "", email: "", password: "" };
    let isValid = true;

    if (!formData.username) {
      newErrors.username = "Benutzername ist erforderlich";
      isValid = false;
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username = "Nur Buchstaben und Zahlen erlaubt";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "E-Mail ist erforderlich";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Passwort ist erforderlich";
      isValid = false;
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log("Formular Daten:", formData);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registrierung erfolgreich:", data);
        setErrors({ username: "", email: "", password: "" });
        alert("Registrierung erfolgreich!");
      } else {
        console.error("Fehler:", data.message);
        // Popup-Nachricht anzeigen
        setPopupMessage(data.message);
      }
    } catch (error) {
      console.error("Serverfehler", error);
      setErrors({ ...errors, general: "Es gab einen Fehler bei der Kommunikation mit dem Server." });
    }
  };

  const closePopup = () => {
    setPopupMessage(null);  // Popup schließen
  };

  return (
    <div className="w-screen my-20 flex justify-center items-center">
      <div className="w-full max-w-md bg-teal-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-amber-100">WELCOME!!</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-amber-100 text-sm font-bold" htmlFor="username">
              Benutzername
            </label>
            <input
              className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-amber-100 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Benutzername"
              value={formData.username}
              onChange={handleChange}
              style={{
                WebkitBoxShadow: "0 0 0 30px #005f5a inset", // Hintergrundfarbe für Autofill
                WebkitTextFillColor: "#fef3c6", // Textfarbe für Autofill
                borderColor: "#fef3c6",
              }}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-amber-100 text-sm font-bold" htmlFor="email">
              E-Mail
            </label>
            <input
              className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="E-Mail"
              value={formData.email}
              onChange={handleChange}
              style={{
                WebkitBoxShadow: "0 0 0 30px #005f5a inset", // Hintergrundfarbe für Autofill
                WebkitTextFillColor: "#fef3c6", // Textfarbe für Autofill
                borderColor: "#fef3c6",
              }}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-amber-100 text-sm font-bold" htmlFor="password">
              Passwort
            </label>
            <input
              className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              style={{
                WebkitBoxShadow: "0 0 0 30px #005f5a inset", // Hintergrundfarbe für Autofill
                WebkitTextFillColor: "#fef3c6", // Textfarbe für Autofill
                borderColor: "#fef3c6",
              }}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`w-full text-amber-100 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline ${isFormValid ? "bg-teal-950 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"}`}
              type="submit"
              disabled={!isFormValid}
            >
              Registrieren
            </button>
          </div>
        </form>
        {errors.general && <p className="text-red-500 text-xs mt-2">{errors.general}</p>}
      </div>

      {/* Popup anzeigen, wenn eine Nachricht existiert */}
      {popupMessage && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  );
};

export default Register;
