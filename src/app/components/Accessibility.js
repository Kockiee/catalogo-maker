'use client'
import { useState, useEffect } from "react";
import { FaVolumeUp, FaPlus, FaMinus, FaLowVision, FaUniversalAccess } from "react-icons/fa";
import ButtonAPP from "./ButtonAPP";

export default function AccessibilityWidget() {
  const [fontScale, setFontScale] = useState(1);
  const [letterSpacing, setLetterSpacing] = useState(1);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [highContrast, setHighContrast] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}em`;
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.style.lineHeight = `${lineSpacing}`;
  }, [lineSpacing]);

  useEffect(() => {
    document.documentElement.style.letterSpacing = `${letterSpacing}px`;
  }, [letterSpacing]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.style.filter = "contrast(1.5)";
    } else {
      document.documentElement.style.filter = "none";
    }
  }, [highContrast]);

  const handleSpeak = () => {
    if (synth) {
      if (!speechEnabled) {
        setSpeechEnabled(true);
        const text = document.body.innerText;
        const utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
      } else {
        setSpeechEnabled(false);
        synth.cancel();
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-start z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        <FaUniversalAccess size={24} />
      </button>
      {isOpen && (
        <div className="mt-3 p-3 bg-white shadow-lg rounded-xl flex flex-col space-y-2 max-w-xs"
          style={{ position: "fixed", bottom: "80px", left: "20px" }}>
          <ButtonAPP onClick={() => setFontScale((scale) => Math.min(2, scale + 0.1))}>
            <FaPlus className="mr-2" /> Aumentar Fonte
          </ButtonAPP>
          <ButtonAPP onClick={() => setFontScale((scale) => Math.max(0.8, scale - 0.1))}>
            <FaMinus className="mr-2" /> Diminuir Fonte
          </ButtonAPP>
          <ButtonAPP onClick={() => setLetterSpacing((spacing) => Math.min(5, spacing + 0.5))}>
            <FaPlus className="mr-2" /> Aumentar Espaçamento entre Letras
          </ButtonAPP>
          <ButtonAPP onClick={() => setLetterSpacing((spacing) => Math.max(0, spacing - 0.5))}>
            <FaMinus className="mr-2" /> Diminuir Espaçamento entre Letras
          </ButtonAPP>
          <ButtonAPP onClick={() => setHighContrast((prev) => !prev)}>
            <FaLowVision className="mr-2" /> Alto Contraste
          </ButtonAPP>
          <ButtonAPP onClick={handleSpeak}>
            <FaVolumeUp className="mr-2" /> {speechEnabled ? "Parar Leitura" : "Ler em Voz Alta"}
          </ButtonAPP>
        </div>
      )}
    </div>
  );
}
