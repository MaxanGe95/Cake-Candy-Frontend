import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Endproducts from "./pages/Endproducts";
import Futterplatz from "./pages/Futterplatz";
import Orders from "./pages/Orders";
import OrderRDP from "./components/Orders/OrderRDP";
import Products from "./pages/Products";
import Recipes from "./pages/Recipes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";

function App() {
  const [menuOpen, setMenuOpen] = useState(false); // Definiere den State hier

  return (
    <Router>
      <Layout>
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/endproducts" element={<Endproducts />} />
          <Route path="/futterplatz" element={<Futterplatz />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/rdp" element={<OrderRDP />} /> {/* Neue Route für RDP-Bestellungen */}
          <Route path="/employees" element={<Employees />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/products" element={<Products />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
