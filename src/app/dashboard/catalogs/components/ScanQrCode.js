'use client'
// Importação do hook useEffect do React
import { useEffect } from "react";
// Importação do componente de QR code
import QRCodeComponent from "@/app/components/QrCodeComponent";
// Importação de componentes do Flowbite React
import { Spinner } from "flowbite-react";
// Importação de ícones
import { CiMenuKebab } from "react-icons/ci";
// Importação do contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importação do hook personalizado para gerenciar sessão QR
import { useQrSessionManager } from "@/app/hooks/useQrSessionManager";
// Importação do hook personalizado para notificações
import { useNotifications } from "@/app/hooks/useNotifications";

/**
 * Componente para escanear QR code e conectar catálogo ao WhatsApp
 * Gerencia o processo de autenticação via QR code para conexão WhatsApp
 * @param {string} catalogId - ID único do catálogo
 * @param {string} userId - ID único do usuário
 * @returns {JSX.Element} Interface para scan de QR code ou null se já conectado
 */
export default function ScanQrCode({ catalogId, userId }) {
    // Desestruturação dos dados e funções do contexto de ferramentas
    const { updateCatalogs, catalogs } = useTool();
    // Desestruturação da função de notificação
    const { notify } = useNotifications();
    // Desestruturação das funções e estados do gerenciador de sessão QR
    const {
        qrCode,           // QR code para autenticação
        isLoading,        // Estado de carregamento
        isConnected,      // Estado de conexão
        error,            // Mensagens de erro
        startSession,     // Função para iniciar sessão
        stopSession       // Função para parar sessão
    } = useQrSessionManager(catalogId, userId);

    // Encontra o catálogo específico na lista de catálogos
    const catalog = catalogs.find(catalog => catalog.id === catalogId);

    /**
     * Efeito para gerenciar o ciclo de vida da sessão QR
     * Inicia sessão se não houver WhatsApp conectado, para se já houver
     */
    useEffect(() => {
        // Só inicia a sessão se o catálogo não tiver whatsapp_session
        if (!catalog?.whatsapp_session) {
            startSession();  // Inicia processo de geração de QR code
        } else {
            // Se já tem sessão, para qualquer polling ativo
            stopSession();  // Para validação de conexão
        }
    }, [startSession, stopSession, catalog?.whatsapp_session]);

    /**
     * Efeito para lidar com conexão bem-sucedida
     * Exibe notificação e atualiza lista de catálogos
     */
    useEffect(() => {
        if (isConnected) {
            notify.success("WhatsApp conectado com sucesso!");  // Notificação de sucesso
            updateCatalogs();  // Atualiza dados dos catálogos
        }
    }, [isConnected, notify, updateCatalogs]);  // Dependências: executa quando conexão muda

    /**
     * Efeito para lidar com erros na conexão
     * Exibe notificação de erro ao usuário
     */
    useEffect(() => {
        if (error) {
            notify.error(error);  // Exibe erro para o usuário
        }
    }, [error, notify]);  // Dependências: executa quando erro muda

    // Se o catálogo já tem whatsapp_session, não renderiza o QR
    if (catalog?.whatsapp_session) {
        return null;
    }

    if (isConnected) {
        return (
            <div className="flex flex-wrap">
                <div className="flex justify-center items-center w-[225px] h-[225px] bg-green-100 rounded-lg">
                    <div className="text-center">
                        <div className="text-green-600 text-4xl mb-2">✓</div>
                        <p className="text-green-600 font-semibold">Conectado!</p>
                    </div>
                </div>
                <div className="p-4 pl-6 text-sm">
                    <p className="text-green-600 font-semibold">WhatsApp conectado com sucesso!</p>
                    <p className="text-gray-600">Agora você pode receber pedidos diretamente no seu WhatsApp.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap">
            {qrCode ? (
                <QRCodeComponent data={qrCode} />
            ) : (
                <div className="flex justify-center items-center w-[225px] h-[225px]">
                    <Spinner className="text-lightcyan" size={'xl'} />
                </div>
            )}
            <div className="p-4 pl-6 text-sm">
                <ul className="list-decimal">
                    <li>Abra a página deste catálogo no computador</li>
                    <li>Abra seu WhatsApp no celular</li>
                    <li>Toque em <CiMenuKebab className="inline-flex" /> no campo superior direito</li>
                    <li>Toque em "Dispositivos conectados"</li>
                    <li>Toque em "Conectar dispositivo"</li>
                    <li>Escaneie o código</li>
                </ul>
                {error && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}