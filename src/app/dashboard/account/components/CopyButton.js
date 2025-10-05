/**
 * Componente de botão para copiar texto
 * 
 * Este arquivo contém um componente reutilizável que permite
 * copiar texto para a área de transferência. Inclui tooltip
 * informativo e notificação de sucesso.
 * 
 * Funcionalidades principais:
 * - Copia texto para área de transferência
 * - Tooltip informativo
 * - Notificação de sucesso
 * - Tratamento de erros
 * - Interface consistente
 */

'use client'

// Importa componente Tooltip do Flowbite
import { Tooltip } from "flowbite-react"
// Importa ícone de copiar
import { MdOutlineContentCopy } from "react-icons/md"
// Importa hook de notificações
import { useNotifications } from "../../../hooks/useNotifications"

// Componente principal do botão de copiar
export default function CopyButton({toCopy, successMessage}) {
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications();

    // Função que executa a cópia do texto
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(toCopy); // Copia texto para área de transferência
            notify.copiedToClipboard(); // Notifica sucesso
        } catch (error) {
            notify.error("Erro ao copiar para a área de transferência"); // Notifica erro
        }
    };

    return (
        <>
            {/* Tooltip com botão de copiar */}
            <Tooltip content="Copiar" placement="left" className="bg-gray-600" arrow={false}>
                <button 
                    className="duration-200 text-lightcyan bg-cornflowerblue hover:bg-neonblue rounded p-1.5 border border-neonblue ml-2" 
                    onClick={handleCopy}
                >
                    <MdOutlineContentCopy className="w-6 h-6"/>
                </button>
            </Tooltip>
        </>
    )
}