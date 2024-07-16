import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";

const Button = ({ children, onClick, type }: any) => {
  return (
    <div className="w-full">
      <button
        onClick={onClick}
        type={type}
        className="w-full text-center text-white bg-[#34495e] px-6 py-2 rounded-xl mt-6 transition hover:bg-[#2c3e70] duration-300"
      >
        {children}{" "}
      </button>
    </div>
  );
};

export default Button;
