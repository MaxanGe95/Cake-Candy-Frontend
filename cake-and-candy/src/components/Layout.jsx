import ScrollToTop from "../components/ScrollToTop";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-linear-160 from-teal-500 to-stone-900 text-white">
      {children}
      <ScrollToTop />
    </div>
  );
};

export default Layout;