/**
 * CONTEÚDO DO WIDGET DE ACESSIBILIDADE
 * 
 * Este arquivo contém o conteúdo principal do widget de acessibilidade, incluindo
 * todas as funcionalidades de acessibilidade como ajuste de fonte, espaçamento,
 * contraste e leitura em voz alta. Este componente é carregado de forma lazy
 * pelo componente pai para otimizar a performance.
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { useState, useEffect } from "react"; // Importa hooks do React para gerenciar estado e efeitos
import { FaVolumeUp, FaPlus, FaMinus, FaLowVision, FaUniversalAccess } from "react-icons/fa"; // Importa ícones da biblioteca react-icons
import ButtonAPP from "./ButtonAPP"; // Importa o componente de botão personalizado

export default function AccessibilityWidgetContent({ isOpen, setIsOpen }) {
  // Estado para controlar o tamanho da fonte (1 = tamanho normal)
  const [fontScale, setFontScale] = useState(1);
  // Estado para controlar o espaçamento entre letras em pixels
  const [letterSpacing, setLetterSpacing] = useState(1);
  // Estado para controlar o espaçamento entre linhas
  const [lineSpacing, setLineSpacing] = useState(1.5);
  // Estado para controlar se o alto contraste está ativado
  const [highContrast, setHighContrast] = useState(false);
  // Estado para controlar se a leitura em voz alta está ativa
  const [speechEnabled, setSpeechEnabled] = useState(false);
  // Verifica se a API de síntese de voz está disponível no navegador
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  // Efeito que aplica o tamanho da fonte ao documento quando fontScale muda
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}em`; // Aplica o tamanho da fonte ao elemento raiz
  }, [fontScale]); // Executa sempre que fontScale mudar

  // Efeito que aplica o espaçamento entre linhas ao documento quando lineSpacing muda
  useEffect(() => {
    document.documentElement.style.lineHeight = `${lineSpacing}`; // Aplica o espaçamento entre linhas
  }, [lineSpacing]); // Executa sempre que lineSpacing mudar

  // Efeito que aplica o espaçamento entre letras ao documento quando letterSpacing muda
  useEffect(() => {
    document.documentElement.style.letterSpacing = `${letterSpacing}px`; // Aplica o espaçamento entre letras
  }, [letterSpacing]); // Executa sempre que letterSpacing mudar

  // Efeito que aplica ou remove o filtro de alto contraste
  useEffect(() => {
    if (highContrast) {
      document.documentElement.style.filter = "contrast(1.5)"; // Aplica filtro de alto contraste
    } else {
      document.documentElement.style.filter = "none"; // Remove o filtro
    }
  }, [highContrast]); // Executa sempre que highContrast mudar

  // Função para controlar a leitura em voz alta
  const handleSpeak = () => {
    if (synth) { // Verifica se a síntese de voz está disponível
      if (!speechEnabled) { // Se não está lendo, inicia a leitura
        setSpeechEnabled(true); // Marca como ativo
        const text = document.body.innerText; // Pega todo o texto da página
        const utterance = new SpeechSynthesisUtterance(text); // Cria objeto de síntese de voz
        synth.speak(utterance); // Inicia a leitura
      } else { // Se está lendo, para a leitura
        setSpeechEnabled(false); // Marca como inativo
        synth.cancel(); // Para a síntese de voz
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-start z-50">
      {/* Botão principal do widget de acessibilidade */}
      <button
        onClick={() => setIsOpen(!isOpen)} // Alterna entre aberto e fechado
        className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        <FaUniversalAccess size={24} /> {/* Ícone de acessibilidade universal */}
      </button>
      {/* Painel de controles que aparece quando o widget está aberto */}
      {isOpen && (
        <div className="mt-3 p-3 bg-white shadow-lg rounded-xl flex flex-col space-y-2 max-w-xs"
          style={{ position: "fixed", bottom: "80px", right: "20px" }}>
          {/* Botão para aumentar o tamanho da fonte */}
          <ButtonAPP onClick={() => setFontScale((scale) => Math.min(2, scale + 0.1))}>
            <FaPlus className="mr-2" /> Aumentar Fonte
          </ButtonAPP>
          {/* Botão para diminuir o tamanho da fonte */}
          <ButtonAPP onClick={() => setFontScale((scale) => Math.max(0.8, scale - 0.1))}>
            <FaMinus className="mr-2" /> Diminuir Fonte
          </ButtonAPP>
          {/* Botão para aumentar o espaçamento entre letras */}
          <ButtonAPP onClick={() => setLetterSpacing((spacing) => Math.min(5, spacing + 0.5))}>
            <FaPlus className="mr-2" /> Aumentar Espaçamento entre Letras
          </ButtonAPP>
          {/* Botão para diminuir o espaçamento entre letras */}
          <ButtonAPP onClick={() => setLetterSpacing((spacing) => Math.max(0, spacing - 0.5))}>
            <FaMinus className="mr-2" /> Diminuir Espaçamento entre Letras
          </ButtonAPP>
          {/* Botão para alternar alto contraste */}
          <ButtonAPP onClick={() => setHighContrast((prev) => !prev)}>
            <FaLowVision className="mr-2" /> Alto Contraste
          </ButtonAPP>
          {/* Botão para leitura em voz alta */}
          <ButtonAPP onClick={handleSpeak}>
            <FaVolumeUp className="mr-2" /> {speechEnabled ? "Parar Leitura" : "Ler em Voz Alta"}
          </ButtonAPP>
        </div>
      )}
    </div>
  );
}
