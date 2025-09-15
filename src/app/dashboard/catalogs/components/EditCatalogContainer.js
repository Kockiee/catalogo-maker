'use client'
import { useTool } from "../../../contexts/ToolContext"
import { Button, Tooltip } from "flowbite-react"
import { useEffect, useState } from "react";
import { updateCatalog } from "../../../actions/updateCatalog";
import { disconnectCatalogWhatsapp } from "../../../actions/disconnectCatalogWhatsapp";
import { useFormState } from 'react-dom'
import { useNotifications } from "../../../hooks/useNotifications";
import ErrorCard from "../../../auth/components/ErrorCard";
import FormField from "../../../components/FormField";
import ImageUpload from "../../../components/ImageUpload";
import ColorPickerGroup from "../../../components/ColorPickerGroup";
import CatalogPreview from "../../../components/CatalogPreview";
import { HiExclamationCircle, HiLogout } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

export default function EditCatalogContainer({catalogId}) {
    const { catalogs, updateCatalogs } = useTool();
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    const [identificationName, setIdentificationName] = useState(catalog.name);
    const [storeName, setStoreName] = useState(catalog.store_name);
    const [storeDescription, setStoreDescription] = useState(catalog.store_description);
    const [colors, setColors] = useState({
        primaryColor: catalog.primary_color,
        secondaryColor: catalog.secondary_color,
        tertiaryColor: catalog.tertiary_color,
        textColor: catalog.text_color
    });
    const [bannerImage, setBannerImage] = useState(catalog.banner_url);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [showDisconnectModal, setShowDisconnectModal] = useState(false);
    const { notify } = useNotifications();

    const handleColorChange = (colorKey, value) => {
        setColors(prev => ({ ...prev, [colorKey]: value }));
    };

    const handleDisconnectWhatsapp = async () => {
        if (!catalog.whatsapp_session) return;
        
        setIsDisconnecting(true);
        setShowDisconnectModal(false);
        notify.processing("Desconectando sessão do WhatsApp...");
        
        try {
            const result = await disconnectCatalogWhatsapp(catalogId, catalog.whatsapp_session, catalog.whatsapp_session_token);
            
            if (result.success) {
                notify.success(result.message);
                // Atualizar a lista de catálogos para refletir a mudança
                await updateCatalogs();
            } else {
                notify.error(result.message);
            }
        } catch (error) {
            console.error("Erro ao desconectar WhatsApp:", error);
            notify.error("Erro ao desconectar sessão do WhatsApp");
        } finally {
            setIsDisconnecting(false);
        }
    };

    const openDisconnectModal = () => {
        setShowDisconnectModal(true);
    };

    const [formState, formAction] = useFormState(async(state, formdata) => {
        setLoading(true);
        notify.processing("Atualizando catálogo...");
        return updateCatalog(state, formdata, catalog.id);
    }, {message: ''});

    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false);
            if (formState.message === 'catalog-updated') {
                notify.catalogUpdated();
                updateCatalogs();
            } else if (formState.message === 'invalid-params') {
                setError("Informações de catálogo inválidas.");
            }
        }
    }, [formState]);

    return (
        <>
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap">
            <div className="flex flex-col w-1/2 max-xl:w-full">
                <form 
                onSubmit={() => {
                    notify.processing("Atualizando catálogo...");
                    setLoading(true)
                }}
                action={(formdata) => formAction(formdata)}>
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
                </form>
            </div>
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