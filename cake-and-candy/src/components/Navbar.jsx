import { Link, useLocation } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch, FaBars } from "react-icons/fa";
import { useState } from "react";
import { isAdmin, isMitarbeiter } from "../api/auth";

export default function Navbar({ menuOpen, setMenuOpen }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (path) => location.pathname === path;

  return (
    <div className="sticky z-1000 top-0 left-0 w-full text-teal-100 bg-teal-800/50 border-b border-teal-200 bg-opacity-50 p-4 flex justify-between items-center">
      {/* Burger-Menü Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-xl md:hidden"
      >
        <FaBars />
      </button>

      {/* Haupt-Logo */}
      <Link
        className={`transition ease-in-out hover:scale-110 hover:text-amber-100 text-xl md:text-2xl font-semibold tracking-wide ${
          isActiveLink("/") ? "text-amber-100" : "text-[#5eeaff]"
        }`}
        to="/"
      >
        Cake & Candy
      </Link>

      {/* Menü für große Bildschirme */}
      <div className="hidden md:flex gap-6">
        <NavLinks isActiveLink={isActiveLink} />
      </div>

      {/* Mobile Menü (wird mit FaBars geöffnet) */}
      <div
        className={`absolute top-16 left-0 w-full bg-teal-800 flex flex-col items-center space-y-4 py-4 transition-transform transform ${
          menuOpen ? "block" : "hidden"
        } md:hidden`}
      >
        <NavLinks isActiveLink={isActiveLink} />
      </div>

      {/* Icons rechts */}
      <div className="hidden md:flex gap-6">
        <div className="relative">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <FaSearch className="text-xl cursor-pointer transition ease-in-out hover:scale-110 hover:text-amber-100 text-[#5eeaff]" />
          </button>
          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg text-[#5eeaff]">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Suche..."
              />
            </div>
          )}
        </div>
        <Link to="/login">
          <FaUser className="text-xl cursor-pointer transition ease-in-out hover:scale-110 hover:text-amber-100 text-[#5eeaff]" />
        </Link>
        <Link to="/cart">
          <FaShoppingCart className="text-xl cursor-pointer transition ease-in-out hover:scale-110 hover:text-amber-100 text-[#5eeaff]" />
        </Link>
      </div>
    </div>
  );
}

// Extrahiere die Links in eine separate Komponente für bessere Lesbarkeit
function NavLinks({ isActiveLink }) {
  return (
    <>
      <Link
        className={`transition ease-in-out hover:scale-110 hover:text-amber-100 ${
          isActiveLink("/endproducts") ? "text-amber-100" : "text-[#5eeaff]"
        }`}
        to="/endproducts"
      >
        Confiserie
      </Link>
      {isAdmin() && (
        <Link
          className={`transition ease-in-out hover:scale-110 hover:text-amber-100 ${
            isActiveLink("/futterplatz") ? "text-amber-100" : "text-[#5eeaff]"
          }`}
          to="/futterplatz"
        >
          Futterplatz
        </Link>
      )}
      {isAdmin() && (
        <Link
          className={`transition ease-in-out hover:scale-110 hover:text-amber-100 ${
            isActiveLink("/orders") ? "text-amber-100" : "text-[#5eeaff]"
          }`}
          to="/orders"
        >
          Bestellungen
        </Link>
      )}
      {(isAdmin() || isMitarbeiter()) && (
        <Link
          className={`transition ease-in-out hover:scale-110 hover:text-amber-100 ${
            isActiveLink("/employees") ? "text-amber-100" : "text-[#5eeaff]"
          }`}
          to="/employees"
        >
          Mitarbeiter
        </Link>
      )}
      {(isAdmin() || isMitarbeiter()) && (
        <Link
          className={`transition ease-in-out hover:scale-110 hover:text-amber-100 ${
            isActiveLink("/recipes") ? "text-amber-100" : "text-[#5eeaff]"
          }`}
          to="/recipes"
        >
          Rezepte
        </Link>
      )}
      {isAdmin() && (
        <Link
          className={`transition ease-in-out hover:scale-110 hover:text-amber-100 ${
            isActiveLink("/products") ? "text-amber-100" : "text-[#5eeaff]"
          }`}
          to="/products"
        >
          Zutaten
        </Link>
      )}
      {isAdmin() && (
        <Link
          className={`transition ease-in-out hover:scale-110 hover:text-amber-100 ${
            isActiveLink("/dashboard") ? "text-amber-100" : "text-[#5eeaff]"
          }`}
          to="/dashboard"
        >
          Dashboard
        </Link>
      )}
      {isAdmin() && (
        <Link
          className={`transition ease-in-out hover:scale-110 hover:text-amber-100 ${
            isActiveLink("/user") ? "text-amber-100" : "text-[#5eeaff]"
          }`}
          to="/user"
        >
          Nutzerverwaltung
        </Link>
      )}
    </>
  );
}
