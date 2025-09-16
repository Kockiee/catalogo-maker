'use client'

export default function LoadingSpinner({ 
  size = 'md', 
  message = 'Carregando...', 
  color = 'primary',
  className = '',
  showMessage = true 
}) {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6', 
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-neonblue',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`
          animate-spin rounded-full border-b-2 
          ${sizeClasses[size]} 
          ${colorClasses[color]}
        `}
        role="status"
        aria-label="Carregando"
      >
        <span className="sr-only">{message}</span>
      </div>
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
          size={size} 
          message={message} 
          color="primary"
        />
      </div>
    </div>
  );
}

// Componente para loading inline
export function InlineLoader({ message = 'Carregando...', size = 'sm' }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} showMessage={false} />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
}
