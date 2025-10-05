/**
 * COMPONENTE DE ACESSIBILIDADE
 * 
 * Este arquivo contém o componente principal do widget de acessibilidade do Catálogo Maker.
 * Ele fornece funcionalidades de acessibilidade como ajuste de fonte, contraste, leitura em voz alta,
 * e outras opções para tornar o site mais acessível para usuários com necessidades especiais.
 * 
 * O componente utiliza lazy loading para melhorar a performance da aplicação, carregando
 * o conteúdo de acessibilidade apenas quando necessário.
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { useState, useEffect, lazy, Suspense } from "react"; // Importa hooks do React e componentes para lazy loading
import { FaVolumeUp, FaPlus, FaMinus, FaLowVision, FaUniversalAccess } from "react-icons/fa"; // Importa ícones da biblioteca react-icons
import ButtonAPP from "./ButtonAPP"; // Importa o componente de botão personalizado

// Lazy load do componente de acessibilidade para melhor performance
// Carrega o componente AccessibilityContent apenas quando necessário
const AccessibilityWidgetContent = lazy(() => import('./AccessibilityContent'));

export default function AccessibilityWidget() {
  // Estado para controlar se o widget está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);
  // Estado para controlar se o componente foi montado (evita problemas de hidratação)
  const [mounted, setMounted] = useState(false);

  // Efeito que executa quando o componente é montado
  useEffect(() => {
    setMounted(true); // Marca o componente como montado
  }, []); // Array vazio significa que executa apenas uma vez

  // Se o componente ainda não foi montado, não renderiza nada
  // Isso evita problemas de hidratação entre servidor e cliente
  if (!mounted) {
    return null;
  }

  return (
    // Suspense permite mostrar um fallback enquanto o componente lazy está carregando
    <Suspense fallback={
      // Fallback: botão de acessibilidade que aparece enquanto carrega
      <div className="fixed bottom-20 right-5 z-40">
        <button className="p-3 bg-blue-600 text-white rounded-full shadow-lg">
          <FaUniversalAccess size={24} />
        </button>
      </div>
    }>
      {/* Renderiza o conteúdo do widget de acessibilidade */}
      <AccessibilityWidgetContent isOpen={isOpen} setIsOpen={setIsOpen} />
    </Suspense>
  );
}
