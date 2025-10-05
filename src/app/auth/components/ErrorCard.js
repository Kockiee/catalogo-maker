/**
 * Componente de Exibição de Erros
 * 
 * Este componente é responsável por exibir mensagens de erro de forma
 * consistente em toda a aplicação. Aparece apenas quando há uma mensagem
 * de erro para exibir, com estilo visual que chama atenção para o problema.
 */

/**
 * Componente para exibir mensagens de erro
 * @param {string} error - Mensagem de erro a ser exibida
 * @returns {JSX.Element|null} - Elemento de erro ou null se não houver erro
 */
export default function ErrorCard({error}) {
    // Retorna o componente apenas se houver uma mensagem de erro
    return error !== "" && (
        <p
        className='text-red-600 border border-red-600 p-2 bg-red-200 rounded mb-2'
        >
            {/* Exibe a mensagem de erro */}
            {error}
        </p>
    )
}