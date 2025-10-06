/**
 * Componente de verificação de telefone para WhatsApp
 * 
 * Este arquivo contém o componente que gerencia a configuração
 * do WhatsApp para um catálogo. Permite ao usuário escolher
 * entre usar notificações automáticas ou conectar seu próprio
 * WhatsApp através de QR Code.
 * 
 * Funcionalidades principais:
 * - Opção de notificações automáticas
 * - Opção de conectar WhatsApp próprio
 * - Gerenciamento de sessão WhatsApp
 * - Interface de seleção intuitiva
 * - Integração com hooks de sessão
 */

'use client'
// Importa componentes do Flowbite
import { Button, Label, Radio } from "flowbite-react";
// Importa hook useState do React
import { useState } from "react";
// Importa contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importa componente de escaneamento de QR Code
import ScanQrCode from "./ScanQrCode";
// Importa contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importa hook de notificações
import { useNotifications } from "@/app/hooks/useNotifications";
// Importa hook para gerenciar sessão WhatsApp
import { useWhatsappSessionManager } from "@/app/hooks/useWhatsappSessionManager";

// Componente principal de verificação de telefone
export default function PhoneVerification({catalogId}) {
    // Estado que controla qual opção de recebimento de pedidos está selecionada
    const [orderForm, setOrderForm] = useState(1);
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications()
    // Extrai dados do usuário do contexto de autenticação
    const { user } = useAuth()
    // Extrai função de atualização de catálogos do contexto de ferramentas
    const { updateCatalogs } = useTool()
    // Extrai funcionalidades do hook de gerenciamento de sessão WhatsApp
    const { connectWhatsappSession, isProcessing } = useWhatsappSessionManager()

    // Função que conecta o catálogo à sessão padrão do WhatsApp
    const handleSetCatalogWhatsapp = async() => {
        // Obtém sessão padrão das variáveis de ambiente
        const defaultSession = process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION
        const defaultSessionToken = process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION_TOKEN

        // Conecta a sessão padrão ao catálogo
        await connectWhatsappSession(
            defaultSession, 
            defaultSessionToken, 
            catalogId,
            (message) => {
                notify.success(message) // Notifica sucesso
                updateCatalogs() // Atualiza lista de catálogos
            },
            (message) => {
                notify.error(message) // Notifica erro
            }
        )
    }

    return (
        /* Container principal do componente */
        <div className="bg-white !border-4 !border-lightcyan p-4 rounded flex flex-wrap">
            <div className="w-full space-y-2">
                {/* Título do componente */}
                <h1 className="text-lg font-bold mb-2">Opa, falta só mais uma informação!</h1>
                {/* Label da pergunta principal */}
                <Label
                className="text-lg"
                htmlFor="ordering-form"
                value="Como deseja receber pedidos neste catálogo?"
                />
                {/* Campo de seleção com opções de rádio */}
                <fieldset className="flex flex-col gap-4">
                    {/* Opção 1: Notificações automáticas */}
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
                    {/* Opção 2: WhatsApp próprio */}
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
                {/* Se opção 2 selecionada, mostra componente de QR Code */}
                {orderForm === 2 && (
                    <ScanQrCode catalogId={catalogId} userId={user.uid} />
                )}
                {/* Botão de continuar */}
                <Button 
                    onClick={handleSetCatalogWhatsapp} 
                    disabled={orderForm === 2 || isProcessing} // Desabilita se opção 2 ou processando
                    size="md" 
                    className="duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full"
                >
                    {isProcessing ? "Conectando..." : "Continuar"}
                </Button>
            </div>
        </div>
    )
}