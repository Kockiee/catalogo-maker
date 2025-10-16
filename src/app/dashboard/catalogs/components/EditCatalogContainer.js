/**
 * Container para edição de catálogos
 * 
 * Este arquivo contém o componente principal para editar
 * um catálogo existente. Permite modificar todas as informações
 * do catálogo incluindo nome, descrição, banner, cores e
 * gerenciar a conexão WhatsApp.
 * 
 * Funcionalidades principais:
 * - Edição de informações do catálogo
 * - Upload de novo banner
 * - Seleção de cores personalizadas
 * - Gerenciamento de conexão WhatsApp
 * - Modal de confirmação para desconectar WhatsApp
 * - Pré-visualização em tempo real
 */

'use client'
// Importa contexto de ferramentas
import { useTool } from "../../../contexts/ToolContext"
// Importa componentes do Flowbite
import { Button, Tooltip } from "flowbite-react"
// Importa hooks do React para estado e efeitos
import { useEffect, useState } from "react";
// Importa ação para atualizar catálogo
import { updateCatalog } from "../../../actions/updateCatalog";
// Importa ação para desconectar WhatsApp
import { disconnectCatalogWhatsapp } from "../../../actions/disconnectCatalogWhatsapp";
// Importa hook useFormState do React DOM
import { useFormState } from 'react-dom'
// Importa hook de notificações
import { useNotifications } from "../../../hooks/useNotifications";
// Importa componente de card de erro
import ErrorCard from "../../../auth/components/ErrorCard";
// Importa componente de campo de formulário
import FormField from "../../../components/FormField";
// Importa componente de upload de imagem
import ImageUpload from "../../../components/ImageUpload";
// Importa componente de seleção de cores
import ColorPickerGroup from "../../../components/ColorPickerGroup";
// Importa componente de pré-visualização do catálogo
import CatalogPreview from "../../../components/CatalogPreview";
// Importa ícones do Heroicons
import { HiExclamationCircle, HiLogout } from "react-icons/hi";
// Importa ícone do WhatsApp
import { FaWhatsapp } from "react-icons/fa";

