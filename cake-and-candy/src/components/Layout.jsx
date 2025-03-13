import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-start bg-linear-160 from-teal-500 to-stone-900 text-white">
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
