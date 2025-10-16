/**
 * FullScreenLoader - Componente de loading em tela cheia
 * 
 * Este componente exibe um overlay cobrindo toda a tela com um spinner centralizado,
 * utilizado para indicar carregamento de dados ou operações importantes.
 * 
 * Props:
 * - message: string (opcional) - mensagem de acessibilidade para o spinner (default: "Carregando...")
 * - size: string (opcional) - tamanho do spinner (default: "lg")
 * 
 * Acessibilidade:
 * - O spinner recebe um aria-label com a mensagem fornecida.
 */

'use client'
import { Spinner } from "flowbite-react";

 // Diretiva para indicar que este componente roda no lado do cliente

// Componente para loading em tela cheia
export function FullScreenLoader({ message = 'Carregando...', size = 'lg' }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-2">
        <Spinner color="info" size={size} />
        <span className="text-prussianblue">{message}</span>
      </div>
    </div>
  );
}