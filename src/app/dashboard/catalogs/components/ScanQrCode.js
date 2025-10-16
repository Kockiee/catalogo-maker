/**
 * Componente de escaneamento de QR Code do WhatsApp
 * 
 * Este arquivo contém o componente que gerencia a conexão
 * do WhatsApp através de QR Code. Exibe o QR Code para
 * escaneamento, instruções para o usuário e gerencia
 * o estado da conexão.
 * 
 * Funcionalidades principais:
 * - Exibição de QR Code para escaneamento
 * - Instruções passo a passo para o usuário
 * - Gerenciamento de estado da sessão
 * - Notificações de sucesso e erro
 * - Interface responsiva
 */

'use client'
// Importa hook useEffect do React
import { useEffect } from "react";
// Importa componente de QR Code
import QRCodeComponent from "@/app/components/QrCodeComponent";
// Importa componente de loading
// Importa ícone de menu kebab
import { CiMenuKebab } from "react-icons/ci";
// Importa contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importa hook para gerenciar sessão de QR Code
import { useQrSessionManager } from "@/app/hooks/useQrSessionManager";
// Importa hook de notificações
import { useNotifications } from "@/app/hooks/useNotifications";
import { Spinner } from "flowbite-react";

// Componente principal de escaneamento de QR Code
export default function ScanQrCode({ catalogId, userId }) {
    // Extrai função de atualização e catálogos do contexto de ferramentas
    const { updateCatalogs, catalogs } = useTool();
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications();
    // Extrai funcionalidades do hook de gerenciamento de sessão QR
    const { 
        qrCode, // QR Code atual
        isLoading, // Estado de carregamento
        isConnected, // Estado de conexão
        error, // Mensagem de erro
        startSession, // Função para iniciar sessão
        stopSession // Função para parar sessão
    } = useQrSessionManager(catalogId, userId);

    // Encontra o catálogo específico
    const catalog = catalogs.find(catalog => catalog.id === catalogId);

    // Efeito que gerencia o início/parada da sessão baseado no estado do catálogo
    useEffect(() => {
        // Só inicia a sessão se o catálogo não tiver whatsapp_session
        if (!catalog?.whatsapp_session) {
            startSession(); // Inicia nova sessão
        } else {
            // Se já tem sessão, para qualquer polling ativo
            stopSession(); // Para sessão ativa
        }
    }, [startSession, stopSession, catalog?.whatsapp_session]); // Executa quando essas dependências mudam

    // Efeito que notifica sucesso quando conectado
    useEffect(() => {
        if (isConnected) {
            notify.success("WhatsApp conectado com sucesso!"); // Notifica sucesso
            updateCatalogs(); // Atualiza lista de catálogos
        }
    }, [isConnected, notify, updateCatalogs]); // Executa quando isConnected muda

    // Efeito que notifica erros
    useEffect(() => {
        if (error) {
            notify.error(error); // Notifica erro
        }
    }, [error, notify]); // Executa quando error muda

    // Se o catálogo já tem whatsapp_session, não renderiza o QR
    if (catalog?.whatsapp_session) {
        return null; // Não renderiza nada se já conectado
    }

    // Se conectado, mostra mensagem de sucesso
    if (isConnected) {
        return (
            <div className="flex flex-wrap">
                {/* Card de sucesso com ícone de check */}
                <div className="flex justify-center items-center w-[225px] h-[225px] bg-green-100 rounded-lg">
                    <div className="text-center">
                        <div className="text-green-600 text-4xl mb-2">✓</div>
                        <p className="text-green-600 font-semibold">Conectado!</p>
                    </div>
                </div>
                {/* Texto explicativo */}
                <div className="p-4 pl-6 text-sm">
                    <p className="text-green-600 font-semibold">WhatsApp conectado com sucesso!</p>
                    <p className="text-gray-600">Agora você pode receber pedidos diretamente no seu WhatsApp.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap">
            {/* Se há QR Code, exibe o componente */}
            {qrCode ? (
                <QRCodeComponent data={qrCode} />
            ) : (
                /* Se não há QR Code, mostra loading */
                <div className="flex justify-center items-center w-[225px] h-[225px]">
                    <Spinner color="info" size="lg" showMessage={false} />
                </div>
            )}
            {/* Instruções para o usuário */}
            <div className="p-4 pl-6 text-sm">
                <ul className="list-decimal">
                    <li>Abra a página deste catálogo no computador</li>
                    <li>Abra seu WhatsApp no celular</li>
                    <li>Toque em <CiMenuKebab className="inline-flex" /> no campo superior direito</li>
                    <li>Toque em "Dispositivos conectados"</li>
                    <li>Toque em "Conectar dispositivo"</li>
                    <li>Escaneie o código</li>
                </ul>
                {/* Exibe erro se houver */}
                {error && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}