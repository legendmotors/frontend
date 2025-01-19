import React from "react";
import Select from "react-select";

const optionsDefault = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "3_days", label: "3 Days" },
];

export default function DropdownSelect({
  onChange = () => {},
  options = optionsDefault,
  defaultOption,
  selectedValue,
  additionalParentClass = "",
  placeholder = "Select an option...",
  isMulti = false,
}) {
  const defaultOptionObj = options.find(
    (option) => option.value === selectedValue || option.label === defaultOption
  ) || null;

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#ccc" : "#EDEDED",
      borderWidth: "1px",
      boxShadow: state.isFocused ? "0 0 0 1px #00000" : "none",
      "&:hover": {
        borderColor: "#bbb",
      },
      borderRadius: "15px",
      minHeight: "40px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: "flex",
      flexWrap: "nowrap",
      padding: "11px 12px",
      maxWidth: "210px", // Ensure the width doesn't exceed the container
    }),
    multiValue: (provided) => ({
      ...provided,
      display: "inline-flex",
      margin: "2px",
      borderRadius: "10px",
      backgroundColor: "#f0f0f0",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontSize: "14px",
      color: "#333",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#999",
      "&:hover": {
        backgroundColor: "#e0e0e0",
        color: "#000",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#696665",
      fontSize: "14px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#00000",
      "&:hover": {
        color: "#00000",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10,
      borderRadius: "4px",
      overflow: "hidden",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      animation: "fadeIn 0.3s ease-in-out", // Add dropdown animation
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "0",
      maxHeight: "200px",
      overflowY: "auto",
      scrollbarWidth: "6px", // Thin scrollbar for Firefox
      "&::-webkit-scrollbar": {
        width: "6px", // Thin scrollbar for WebKit
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#ED8721",
        borderRadius: "3px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#aaa",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f5f5f5" : "white",
      color: "#333",
      padding: "10px 12px",
      fontSize: "14px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#eee",
      },
    }),
  };

  return (
    <div className={`dropdown-select ${additionalParentClass}`}>
      <Select
        classNamePrefix="react-select"
        options={options}
        value={isMulti ? selectedValue : options.find((option) => option.value === selectedValue)}
        onChange={(selectedOption) => {
          if (isMulti) {
            onChange(selectedOption ? selectedOption.map((opt) => opt.value) : []);
          } else {
            onChange(selectedOption ? selectedOption.value : null);
          }
        }}
        styles={customStyles}
        placeholder={placeholder} // Always show placeholder
        isMulti={isMulti} // Enable multi-select functionality
        isClearable // Allow clearing selections
      />
    </div>
  );
}
