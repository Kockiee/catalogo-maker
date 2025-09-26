'use client'
// Importação de componentes do Flowbite React
import { Button, Label, Radio } from "flowbite-react";
// Importação do hook useState do React
import { useState } from "react";
// Importação do contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importação do componente de scan de QR code
import ScanQrCode from "./ScanQrCode";
// Importação do contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importação do hook personalizado para notificações
import { useNotifications } from "@/app/hooks/useNotifications";
// Importação do hook personalizado para gerenciar sessão WhatsApp
import { useWhatsappSessionManager } from "@/app/hooks/useWhatsappSessionManager";

/**
 * Componente para verificação de telefone e configuração de recebimento de pedidos
 * Permite conectar catálogo ao WhatsApp para receber pedidos automaticamente
 * @param {string} catalogId - ID único do catálogo a ser configurado
 * @returns {JSX.Element} Interface de verificação de telefone e conexão WhatsApp
 */
export default function PhoneVerification({catalogId}) {
    // Estado para controlar qual opção de recebimento de pedidos está selecionada
    const [orderForm, setOrderForm] = useState(1);
    // Desestruturação da função de notificação
    const { notify } = useNotifications()
    // Desestruturação dos dados do usuário
    const { user } = useAuth()
    // Desestruturação da função para atualizar catálogos
    const { updateCatalogs } = useTool()
    // Desestruturação das funções do gerenciador de sessão WhatsApp
    const { connectWhatsappSession, isProcessing } = useWhatsappSessionManager()

    /**
     * Função assíncrona para conectar o catálogo ao WhatsApp
     * Utiliza sessão padrão do WhatsApp configurada nas variáveis de ambiente
     */
    const handleSetCatalogWhatsapp = async() => {
        // Obtém credenciais padrão da sessão WhatsApp das variáveis de ambiente
        const defaultSession = process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION
        const defaultSessionToken = process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION_TOKEN

        // Chama o gerenciador de sessão WhatsApp com callbacks de sucesso/erro
        await connectWhatsappSession(
            defaultSession,      // ID da sessão padrão
            defaultSessionToken, // Token da sessão padrão
            catalogId,           // ID do catálogo a ser conectado
            (message) => {       // Callback de sucesso
                notify.success(message)  // Exibe notificação de sucesso
                updateCatalogs()         // Atualiza lista de catálogos
            },
            (message) => {       // Callback de erro
                notify.error(message)    // Exibe notificação de erro
            }
        )
    }

    return (
        <div className="bg-white !border-4 !border-lightcyan p-4 rounded flex flex-wrap">
            <div className="w-full space-y-2">
                <h1 className="text-lg font-bold mb-2">Opa, falta só mais uma informação!</h1>
                <Label
                className="text-lg"
                htmlFor="ordering-form"
                value="Como deseja receber pedidos neste catálogo?"
                />
                <fieldset className="flex flex-col gap-4">
                    <div className="inline-flex items-center space-x-2">
                        <Radio 
                        defaultChecked={orderForm === 1}
                        className="text-neonblue max-sm:w-8 max-sm:h-8 focus:ring-cornflowerblue" 
                        id="receive-cm-notification" 
                        name="forms" 
                        value={1} 
                        onClick={(e) => {if (e.target.checked) setOrderForm(1)}} 
                        /> 
                        <Label htmlFor="receive-cm-notification" value="Receber notificação da Catálogo Maker no WhatsApp"/>
                    </div>
                    <div className="inline-flex items-center space-x-2">
                        <Radio 
                        defaultChecked={orderForm === 2}
                        className="text-neonblue max-sm:w-8 max-sm:h-8 focus:ring-cornflowerblue" 
                        id="use-own-whatsapp" 
                        name="forms" 
                        value={2} 
                        onClick={(e) => {if (e.target.checked) setOrderForm(2)}} 
                        /> 
                        <Label htmlFor="use-own-whatsapp" value="Usar meu próprio WhatsApp" />
                    </div>
                </fieldset>
                {orderForm === 2 && (
                    <ScanQrCode catalogId={catalogId} userId={user.uid} />
                )}
                <Button 
                    onClick={handleSetCatalogWhatsapp} 
                    disabled={orderForm === 2 || isProcessing} 
                    size="md" 
                    className="duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full"
                >
                    {isProcessing ? "Conectando..." : "Continuar"}
                </Button>
            </div>
        </div>
    )
}