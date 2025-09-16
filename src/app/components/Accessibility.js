'use client'
import { useState, useEffect, lazy, Suspense } from "react";
import { FaVolumeUp, FaPlus, FaMinus, FaLowVision, FaUniversalAccess } from "react-icons/fa";
import ButtonAPP from "./ButtonAPP";

// Lazy load do componente de acessibilidade para melhor performance
const AccessibilityWidgetContent = lazy(() => import('./AccessibilityContent'));

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Suspense fallback={<div className="fixed bottom-20 right-5 z-40">
      <button className="p-3 bg-blue-600 text-white rounded-full shadow-lg">
        <FaUniversalAccess size={24} />
      </button>
    </div>}>
      <AccessibilityWidgetContent isOpen={isOpen} setIsOpen={setIsOpen} />
    </Suspense>
  );
}
