// Componente que exibe uma mensagem de erro estilizada
/**
 * Componente para exibição de mensagens de erro
 * Só renderiza se houver mensagem de erro
 * Usado para feedback visual em formulários de autenticação
 * @param {string} error Mensagem de erro
 * @returns {JSX.Element|null} Card de erro
 */
// Componente que exibe uma mensagem de erro estilizada
export default function ErrorCard({error}) {
    // Renderiza o parágrafo apenas se houver uma mensagem de erro (string não vazia)
    return error !== "" && (
        // Parágrafo estilizado para exibir o erro
        <p
        className='text-red-600 border border-red-600 p-2 bg-red-200 rounded mb-2'
        >
            {/* Exibe o texto do erro recebido via prop */}
            {error}
        </p>
    )
}