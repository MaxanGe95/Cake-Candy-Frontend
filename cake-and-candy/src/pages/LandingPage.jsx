// LandingPage.js
import { useState } from "react";
import Button from "../components/Button";
import Navbar from "../components/Navbar.jsx";
import muffinImage from "../assets/muffin.jpg";
import Start from "../components/Start";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <Start></Start>
      <div className="w-full size-500">
        Hier könnte Inhalt stehen
      </div>
    </div>
  );
}
