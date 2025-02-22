import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="absolute top-0 flex justify-center items-center min-h-screen w-screen text-black">
      <div className="w-full max-w-md rounded-lg shadow-md p-8 bg-teal-50">
        <h2 className="text-2xl font-bold mb-6 text-center">WELCOME BACK!</h2>
        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Benutzername
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Benutzername"
            />
          </div>
          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Passwort
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
            />
          </div>
          <div className="flex flex-col items-end">
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Passwort vergessen?
            </a>
            <button
              className="bg-green-500 hover:bg-green-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Einloggen
            </button>
          </div>
        </form>
        <div className="mt-2 flex text-sm justify-center w-full">
          <p className="text-gray-700">Noch keinen Account?</p>
          <a
            className="ml-1 font-bold text-blue-500 hover:text-blue-800"
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
