import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth"; // Import der Login-Funktion

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const data = await loginUser(formData);
      console.log(
        `Nutzer ${data.user.username} mit Rolle: ${data.user.role} hat sich angemeldet`
      );

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex my-20 justify-center items-center w-screen">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8 bg-teal-900">
        <h2 className="text-2xl font-bold mb-6 text-amber-100 text-center">WELCOME BACK!</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form>
          <div className="mb-6">
            <label
              className="block text-amber-100 text-sm font-bold"
              htmlFor="username"
            >
              Benutzername
            </label>
            <input
              className="shadow appearance-none bg-teal-800 border rounded-xl w-full py-2 px-3 text-amber-100 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Benutzername"
              value={formData.username}
              onChange={handleChange}
              style={{
                WebkitBoxShadow: '0 0 0 30px #005f5a inset', // Hintergrundfarbe für Autofill
                WebkitTextFillColor: '#fef3c6', // Textfarbe für Autofill
                borderColor: '#fef3c6',
              }}
            />
          </div>
          <div className="">
            <label
              className="block text-amber-100 text-sm font-bold"
              htmlFor="password"
            >
              Passwort
            </label>
            <input
              className="shadow appearance-none bg-teal-800 border rounded-xl w-full py-2 px-3 text-amber-100 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              style={{
                WebkitBoxShadow: '0 0 0 30px #005f5a inset', // Hintergrundfarbe für Autofill
                WebkitTextFillColor: '#fef3c6', // Textfarbe für Autofill
                borderColor: '#fef3c6',
              }}
            />
          </div>
          <div className="flex justify-end mb-9">
            <a
              className="inline-block align-text-top font-bold text-sm text-teal-600 hover:text-amber-100"
              href="#"
            >
              Passwort vergessen?
            </a>
          </div>

          <div className="flex flex-col items-end">
            <button
              className="bg-teal-950 shadow-xl  hover:bg-teal-700 w-full text-amber-100 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleLogin}
            >
              Einloggen
            </button>
          </div>
        </form>
        <div className="mt-2 flex text-sm justify-center w-full">
          <p className="text-amber-100">Noch keinen Account?</p>
          <a
            className="ml-1 font-bold text-teal-600 hover:text-amber-100"
            href="#"
            onClick={() => navigate("/register")}
          >
            Registrieren
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
