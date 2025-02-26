import { Link } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch, FaBars } from "react-icons/fa";
import React, { useState } from "react";

export default function Navbar({ menuOpen, setMenuOpen }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <div className="relative z-1000 top-0 left-0 w-full text-teal-100 bg-teal-800/50 border-b border-teal-200 bg-opacity-50 p-4 flex justify-between items-center">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-xl md:hidden"
      >
        <FaBars />
      </button>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50 text-xl md:text-2xl font-semibold tracking-wide text-[#5eeaff]"
        to="/"
      >
        Cake & Candy
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]"
        to="/endproducts"
      >
        -- Kunden Produkte --
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]"
        to="/futterplatz"
      >
        Futterplatz
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]"
        to="/orders"
      >
        Bestellungen
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]"
        to="/employees"
      >
        Mitarbeiter
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]"
        to="/recipes"
      >
        Rezepte
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]"
        to="/products"
      >
        Zutaten
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]"
        to="/dashboard"
      >
        Dashboard
      </Link>
      <div className="hidden md:flex gap-6">
        <div className="relative">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <FaSearch className="text-xl cursor-pointer transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]"  />
          </button>
          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg text-black text-[#5eeaff]">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Suche..."
              />
            </div>
          )}
        </div>
        <Link to="/login">
          <FaUser className="text-xl cursor-pointer transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]" />
        </Link>
        <Link to="/cart">
          <FaShoppingCart className="text-xl cursor-pointer transition ease-in-out hover:scale-110 hover:text-teal-50 text-[#5eeaff]" />
        </Link>
      </div>
    </div>
  );
}
