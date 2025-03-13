import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import ScrollToTop from "./ScrollToTop";

const Footer = () => {
  return (
    <div className="mt-auto sticky bottom-0 left-0 flex flex-col z-1000">
      <div className="ml-auto">
        <ScrollToTop className="m-3" />
      </div>
      <footer className="w-full bg-teal-800/50 text-amber-100 text-center py-4 shadow-lg z-1000">
        <div className="container mx-auto flex flex-col items-center space-y-2">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Cake & Candy. Alle Rechte
            vorbehalten.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white hover:scale-110" aria-label="Facebook">
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white hover:scale-110" aria-label="Instagram">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white hover:scale-110" aria-label="Twitter">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white hover:scale-110" aria-label="LinkedIn">
              <FaLinkedinIn className="w-5 h-5" />
            </a>
          </div>
          <nav className="text-xs">
            <a href="#" className="hover:underline px-2">
              Impressum
            </a>
            <a href="#" className="hover:underline px-2">
              Datenschutz
            </a>
            <a href="#" className="hover:underline px-2">
              AGB
            </a>
            <a href="#" className="hover:underline px-2">
              Kontakt
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
