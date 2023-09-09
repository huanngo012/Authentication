import React from "react";

const InputField = ({ value, setValue, name, nameKey, type }) => {
  return (
    <div className="w-full relative">
      {value.trim() !== "" && (
        <label
          className="text-[10px] absolute top-0 left-[12px] block bg-white px-1"
          htmlFor={name}
        >
          {name}
        </label>
      )}
      <input
        type={type || "type"}
        className="px-4 py-2 rounded-sm border w-full my-2 placeholder:text-sm placeholder:italic outline-none bg-white"
        placeholder={name}
        value={value}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
        }
      />
    </div>
  );
};

export default InputField;
