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
        className="transition ease-in-out hover:scale-110 hover:text-teal-50 text-xl md:text-2xl font-semibold tracking-wide"
        to="/"
      >
        Cake & Candy
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50"
        to="/endproducts"
      >
        EndProdukte
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50"
        to="/futterplatz"
      >
        Futterplatz
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50"
        to="/orders"
      >
        Bestellungen
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50"
        to="/employees"
      >
        Mitarbeiter
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50"
        to="/recipes"
      >
        Rezepte
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50"
        to="/products"
      >
        Produkte
      </Link>
      <Link
        className="transition ease-in-out hover:scale-110 hover:text-teal-50"
        to="/dashboard"
      >
        Dashboard
      </Link>
      <div className="hidden md:flex gap-6">
        <div className="relative">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <FaSearch className="text-xl cursor-pointer transition ease-in-out hover:scale-110 hover:text-teal-50" />
          </button>
          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg text-black">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Suche..."
              />
            </div>
          )}
        </div>
        <Link to="/login">
          <FaUser className="text-xl cursor-pointer transition ease-in-out hover:scale-110 hover:text-teal-50" />
        </Link>
        <Link to="/cart">
          <FaShoppingCart className="text-xl cursor-pointer transition ease-in-out hover:scale-110 hover:text-teal-50" />
        </Link>
      </div>
    </div>
  );
}
