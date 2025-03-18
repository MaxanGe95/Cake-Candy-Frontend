import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-start bg-linear-160 from-teal-500 to-stone-900 text-white">
      <div className="mb-2">{children}</div>
      <Footer />
      <div className="fixed bottom-0 right-0 ml-auto z-1000">
        <ScrollToTop className="m-3" />
      </div>
    </div>
  );
};

export default Layout;
