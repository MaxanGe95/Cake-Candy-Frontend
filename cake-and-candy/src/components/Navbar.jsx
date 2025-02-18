import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Landing Page</Link></li>
        <li><Link to="/endproducts">EndProdukte</Link></li>
        <li><Link to="/futterplatz">Futterplatz</Link></li>
        <li><Link to="/orders">Bestellungen</Link></li>
        <li><Link to="/employees">Mitarbeiter</Link></li>
        <li><Link to="/inventory">Lager Bestand</Link></li>
        <li><Link to="/recipes">Rezepte</Link></li>
        <li><Link to="/products">Produkte</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
