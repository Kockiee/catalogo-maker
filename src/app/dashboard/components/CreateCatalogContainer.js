'use client'
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { createCatalog } from "@/app/actions/createCatalog";
import { useAuth } from "@/app/contexts/AuthContext";
import { useFormState } from 'react-dom';
import { useTool } from "@/app/contexts/ToolContext";
import { useNotifications } from "@/app/hooks/useNotifications";
import { redirect } from "next/navigation";
import ErrorCard from "@/app/auth/components/ErrorCard";
import FormField from "@/app/components/FormField";
import ImageUpload from "@/app/components/ImageUpload";
import ColorPickerGroup from "@/app/components/ColorPickerGroup";
import CatalogPreview from "@/app/components/CatalogPreview";


export default function CreateCatalogContainer() {
    const [storeName, setStoreName] = useState("");
    const [storeDescription, setStoreDescription] = useState("");
    const [colors, setColors] = useState({
        primaryColor: "#bfd7ff",
        secondaryColor: "#5465ff",
        tertiaryColor: "#788bff",
        textColor: "#ffffff"
    });
    const [bannerImage, setBannerImage] = useState(null);
    const { user } = useAuth();
    const { updateCatalogs } = useTool();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { notify } = useNotifications();

    const handleColorChange = (colorKey, value) => {
        setColors(prev => ({ ...prev, [colorKey]: value }));
    };


    const [formState, formAction] = useFormState((state, formdata) => {
        if (bannerImage) {
            notify.processing("Criando catálogo...");
            return createCatalog(state, formdata, user.uid);
        } else {
            setError("Você precisa selecionar uma imagem para ser o banner do catálogo")
        }
    }, {message: ''});

    useEffect(() => {
        if (formState.message !== '') {
            if (formState.message === 'catalog-created') {
                notify.catalogCreated();
                updateCatalogs();
                redirect(`/dashboard/catalogs`);
            } else if (formState.message === 'catalog-already-exists') {
                setError("Você já tem um catálogo com essas informações.");
            } else if (formState.message === 'invalid-params') {
                setError("Informações de catálogo inválidas.");
            }
        }
    }, [formState]);

    return (
        <div>
            <h1 className="text-3xl font-black mb-2">Crie um catálogo agora.</h1>
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap">
                <div className="flex flex-col w-1/2 max-xl:w-full">
                    <form 
                    onSubmit={() => setLoading(true)}
                    action={(formdata) => formAction(formdata)}>
                        <FormField
                            label="Nome de identificação"
                            name="identificationName"
                            id="identification-name"
                            onChange={() => {
                                setError("")
                            }}
                            placeholder="Catálogo01"
                            maxLength={50}
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
                            required
                            helperText="O banner que deve aparecer no topo do catálogo"
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
                                {loading ? "Criando catálogo..." : "Criar catálogo"}
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
        </div>
    );
};