'use client' // Diretiva para indicar que este código executa no cliente
import { useState, useEffect } from "react"; // Importação dos hooks useState e useEffect do React
import { FaVolumeUp, FaPlus, FaMinus, FaLowVision, FaUniversalAccess } from "react-icons/fa"; // Importação de ícones da biblioteca react-icons
import ButtonAPP from "./ButtonAPP"; // Importação do componente ButtonAPP personalizado

/**
 * Componente de acessibilidade que oferece recursos para melhorar a experiência de usuários com necessidades especiais
 * Inclui opções para ajustar tamanho de fonte, espaçamento, contraste e leitura de tela
 */
export default function AccessibilityWidget() {
  // Estados para controlar as diferentes configurações de acessibilidade
  const [fontScale, setFontScale] = useState(1); // Controla o tamanho da fonte (1 = tamanho padrão)
  const [letterSpacing, setLetterSpacing] = useState(1); // Controla o espaçamento entre letras em pixels
  const [lineSpacing, setLineSpacing] = useState(1.5); // Controla o espaçamento entre linhas
  const [highContrast, setHighContrast] = useState(false); // Controla se o modo de alto contraste está ativado
  const [speechEnabled, setSpeechEnabled] = useState(false); // Controla se a leitura de tela está ativada
  const [isOpen, setIsOpen] = useState(false); // Controla se o menu de acessibilidade está aberto ou fechado
  
  // Acessa a API de síntese de voz do navegador, verificando se está no ambiente do cliente
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  // Effect para aplicar a escala de fonte quando o valor mudar
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}em`; // Aplica o tamanho da fonte ao elemento raiz do documento
  }, [fontScale]); // Executa quando fontScale mudar

  // Effect para aplicar o espaçamento entre linhas quando o valor mudar
  useEffect(() => {
    document.documentElement.style.lineHeight = `${lineSpacing}`; // Aplica o espaçamento entre linhas ao elemento raiz
  }, [lineSpacing]); // Executa quando lineSpacing mudar

  // Effect para aplicar o espaçamento entre letras quando o valor mudar
  useEffect(() => {
    document.documentElement.style.letterSpacing = `${letterSpacing}px`; // Aplica o espaçamento entre letras ao elemento raiz
  }, [letterSpacing]); // Executa quando letterSpacing mudar

  // Effect para aplicar o filtro de alto contraste quando o estado mudar
  useEffect(() => {
    if (highContrast) {
      document.documentElement.style.filter = "contrast(1.5)"; // Aumenta o contraste da página
    } else {
      document.documentElement.style.filter = "none"; // Remove o filtro de contraste
    }
  }, [highContrast]); // Executa quando highContrast mudar

  /**
   * Função para iniciar ou parar a leitura de tela
   * Utiliza a API SpeechSynthesis para ler o conteúdo da página
   */
  const handleSpeak = () => {
    if (synth) { // Verifica se a API de síntese de voz está disponível
      if (!speechEnabled) {
        setSpeechEnabled(true); // Ativa o estado de leitura
        const text = document.body.innerText; // Obtém todo o texto visível na página
        const utterance = new SpeechSynthesisUtterance(text); // Cria um novo objeto de fala com o texto
        synth.speak(utterance); // Inicia a leitura do texto
      } else {
        setSpeechEnabled(false); // Desativa o estado de leitura
        synth.cancel(); // Cancela qualquer leitura em andamento
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-start z-50"> {/* Container principal fixado no canto inferior direito */}
      <button
        onClick={() => setIsOpen(!isOpen)} // Alterna o estado de abertura do menu
        className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all" // Estilização do botão
        style={{ position: "fixed", bottom: "20px", right: "20px" }} // Posicionamento fixo do botão
      >
        <FaUniversalAccess size={24} /> {/* Ícone de acessibilidade universal */}
      </button>
      {isOpen && ( // Renderização condicional do menu de acessibilidade quando isOpen for true
        <div className="mt-3 p-3 bg-white shadow-lg rounded-xl flex flex-col space-y-2 max-w-xs"
          style={{ position: "fixed", bottom: "80px", right: "20px" }}> {/* Container do menu de opções */}
          <ButtonAPP onClick={() => setFontScale((scale) => Math.min(2, scale + 0.1))}> {/* Botão para aumentar fonte com limite máximo de 2 */}
            <FaPlus className="mr-2" /> Aumentar Fonte
          </ButtonAPP>
          <ButtonAPP onClick={() => setFontScale((scale) => Math.max(0.8, scale - 0.1))}> {/* Botão para diminuir fonte com limite mínimo de 0.8 */}
            <FaMinus className="mr-2" /> Diminuir Fonte
          </ButtonAPP>
          <ButtonAPP onClick={() => setLetterSpacing((spacing) => Math.min(5, spacing + 0.5))}> {/* Botão para aumentar espaçamento entre letras com limite máximo de 5px */}
            <FaPlus className="mr-2" /> Aumentar Espaçamento entre Letras
          </ButtonAPP>
          <ButtonAPP onClick={() => setLetterSpacing((spacing) => Math.max(0, spacing - 0.5))}> {/* Botão para diminuir espaçamento entre letras com limite mínimo de 0px */}
            <FaMinus className="mr-2" /> Diminuir Espaçamento entre Letras
          </ButtonAPP>
          <ButtonAPP onClick={() => setHighContrast((prev) => !prev)}> {/* Botão para alternar o modo de alto contraste */}
            <FaLowVision className="mr-2" /> Alto Contraste
          </ButtonAPP>
          <ButtonAPP onClick={handleSpeak}> {/* Botão para iniciar ou parar a leitura de tela */}
            <FaVolumeUp className="mr-2" /> {speechEnabled ? "Parar Leitura" : "Ler em Voz Alta"} {/* Texto dinâmico baseado no estado atual */}
          </ButtonAPP>
        </div>
      )}
    </div>
  );
}
