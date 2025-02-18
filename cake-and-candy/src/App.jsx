import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Endproducts from "./pages/Endproducts";
import Futterplatz from "./pages/Futterplatz";
import Orders from "./pages/Orders";
import Employees from "./pages/Employees";
import Inventory from "./pages/Inventory";
import Recipes from "./pages/Recipes";
import Products from "./pages/Products";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
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
