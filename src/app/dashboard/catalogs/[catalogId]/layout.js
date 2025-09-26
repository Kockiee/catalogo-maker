'use client'
// Importação do contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext"
// Importação de funções do Next.js para tratamento de rotas
import { notFound, useRouter } from 'next/navigation'
// Importação de hooks do React
import { useEffect, useState } from 'react'
// Importação do componente de verificação de telefone
import PhoneVerification from "@/app/dashboard/catalogs/components/PhoneVerification";
// Importação de ações do servidor para WhatsApp
import { getCatalogWhatsappStatus } from "@/app/actions/getCatalogWhatsappStatus";
import { disconnectCatalogWhatsapp } from "@/app/actions/disconnectCatalogWhatsapp";
// Importação de componentes do Flowbite React
import { Button, Modal } from "flowbite-react";

/**
 * Layout para páginas de catálogo específico
 * Gerencia validação de sessão WhatsApp, redirecionamentos e verificação de telefone
 * @param {React.ReactNode} children - Componentes filhos da página específica
 * @param {Object} params - Parâmetros da URL incluindo catalogId
 * @returns {JSX.Element} Layout do catálogo ou tela de carregamento/verificação
 */
export default function LAYOUT({ children, params }) {
    // Extrai o ID do catálogo dos parâmetros da URL
    const catalogId = params.catalogId
    // Desestruturação dos dados do contexto de ferramentas
    const { catalogs } = useTool()
    // Hook para navegação programática
    const router = useRouter()
    // Estados para controlar modais e validação
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    /**
     * Efeito para redirecionamento automático se os catálogos demorarem para carregar
     * Evita que o usuário fique preso em tela de loading indefinidamente
     */
    useEffect(() => {
        if (catalogs === null) {
            // Timer de 5 segundos para redirecionamento
            const timer = setTimeout(() => {
                router.push('/dashboard');  // Redireciona para dashboard principal
            }, 5000);

            // Cleanup: limpa o timer se o componente for desmontado
            return () => clearTimeout(timer);
        }
    }, [catalogs, router]);

    // Encontra o catálogo específico na lista de catálogos
    const catalog = catalogs && catalogs.find(catalog => catalog.id === catalogId);

    /**
     * Renderização condicional baseada no estado de carregamento dos catálogos
     */
    if (catalogs === null) {
        // Mostra tela de loading enquanto catálogos estão sendo carregados
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonblue mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando catálogo...</p>
                </div>
            </div>
        );
    }

    /**
     * Verificação de existência do catálogo
     * Se o catálogo não foi encontrado, dispara erro 404
     */
    if (!catalog) {
        notFound();  // Função do Next.js que retorna página 404
    }

    /**
     * Função assíncrona para validar a sessão do WhatsApp do catálogo
     * Verifica se a conexão ainda está ativa e trata desconexões
     * @returns {Promise<boolean>} True se sessão válida, false se inválida
     */
    const validateSession = async () => {
        // Se não há sessão WhatsApp, considera válido (não precisa de validação)
        if (!catalog.whatsapp_session) return true;

        setIsValidating(true);  // Ativa estado de validação
        try {
            // Verifica o status da sessão WhatsApp
            const response = await getCatalogWhatsappStatus(catalog.whatsapp_session, catalog.whatsapp_session_token);

            if (response.status === 'CONNECTED') {
                // Sessão ainda está ativa
                setIsValidating(false);
                return true;
            } else {
                // Sessão expirada, desconecta e mostra modal de reconexão
                await disconnectCatalogWhatsapp(catalogId, catalog.whatsapp_session, catalog.whatsapp_session_token);
                setShowDisconnectModal(true);
                setIsValidating(false);
                return false;
            }
        } catch (error) {
            // Trata erros na validação da sessão
            console.error('Erro ao validar sessão WhatsApp:', error);
            setIsValidating(false);
            return false;
        }
    }

    /**
     * Efeito para validar sessão WhatsApp quando o catálogo é carregado
     * Só executa se o catálogo tem uma sessão WhatsApp configurada
     */
    useEffect(() => {
        if (catalog.whatsapp_session) {
            validateSession();  // Inicia validação da sessão
        }
    }, [catalogId]);  // Dependência: executa novamente se catalogId mudar

    /**
     * Função para lidar com a confirmação de desconexão
     * Fecha o modal e permite reconexão via PhoneVerification
     */
    const handleDisconnectConfirm = () => {
        setShowDisconnectModal(false);
        // O componente PhoneVerification será mostrado automaticamente
        // quando catalog.whatsapp_session for null após o disconnect
    };


    /**
     * Renderização principal do layout baseada no estado da sessão WhatsApp
     */
    return (
        <div>
            {/* Estado de validação: mostra loading enquanto verifica conexão */}
            {isValidating ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonblue mx-auto mb-4"></div>
                        <p className="text-gray-600">Validando conexão WhatsApp...</p>
                    </div>
                </div>
            ) : catalog.whatsapp_session ? (
                /* Sessão WhatsApp ativa: renderiza conteúdo da página */
                children
            ) : (
                /* Sessão WhatsApp inativa: mostra verificação de telefone */
                <PhoneVerification catalogId={catalogId}/>
            )}

            {/* Modal de aviso de desconexão - só aparece quando necessário */}
            <Modal show={showDisconnectModal} onClose={() => {}} size="md">
                <Modal.Header>
                    <h3 className="text-lg font-semibold text-gray-900">Conexão WhatsApp Expirada</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        {/* Mensagens explicativas sobre a desconexão */}
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
                    {/* Botão para confirmar e iniciar reconexão */}
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