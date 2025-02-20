import { Link } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch, FaBars } from "react-icons/fa";


export default function Navbar({ menuOpen, setMenuOpen }) {
  return (
    <div className="fixed top-0 left-0 w-full bg-black bg-opacity-50 p-4 flex justify-between items-center text-white">
      <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl md:hidden">
        <FaBars />
      </button>
      <h1 className="text-xl md:text-2xl font-semibold tracking-wide">Cake&Candy</h1>
          <Link to="/">Landing Page</Link>
          <Link to="/endproducts">EndProdukte</Link>
          <Link to="/futterplatz">Futterplatz</Link>
          <Link to="/orders">Bestellungen</Link>
          <Link to="/employees">Mitarbeiter</Link>
          <Link to="/inventory">Lager Bestand</Link>
          <Link to="/recipes">Rezepte</Link>
          <Link to="/products">Produkte</Link>
          <Link to="/dashboard">Dashboard</Link>
      <div className="hidden md:flex gap-6">
        <Link to="/"><FaSearch className="text-xl cursor-pointer" /></Link>
        <Link to="/employees"><FaUser className="text-xl cursor-pointer" /></Link>
        <Link to="/cart"><FaShoppingCart className="text-xl cursor-pointer" /></Link>
      </div>
    </div>   
  );
}
