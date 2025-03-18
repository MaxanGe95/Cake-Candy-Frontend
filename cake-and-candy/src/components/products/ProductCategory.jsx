import { FlyInWrapper } from "./FlyInWrapper";

const ProductCategory = ({ children, name, className = "" }) => {
  return (
    <div
      id={name}
      className={`min-h-screen p-4 mt-8 rounded-xl ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex items-center justify-center">
        <FlyInWrapper>
          <h2 className="xl:text-3xl font-bold bg-teal-950/70 p-2 rounded-xl mb-1">
            {name}
          </h2>
        </FlyInWrapper>
      </div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export { ProductCategory };
