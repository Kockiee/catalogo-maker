'use client'

import { useEffect } from "react";

export default function RedirectHandler() {
  useEffect(() => {
    // Redireciona o usuário para o aplicativo móvel após login bem-sucedido
    window.location.href = "catalogomakermobile://auth?success=true";
  }, []); // Executa o redirecionamento apenas uma vez ao montar o componente

  return <p>Redirecionando de volta para o app...</p>; // Mensagem exibida enquanto o redirecionamento ocorre
}
