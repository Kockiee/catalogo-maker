'use client'
import { useTool } from "@/app/contexts/ToolContext"
import { notFound, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PhoneVerification from "@/app/dashboard/catalogs/components/PhoneVerification";
import { getCatalogWhatsappStatus } from "@/app/actions/getCatalogWhatsappStatus";
import { disconnectCatalogWhatsapp } from "@/app/actions/disconnectCatalogWhatsapp";
import { Button, Modal } from "flowbite-react";

export default function LAYOUT({ children, params }) {
    const catalogId = params.catalogId
    const { catalogs } = useTool()
    const router = useRouter()
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    // Timer para redirecionamento se catalogs permanecer null por mais de 5s
    useEffect(() => {
        if (catalogs === null) {
            const timer = setTimeout(() => {
                router.push('/dashboard');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [catalogs, router]);
    
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
        notFound();
    }

    const validateSession = async () => {
        if (!catalog.whatsapp_session) return true;
        
        setIsValidating(true);
        try {
            const response = await getCatalogWhatsappStatus(catalog.whatsapp_session, catalog.whatsapp_session_token);

            if (response.status === 'CONNECTED') {
                setIsValidating(false);
                return true;
            } else {
                await disconnectCatalogWhatsapp(catalogId, catalog.whatsapp_session, catalog.whatsapp_session_token);
                setShowDisconnectModal(true);
                setIsValidating(false);
                return false;
            }
        } catch (error) {
            console.error('Erro ao validar sessão WhatsApp:', error);
            setIsValidating(false);
            return false;
        }
    }

    useEffect(() => {
        if (catalog.whatsapp_session) {
            validateSession();
        }
    }, [catalogId]);

    const handleDisconnectConfirm = () => {
        setShowDisconnectModal(false);
        // O componente PhoneVerification será mostrado automaticamente
        // quando catalog.whatsapp_session for null após o disconnect
    };


    return (
        <div>
            {isValidating ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonblue mx-auto mb-4"></div>
                        <p className="text-gray-600">Validando conexão WhatsApp...</p>
                    </div>
                </div>
            ) : catalog.whatsapp_session ? (
                children
            ) : (
                <PhoneVerification catalogId={catalogId}/>
            )}

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