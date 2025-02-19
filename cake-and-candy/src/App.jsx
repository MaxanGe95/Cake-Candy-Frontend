import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react"; 
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Endproducts from "./pages/Endproducts";
import Futterplatz from "./pages/Futterplatz";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Recipes from "./pages/Recipes";

function App() {
  const [menuOpen, setMenuOpen] = useState(false); // Definiere den State hier

  return (
    <Router>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/endproducts" element={<Endproducts />} />
        <Route path="/futterplatz" element={<Futterplatz />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/products" element={<Products />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
