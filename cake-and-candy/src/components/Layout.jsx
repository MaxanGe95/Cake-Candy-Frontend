const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-linear-160 from-teal-500 to-stone-900 text-white">
      {children}
    </div>
  );
};

export default Layout;