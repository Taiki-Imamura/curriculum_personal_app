import React from "react";
import Optional from "./Optional";
import Require from "./Require";

type Props = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; color?: string }>;
  optional?: boolean;
  require?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<Props> = ({ id, label, icon: Icon, optional = false, require = false, value, onChange }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mx-10 mt-6 space-x-2">
        <Icon color="#F58220" className="text-2xl" />
        <label htmlFor={id} className="text-xs">{label}</label>
        {optional && <Optional />}
        {require && <Require />}
      </div>
      <div className="text-center">
        <input
          id={id}
          type="text"
          className="input input-sm bg-gray-100 border border-gray-200 px-2 w-[80%] mt-2"
          value={value}
          onChange={onChange} 
        />
      </div>
    </div>
  );
};

export default InputField;
