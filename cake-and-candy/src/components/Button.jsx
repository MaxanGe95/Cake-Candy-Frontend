// src/components/button.js

const Button = ({ className, children, ...props }) => {
    return (
      <button className={`px-3 py-1 rounded ${className}`} {...props}>
        {children}
      </button>
    );
  };
  
  export default Button; 
  