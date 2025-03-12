const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-teal-800/50 text-amber-100 text-center py-3 shadow-lg z-1000">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Cake & Candy. Alle Rechte
        vorbehalten.
      </p>
    </footer>
  );
};

export default Footer;
