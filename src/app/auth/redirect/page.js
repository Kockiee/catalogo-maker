/**
 * Página de Redirecionamento para App Mobile
 * 
 * Esta página é usada para redirecionar usuários de volta para o aplicativo
 * mobile após completarem o processo de autenticação no navegador.
 * Utiliza um esquema de URL personalizado para comunicar com o app nativo.
 */

'use client'

// Importa o hook useEffect para executar ações após renderização
import { useEffect } from "react";

/**
 * Componente de redirecionamento para app mobile
 * @returns {JSX.Element} - Mensagem de redirecionamento
 */
export default function RedirectHandler() {
  // Efeito que executa o redirecionamento após a renderização
  useEffect(() => {
    // Redireciona para o app mobile usando esquema de URL personalizado
    // O esquema "catalogomakermobile://" é registrado pelo app nativo
    // O parâmetro "success=true" indica que a autenticação foi bem-sucedida
    window.location.href = "catalogomakermobile://auth?success=true";
  }, []);

  // Retorna mensagem informativa para o usuário
  return <p>Redirecionando de volta para o app...</p>;
}
