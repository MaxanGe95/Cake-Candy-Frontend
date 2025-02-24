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
    <div className="absolute top-0 w-screen h-screen flex justify-center items-center text-black">
      <div className="w-full max-w-md bg-teal-50 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">WELCOME!!</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Benutzername
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Benutzername"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              E-Mail
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="E-Mail"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Passwort
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isFormValid ? "bg-green-500 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
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
