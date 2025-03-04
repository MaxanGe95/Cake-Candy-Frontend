import { useState, useRef, useEffect } from "react";
import { IconChevronDown } from "@tabler/icons-react";

const DropdownInput = ({
  options,
  value,
  onChange,
  onChangeObject,
  valueKey,
  nameKey,
  placeholder = "Wähle einen Wert",
  className = "",
  error = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    (nameKey ? option[nameKey] : option)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedOption = options.find((option) =>
    valueKey ? option[valueKey] === value : option === value
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`border rounded p-2 cursor-pointer flex items-center ${
          error
            ? "border-red-500 bg-red-100 text-red-700"
            : "border-amber-100 bg-teal-400/10"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedOption
            ? nameKey
              ? selectedOption[nameKey]
              : selectedOption
            : placeholder}
        </span>
        <IconChevronDown className="w-5 h-5 ml-auto" />
      </div>
      {error && error.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {isOpen && (
        <div className="absolute w-full border border-teal-500 bg-teal-800 mt-1 rounded-lg shadow-lg z-10">
          <input
            ref={inputRef}
            type="text"
            placeholder="Suchen..."
            className="w-full p-2 border-b border-teal-300 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="p-2 hover:bg-teal-400 cursor-pointer"
                onClick={() => {
                  onChange?.(valueKey ? option[valueKey] : option);
                  onChangeObject?.(option);
                  setIsOpen(false);
                  setSearch("");
                }}
              >
                {nameKey ? option[nameKey] : option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const MultipleDropdownInput = ({
  options,
  value = [],
  onChange,
  valueKey,
  nameKey,
  placeholder = "Wähle einen Wert",
  className = "",
  error = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    (nameKey ? option[nameKey] : option)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSelect = (selectedValue) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange(newValue);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`border rounded p-1 cursor-pointer flex items-center flex-wrap gap-1 ${
          error
            ? "border-red-500 bg-red-100 text-red-700"
            : "border-amber-100 bg-teal-400/10"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length > 0 ? (
          value.map((val, index) => (
            <span
              key={index}
              className="bg-teal-500 text-amber-100 px-2 py-1 rounded"
            >
              {nameKey
                ? options.find((opt) => opt[valueKey] === val)?.[nameKey]
                : val}
            </span>
          ))
        ) : (
          <span>{placeholder}</span>
        )}
        <IconChevronDown className="w-5 h-5 ml-auto" />
      </div>
      {error && error.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {isOpen && (
        <div className="absolute w-full border border-teal-500 bg-teal-800 mt-1 rounded-lg shadow-lg z-10">
          <input
            ref={inputRef}
            type="text"
            placeholder="Suchen..."
            className="w-full p-2 border-b border-teal-300 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option, index) => {
              const optionValue = valueKey ? option[valueKey] : option;
              const isSelected = value.includes(optionValue);
              return (
                <div
                  key={index}
                  className={`p-2 flex items-center cursor-pointer hover:bg-teal-400 ${
                    isSelected ? "bg-teal-600 text-amber-100" : ""
                  }`}
                  onClick={() => handleSelect(optionValue)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelect(optionValue)}
                    className="mr-2"
                  />
                  {nameKey ? option[nameKey] : option}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const InputNumber = ({
  value,
  onChange,
  placeholder = "0",
  className = "",
  error = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={placeholder}
        className={`w-full border rounded p-2 bg-teal-400/10 focus:outline-none focus:ring-2 focus:ring-amber-100 ${
          error ? "border-red-500 bg-red-100 text-red-700" : "border-teal-50"
        }`}
      />
      {error && error.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

const InputString = ({
  value,
  onChange,
  placeholder = "Eingeben...",
  className = "",
  error = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded p-2 bg-teal-400/10 focus:outline-none focus:ring-2 focus:ring-amber-100 ${
          error ? "border-red-500 bg-red-100 text-red-700" : "border-teal-50"
        }`}
      />
      {error > 0 && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const InputTextarea = ({
  value,
  onChange,
  placeholder = "Eingeben...",
  className = "",
  error = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <textarea
        min="0"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded p-2 bg-teal-400/10 focus:outline-none focus:ring-2 focus:ring-amber-100 ${
          error ? "border-red-500 bg-red-100 text-red-700" : "border-teal-50"
        }`}
        rows={Math.max(3, value?.split("\n").length)}
      />
      {error > 0 && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const InputCurrency = ({
  value,
  onChange,
  placeholder = "0",
  className = "",
  error = "",
  currency = "€",
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex place-items-center align-center w-full border rounded bg-teal-400/10 focus:ring-1 focus:ring-amber-100 ${
          error ? "border-red-500 bg-red-100 text-red-700" : "border-teal-50"
        }`}
      >
        <span className="ml-1">{currency}</span>
        <input
          min="0"
          step="any"
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={placeholder}
          className="w-full h-full p-2 pl-1 focus:outline-none"
        />
      </div>
      {error && error.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
export {
  MultipleDropdownInput,
  DropdownInput,
  InputNumber,
  InputString,
  InputTextarea,
  InputCurrency,
};
