'use client'
import { HiArrowDown } from "react-icons/hi";

export default function ScrollDownButton({ destinyId }) {
  const handleClick = () => {
    const destiny = document.querySelector(destinyId);
    if (destiny) {
      window.scrollTo({
        top: destiny.offsetTop,
        behavior: "smooth"
      });
    }
  };

  return (
    <button
      className="bg-cornflowerblue hover:opacity-70 rounded-full animate-bounce p-3"
      onClick={handleClick}
    >
      <HiArrowDown className="text-lightcyan w-8 h-8" />
    </button>
  );
}