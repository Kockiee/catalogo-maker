'use client'
import { useTool } from "../../../contexts/ToolContext"
import { Button } from "flowbite-react"
import { useEffect, useState } from "react";
import { updateCatalog } from "../../../actions/updateCatalog";
import { useFormState } from 'react-dom'
import { useNotifications } from "../../../hooks/useNotifications";
import ErrorCard from "../../../auth/components/ErrorCard";
import FormField from "../../../components/FormField";
import ImageUpload from "../../../components/ImageUpload";
import ColorPickerGroup from "../../../components/ColorPickerGroup";
import CatalogPreview from "../../../components/CatalogPreview";

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
    const { notify } = useNotifications();

    const handleColorChange = (colorKey, value) => {
        setColors(prev => ({ ...prev, [colorKey]: value }));
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
    )
}