import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-linear-160 from-teal-500 to-stone-900 text-white">
      {children}
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Layout;