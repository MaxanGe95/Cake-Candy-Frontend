import { FaTrash, FaEdit } from "react-icons/fa";

const DeleteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 border rounded m-1 p-2 h-10 w-10 cursor-pointer transition ease-in-out hover:scale-110"
    >
      <FaTrash className="m-auto" />
    </button>
  );
};
const EditButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-teal-900 border rounded m-1 p-2 h-10 w-10 cursor-pointer transition ease-in-out hover:scale-110 ${className}`}
    >
      <FaEdit className="m-auto" />
    </button>
  );
};

const PrimaryButton = ({ onClick, children, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-teal-950 text-amber-100 p-2 rounded-md hover:bg-teal-800 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};
const SecondaryButton = ({ onClick, children, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-teal-950 text-amber-100 p-2 rounded-md hover:bg-teal-800 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export { DeleteButton, PrimaryButton, SecondaryButton, EditButton };
