import React from "react";
import { FaCalendar } from "react-icons/fa6";

type Props = {
  value?: string;
  onClick?: () => void;
};

export const CustomDateInput = React.forwardRef<HTMLInputElement, Props>(
  ({ value, onClick }, ref) => (
    <div
      className="flex items-center w-[65%] bg-[#F3F4F7] border border-gray-300 rounded px-3 py-1 cursor-pointer"
      onClick={onClick}
    >
      <input
        ref={ref}
        value={value}
        readOnly
        className="bg-transparent outline-none w-full text-sm"
      />
      <FaCalendar className="text-gray-400 ml-2" />
    </div>
  )
);
CustomDateInput.displayName = "CustomDateInput";
