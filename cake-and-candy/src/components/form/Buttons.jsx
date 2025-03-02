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
const EditButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-teal-900 border rounded m-1 p-2 h-10 w-10 cursor-pointer transition ease-in-out hover:scale-110"
    >
      <FaEdit className="m-auto" />
    </button>
  );
};

const PrimaryButton = ({ onClick, children, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-teal-950 text-amber-100 border rounded p-2 cursor-pointer transition ease-in-out hover:scale-110 ${className}`}
    >
      {children}
    </button>
  );
};
const SecondaryButton = ({ onClick, children, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-teal-900 text-amber-100 border rounded p-2  cursor-pointer transition ease-in-out hover:scale-110 ${className}`}
    >
      {children}
    </button>
  );
};

export { DeleteButton, PrimaryButton, SecondaryButton, EditButton };
