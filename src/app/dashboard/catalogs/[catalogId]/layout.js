/**
 * Layout para páginas de catálogo específico
 * 
 * Este arquivo contém o layout que envolve todas as páginas de um
 * catálogo específico. Gerencia a validação da sessão WhatsApp,
 * redirecionamentos e exibe o componente de verificação de telefone
 * quando necessário.
 * 
 * Funcionalidades principais:
 * - Validação de sessão WhatsApp do catálogo
 * - Redirecionamento automático se catálogo não existir
 * - Gerenciamento de conexão WhatsApp
 * - Modal de reconexão quando sessão expira
 * - Loading states durante validação
 */

'use client'
// Importa contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext"
// Importa funções de navegação do Next.js
import { notFound, useRouter } from 'next/navigation'
// Importa hooks do React para estado e efeitos
import { useEffect, useState } from 'react'
// Importa componente de verificação de telefone
import PhoneVerification from "@/app/dashboard/catalogs/components/PhoneVerification";
// Importa ação para obter status do WhatsApp
import { getCatalogWhatsappStatus } from "@/app/actions/getCatalogWhatsappStatus";
// Importa ação para desconectar WhatsApp
import { disconnectCatalogWhatsapp } from "@/app/actions/disconnectCatalogWhatsapp";
// Importa componentes do Flowbite
import { Button, Modal } from "flowbite-react";

// Componente principal do layout de catálogo
export default function LAYOUT({ children, params }) {
    // Extrai o ID do catálogo dos parâmetros da URL
    const catalogId = params.catalogId
    // Extrai catálogos do contexto de ferramentas
    const { catalogs } = useTool()
    // Hook para navegação programática
    const router = useRouter()
    // Estado que controla se o modal de desconexão está visível
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    // Estado que indica se está validando a sessão WhatsApp
    const [isValidating, setIsValidating] = useState(false);

    // Timer para redirecionamento se catalogs permanecer null por mais de 5s
    useEffect(() => {
        if (catalogs === null) {
            const timer = setTimeout(() => {
                router.push('/dashboard'); // Redireciona para dashboard após timeout
            }, 5000); // 5 segundos

            return () => clearTimeout(timer); // Limpa timer na desmontagem
        }
    }, [catalogs, router]); // Executa quando catalogs ou router mudam
    
    // Encontra o catálogo específico
    const catalog = catalogs && catalogs.find(catalog => catalog.id === catalogId);

    // Se catalogs ainda está carregando (null), mostra loading
    if (catalogs === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonblue mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando catálogo...</p>
                </div>
            </div>
        );
    }

    // Se catalogs foi carregado mas o catálogo específico não existe
    if (!catalog) {
        notFound(); // Exibe página 404
    }

    // Função que valida a sessão WhatsApp do catálogo
    const validateSession = async () => {
        if (!catalog.whatsapp_session) return true; // Se não tem sessão, não precisa validar
        
        setIsValidating(true); // Marca como validando
        try {
            // Consulta o status da sessão WhatsApp
            const response = await getCatalogWhatsappStatus(catalog.whatsapp_session, catalog.whatsapp_session_token);

            if (response.status === 'CONNECTED') {
                setIsValidating(false); // Para validação
                return true; // Sessão válida
            } else {
                // Sessão inválida, desconecta e mostra modal
                await disconnectCatalogWhatsapp(catalogId, catalog.whatsapp_session, catalog.whatsapp_session_token);
                setShowDisconnectModal(true); // Mostra modal de reconexão
                setIsValidating(false); // Para validação
                return false; // Sessão inválida
            }
        } catch (error) {
            // Se houver erro na validação, registra e retorna false
            console.error('Erro ao validar sessão WhatsApp:', error);
            setIsValidating(false); // Para validação
            return false; // Sessão inválida
        }
    }

    // Efeito que valida a sessão quando o catálogo tem sessão WhatsApp
    useEffect(() => {
        if (catalog.whatsapp_session) {
            validateSession(); // Valida sessão se existir
        }
    }, [catalogId]); // Executa quando catalogId muda

    // Função que confirma a desconexão e fecha o modal
    const handleDisconnectConfirm = () => {
        setShowDisconnectModal(false); // Fecha modal
        // O componente PhoneVerification será mostrado automaticamente
        // quando catalog.whatsapp_session for null após o disconnect
    };


    return (
        <div>
            {/* Se está validando, mostra loading */}
            {isValidating ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonblue mx-auto mb-4"></div>
                        <p className="text-gray-600">Validando conexão WhatsApp...</p>
                    </div>
                </div>
            ) : catalog.whatsapp_session ? (
                /* Se tem sessão WhatsApp válida, renderiza as páginas filhas */
                children
            ) : (
                /* Se não tem sessão WhatsApp, mostra componente de verificação */
                <PhoneVerification catalogId={catalogId}/>
            )}

            {/* Modal de reconexão WhatsApp */}
            <Modal show={showDisconnectModal} onClose={() => {}} size="md">
                <Modal.Header>
                    <h3 className="text-lg font-semibold text-gray-900">Conexão WhatsApp Expirada</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Sua conexão com o WhatsApp expirou e precisa ser renovada.
                        </p>
                        <p className="text-gray-600">
                            <strong>Não se preocupe!</strong> Todas as informações do seu catálogo permanecerão as mesmas.
                        </p>
                        <p className="text-gray-600">
                            Você precisará apenas reconectar sua conta do WhatsApp para continuar recebendo pedidos.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        onClick={handleDisconnectConfirm}
                        className="w-full bg-neonblue hover:!bg-cornflowerblue focus:ring-jordyblue"
                    >
                        OK, Reconectar WhatsApp
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}