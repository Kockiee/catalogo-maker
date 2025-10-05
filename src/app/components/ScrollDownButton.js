/**
 * COMPONENTE DE BOTÃO DE SCROLL
 * 
 * Este arquivo contém um componente de botão animado que faz scroll suave
 * para uma seção específica da página quando clicado. Útil para navegação
 * dentro da mesma página.
 * 
 * Funcionalidades:
 * - Scroll suave para elemento específico
 * - Animação de bounce
 * - Ícone de seta para baixo
 * - Efeito hover
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { HiArrowDown } from "react-icons/hi"; // Importa ícone de seta para baixo

export default function ScrollDownButton({ destinyId }) {
  // Função chamada quando o botão é clicado
  const handleClick = () => {
    const destiny = document.querySelector(destinyId); // Busca o elemento de destino pelo ID
    if (destiny) { // Se o elemento existe
      window.scrollTo({
        top: destiny.offsetTop, // Posição vertical do elemento
        behavior: "smooth" // Scroll suave
      });
    }
  };

  return (
    <button
      className="duration-200 bg-cornflowerblue hover:opacity-70 rounded-full animate-bounce p-3" // Classes de estilo com animação bounce
      onClick={handleClick} // Função chamada no clique
    >
      <HiArrowDown className="text-lightcyan w-8 h-8" /> {/* Ícone de seta para baixo */}
    </button>
  );
}