// Componente principal para edição de catálogos
export default function EditCatalogContainer({catalogId}) {
    // Extrai catálogos e função de atualização do contexto de ferramentas
    const { catalogs, updateCatalogs } = useTool();
    // Encontra o catálogo específico
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    // Estado para o nome de identificação do catálogo
    const [identificationName, setIdentificationName] = useState(catalog.name);
    // Estado para o nome da loja
    const [storeName, setStoreName] = useState(catalog.store_name);
    // Estado para a descrição da loja
    const [storeDescription, setStoreDescription] = useState(catalog.store_description);
    // Estado para as cores do catálogo
    const [colors, setColors] = useState({
        primaryColor: catalog.primary_color,
        secondaryColor: catalog.secondary_color,
        tertiaryColor: catalog.tertiary_color,
        textColor: catalog.text_color
    });
    // Estado para a imagem do banner
    const [bannerImage, setBannerImage] = useState(catalog.banner_url);
    // Estado de loading durante atualização
    const [loading, setLoading] = useState(false);
    // Estado para mensagens de erro
    const [error, setError] = useState("");
    // Estado que indica se está desconectando WhatsApp
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    // Estado que controla se o modal de desconexão está visível
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications();

    // Função que atualiza uma cor específica
    const handleColorChange = (colorKey, value) => {
        setColors(prev => ({ ...prev, [colorKey]: value })); // Atualiza a cor específica
    };

    // Função que desconecta a sessão WhatsApp do catálogo
    const handleDisconnectWhatsapp = async () => {
        if (!catalog.whatsapp_session) return; // Se não tem sessão, não faz nada
        
        setIsDisconnecting(true); // Marca como desconectando
        setShowDisconnectModal(false); // Fecha modal
        notify.processing("Desconectando sessão do WhatsApp..."); // Mostra notificação
        
        try {
            // Chama ação para desconectar WhatsApp
            const result = await disconnectCatalogWhatsapp(catalogId, catalog.whatsapp_session, catalog.whatsapp_session_token);
            
            if (result.success) {
                notify.success(result.message); // Notifica sucesso
                // Atualizar a lista de catálogos para refletir a mudança
                await updateCatalogs();
            } else {
                notify.error(result.message); // Notifica erro
            }
        } catch (error) {
            console.error("Erro ao desconectar WhatsApp:", error); // Registra erro
            notify.error("Erro ao desconectar sessão do WhatsApp"); // Notifica erro
        } finally {
            setIsDisconnecting(false); // Para desconexão
        }
    };

    // Função que abre o modal de desconexão
    const openDisconnectModal = () => {
        setShowDisconnectModal(true); // Mostra modal
    };

    // Hook para gerenciar o estado do formulário e ações
    const [formState, formAction] = useFormState(async(state, formdata) => {
        setLoading(true); // Marca como carregando
        notify.processing("Atualizando catálogo..."); // Mostra notificação de processamento
        return updateCatalog(state, formdata, catalog.id); // Chama ação de atualização
    }, {message: ''});

    // Efeito que processa o resultado da atualização do catálogo
    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false); // Para loading
            if (formState.message === 'catalog-updated') {
                notify.catalogUpdated(); // Notifica sucesso
                updateCatalogs(); // Atualiza lista de catálogos
            } else if (formState.message === 'invalid-params') {
                setError("Informações de catálogo inválidas."); // Erro de parâmetros inválidos
            }
        }
    }, [formState]); // Executa quando formState muda

    return (
        <>
        <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
            {/* Grid responsivo com formulário e pré-visualização */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
                {/* Coluna do formulário que contém as informações atuais do catálogo, mas que podem ser aqui modificadas */}
                <div className="flex flex-col">
                    <form 
                        onSubmit={() => {
                            notify.processing("Atualizando catálogo...");
                            setLoading(true)
                        }}
                        action={(formdata) => formAction(formdata)}
                        className="space-y-6"
                    >
                        <FormField
                            label="Nome de identificação"
                            name="identificationName"
                            id="identification-name"
                            value={identificationName}
                            onChange={(e) => {
                                setError("")
                                setIdentificationName(e.target.value)
                            }}
                            placeholder="catalogo01"
                            disabled={loading}
                            required
                        />
                        <FormField
                            label="Nome da loja"
                            name="storeName"
                            id="store-name"
                            value={storeName}
                            onChange={(e) => {
                                setError("")
                                setStoreName(e.target.value);
                            }}
                            placeholder="Mister Store"
                            maxLength={40}
                            disabled={loading}
                            required
                        />
                        <FormField
                            type="textarea"
                            label="Descrição da loja"
                            name="storeDescription"
                            id="store-description"
                            value={storeDescription}
                            onChange={(e) => {
                                setError("")
                                setStoreDescription(e.target.value);
                            }}
                            placeholder="Uma loja de roupas, calçados e acessórios..."
                            rows={4}
                            maxLength={2000}
                            disabled={loading}
                            required
                        />
                        <ImageUpload
                            label="Banner"
                            name="bannerImage"
                            id="store-banner"
                            onChange={e => {
                                setError("")
                                const file = e.target.files[0]
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setBannerImage(reader.result);
                                };
                                if (file) { 
                                    reader.readAsDataURL(file);
                                }
                            }}
                            disabled={loading}
                            helperText="Selecione um novo banner para o catálogo"
                        />
                        <ColorPickerGroup
                            colors={colors}
                            onColorChange={handleColorChange}
                            disabled={loading}
                        />
                        {/* Botão para trocar WhatsApp */}
                        <div className="py-2 w-full">
                            <Tooltip content="Trocar WhatsApp do catálogo" placement="top" arrow={false} trigger="hover">
                                <Button
                                    color="success"
                                    size="lg"
                                    disabled={isDisconnecting || loading}
                                    onClick={openDisconnectModal}
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <FaWhatsapp className="w-5 h-5 mr-1" />
                                    Trocar WhatsApp do catálogo
                                </Button>
                            </Tooltip>
                        </div>
                        <div className="py-2 w-full">
                            <ErrorCard error={error}/>
                            <Button 
                                aria-disabled={loading} 
                                type="submit" 
                                className="shadow-md hover:shadow-md hover:shadow-cornflowerblue/50 bg-neonblue duration-200 hover:!bg-cornflowerblue focus:ring-jordyblue w-full" 
                                size="lg"
                            >
                                {loading ? "Salvando..." : "Salvar alterações"}
                            </Button>
                        </div>
                    </form>
                </div>
                {/* Coluna da pré-visualização */}
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 text-primary-800">Pré-visualização</h2>
                    {/* Container sticky para pré-visualização */}
                    <div className="sticky top-4">
                        <CatalogPreview
                            storeName={storeName}
                            storeDescription={storeDescription}
                            primaryColor={colors.primaryColor}
                            secondaryColor={colors.secondaryColor}
                            tertiaryColor={colors.tertiaryColor}
                            textColor={colors.textColor}
                            bannerImage={bannerImage}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Modal de confirmação para desconectar WhatsApp */}
        {showDisconnectModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div className="mt-3">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4">
                            <HiExclamationCircle className="w-6 h-6 text-yellow-500" />
                            <h3 className="text-lg font-medium text-gray-900">Alterar configuração do WhatsApp</h3>
                        </div>
                        
                        {/* Body */}
                        <div className="space-y-4">
                            <p className="text-gray-700">
                                Você está prestes a desconectar a sessão atual do WhatsApp deste catálogo.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="font-semibold text-yellow-800 mb-2">O que acontecerá:</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li>• A sessão atual do WhatsApp será desconectada</li>
                                    <li>• Você precisará configurar uma nova sessão</li>
                                    <li>• O catálogo ficará temporariamente indisponível para pedidos</li>
                                    <li>• Você poderá usar o mesmo ou um novo número do WhatsApp</li>
                                </ul>
                            </div>
                            <p className="text-gray-600 text-sm">
                                <strong>Tem certeza que deseja continuar?</strong>
                            </p>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex gap-3 mt-6">
                            <Button
                                color="gray"
                                onClick={() => setShowDisconnectModal(false)}
                                disabled={isDisconnecting}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                color="warning"
                                onClick={handleDisconnectWhatsapp}
                                disabled={isDisconnecting}
                                className="flex-1 flex items-center justify-center gap-2"
                            >
                                {isDisconnecting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Desconectando...
                                    </>
                                ) : (
                                    <>
                                        <HiLogout className="w-4 h-4" />
                                        Sim, alterar configuração
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}