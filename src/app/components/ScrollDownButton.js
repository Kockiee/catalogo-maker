'use client'

import { HiArrowDown } from "react-icons/hi";

export default function ScrollDownButton(destinyId) {
    return (
        <button
        className="bg-cornflowerblue hover:opacity-70 rounded-full animate-bounce p-3"
        onClick={() => {
          const destiny = document.querySelector(destinyId);
          window.scrollTo({
            top: destiny.offsetTop,
            behavior: 'smooth'
          });
        }}
        >
          <HiArrowDown className="text-lightcyan w-8 h-8 "/>
        </button>
    )
}