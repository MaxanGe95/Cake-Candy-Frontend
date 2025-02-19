// src/components/button.js

const Button = ({ className, children, ...props }) => {
    return (
      <button className={`px-4 py-2 rounded ${className}`} {...props}>
        {children}
      </button>
    );
  };
  
  export default Button; 
  