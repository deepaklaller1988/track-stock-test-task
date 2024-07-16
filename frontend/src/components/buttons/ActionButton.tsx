import { IoIosArrowRoundForward } from "react-icons/io";

export const ActionButton = ({ text, onClick }:any) => (
    <button className="w-full mb-4 pColor flex gap-2 items-center" onClick={onClick}>
      {text} <IoIosArrowRoundForward className="w-6 h-6" />
    </button>
  );