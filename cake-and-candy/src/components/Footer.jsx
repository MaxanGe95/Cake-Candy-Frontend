import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full mt-auto bg-teal-800/50 text-amber-100 py-10 text-sm z-999">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
        {/* Logo */}
        <div className="md:w-1/4">
          <h2 className="text-lg font-semibold">Cake & Candy</h2>
          <p className="text-[#5eeaff] mt-2">Folge #cakeandcandy</p>
          <div className="flex space-x-4 mt-2">
            <a
              href="#"
              className="text-[#5eeaff] hover:text-amber-100 transition"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-[#5eeaff] hover:text-amber-100 transition"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-[#5eeaff] hover:text-amber-100 transition"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-[#5eeaff] hover:text-amber-100 transition"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-[#5eeaff] hover:text-amber-100 transition"
              aria-label="YouTube"
            >
              <FaYoutube className="w-5 h-5" />
            </a>
          </div>
        </div>
        {/* Navigation */}
        <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold">CAKE & CANDY</h3>
            <ul className="text-[#5eeaff] mt-2 space-y-1">
              <li>
                <a href="#" className="hover:text-amber-100">
                  Unsere Geschichte
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Unsere Werte
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Werde Teil von uns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Presse & Kontakt
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">UNSERE KOLLEKTIONEN</h3>
            <ul className="text-[#5eeaff] mt-2 space-y-1">
              <li>
                <a href="#" className="hover:text-amber-100">
                  Schokoladen
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Gebäck
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Zum Verschenken
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Saisonale Spezialitäten
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">UNSERE SERVICES</h3>
            <ul className="text-[#5eeaff] mt-2 space-y-1">
              <li>
                <a href="#" className="hover:text-amber-100">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Lieferung
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Firmenpräsente
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">RECHTLICHE INFORMATIONEN</h3>
            <ul className="text-[#5eeaff] mt-2 space-y-1">
              <li>
                <a href="#" className="hover:text-amber-100">
                  Cookie-Einstellungen
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Datenschutzrichtlinie
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Allgemeine Geschäftsbedingungen
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-100">
                  Impressum
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Barrierefreiheit & Copyright */}
      <div className="container mx-auto mt-10 border-t border-gray-700 pt-6 text-center text-[#5eeaff] text-xs">
        <p>
          &copy; {new Date().getFullYear()} Cake & Candy. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
};

export default Footer;