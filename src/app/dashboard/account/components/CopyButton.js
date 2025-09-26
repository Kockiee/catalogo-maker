'use client'

// Importação do componente Tooltip do Flowbite React
import { Tooltip } from "flowbite-react"
// Importação do ícone de copiar
import { MdOutlineContentCopy } from "react-icons/md"
// Importação do hook personalizado para notificações
import { useNotifications } from "../../../hooks/useNotifications"

/**
 * Componente de botão para copiar texto para a área de transferência
 * Exibe tooltip e notificação de sucesso/erro
 * @param {string} toCopy - Texto que será copiado para a área de transferência
 * @param {string} successMessage - Mensagem de sucesso (não utilizada diretamente)
 * @returns {JSX.Element} Botão com tooltip e funcionalidade de cópia
 */
export default function CopyButton({toCopy, successMessage}) {
    // Desestruturação da função de notificação do hook personalizado
    const { notify } = useNotifications();

    /**
     * Função assíncrona para copiar texto para a área de transferência
     * Utiliza a API Clipboard do navegador
     * @throws {Error} Se a operação de cópia falhar
     */
    const handleCopy = async () => {
        try {
            // Escreve o texto na área de transferência do navegador
            await navigator.clipboard.writeText(toCopy);
            // Exibe notificação de sucesso
            notify.copiedToClipboard();
        } catch (error) {
            // Exibe notificação de erro se a cópia falhar
            notify.error("Erro ao copiar para a área de transferência");
        }
    };

    // Renderiza o botão com tooltip e funcionalidade de cópia
    return (
        <>
            {/* Tooltip que aparece ao passar o mouse sobre o botão */}
            <Tooltip content="Copiar" placement="left" className="bg-gray-600" arrow={false}>
                {/* Botão estilizado para copiar */}
                <button
                    className="duration-200 text-lightcyan bg-cornflowerblue hover:bg-neonblue rounded p-1.5 border border-neonblue ml-2"
                    onClick={handleCopy}  // Executa função de cópia ao clicar
                >
                    <MdOutlineContentCopy className="w-6 h-6"/>  {/* Ícone de copiar */}
                </button>
            </Tooltip>
        </>
    )
}