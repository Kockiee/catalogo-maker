'use client'
import { HiArrowDown } from "react-icons/hi";

export default function ScrollDownButton({ destinyId }) {
  // Botão que realiza scroll suave até um elemento específico na página
  const handleClick = () => {
    const destiny = document.querySelector(destinyId); // Seleciona o elemento de destino pelo ID
    if (destiny) {
      window.scrollTo({
        top: destiny.offsetTop, // Calcula a posição do elemento na página
        behavior: "smooth" // Define o comportamento do scroll como suave
      });
    }
  };

  return (
    <button
      className="duration-200 bg-cornflowerblue hover:opacity-70 rounded-full animate-bounce p-3"
      onClick={handleClick} // Define a função de clique para o botão
    >
      <HiArrowDown className="text-lightcyan w-8 h-8" /> {/* Ícone de seta para baixo */}
    </button>
  );
}