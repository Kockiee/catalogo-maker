/**
 * COMPONENTE DE LOADING/SPINNER
 * 
 * Este arquivo contém componentes de loading com diferentes variações para
 * exibir estados de carregamento na aplicação. Inclui spinner básico, loader
 * de tela cheia e loader inline.
 * 
 * Funcionalidades:
 * - Spinner animado com diferentes tamanhos e cores
 * - Mensagem de carregamento opcional
 * - Loader de tela cheia para operações importantes
 * - Loader inline para elementos específicos
 * - Acessibilidade com ARIA labels
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente

export default function LoadingSpinner({ 
  size = 'md', // Tamanho do spinner (xs, sm, md, lg, xl)
  message = 'Carregando...', // Mensagem de carregamento
  color = 'primary', // Cor do spinner (primary, white, gray)
  className = '', // Classes CSS adicionais
  showMessage = true // Se deve mostrar a mensagem
}) {
  // Classes de tamanho para o spinner
  const sizeClasses = {
    xs: 'h-4 w-4', // Extra pequeno
    sm: 'h-6 w-6', // Pequeno
    md: 'h-8 w-8', // Médio
    lg: 'h-12 w-12', // Grande
    xl: 'h-16 w-16' // Extra grande
  };

  // Classes de cor para o spinner
  const colorClasses = {
    primary: 'border-neonblue', // Cor primária (azul)
    white: 'border-white', // Branco
    gray: 'border-gray-400' // Cinza
  };

  // Classes de tamanho para o texto
  const textSizeClasses = {
    xs: 'text-xs', // Extra pequeno
    sm: 'text-sm', // Pequeno
    md: 'text-base', // Médio
    lg: 'text-lg', // Grande
    xl: 'text-xl' // Extra grande
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner animado */}
      <div 
        className={`
          animate-spin rounded-full border-b-2 
          ${sizeClasses[size]} 
          ${colorClasses[color]}
        `}
        role="status" // Atributo de acessibilidade
        aria-label="Carregando" // Label para leitores de tela
      >
        <span className="sr-only">{message}</span> {/* Texto oculto para leitores de tela */}
      </div>
      {/* Mensagem de carregamento */}
      {showMessage && (
        <p className={`mt-2 text-gray-600 ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
    </div>
  );
}

// Componente para loading em tela cheia
export function FullScreenLoader({ message = 'Carregando...', size = 'lg' }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <LoadingSpinner 
          size={size} // Tamanho grande para tela cheia
          message={message} // Mensagem personalizada
          color="primary" // Cor primária
        />
      </div>
    </div>
  );
}

// Componente para loading inline
export function InlineLoader({ message = 'Carregando...', size = 'sm' }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} showMessage={false} /> {/* Spinner sem mensagem */}
      <span className="text-sm text-gray-600">{message}</span> {/* Mensagem separada */}
    </div>
  );
}
