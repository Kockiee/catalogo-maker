'use client'
import { BiSearch } from "react-icons/bi"
import { useTool } from "../../../contexts/ToolContext"
import { Label, Button, TextInput, Textarea, FileInput } from "flowbite-react"
import { useEffect, useState } from "react";
import { updateCatalog } from "../../../actions/updateCatalog";
import { useFormState } from 'react-dom'
import { useNotifications } from "../../../hooks/useNotifications";
import { HiInformationCircle } from "react-icons/hi";
import ErrorCard from "../../../auth/components/ErrorCard";

export default function EditCatalogContainer({catalogId}) {
    const { catalogs, updateCatalogs } = useTool();
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    const [identificationName, setIdentificationName] = useState(catalog.name);
    const [storeName, setStoreName] = useState(catalog.store_name);
    const [storeDescription, setStoreDescription] = useState(catalog.store_description);
    const [primaryColor, setPrimaryColor] = useState(catalog.primary_color);
    const [secondaryColor, setSecondaryColor] = useState(catalog.secondary_color);
    const [tertiaryColor, setTertiaryColor] = useState(catalog.tertiary_color);
    const [textColor, setTextColor] = useState(catalog.text_color);
    const [bannerImage, setBannerImage] = useState(catalog.banner_url);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { notify } = useNotifications();

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
                    <div className="py-2 w-full">
                        <Label 
                        htmlFor="identification-name" 
                        value="Nome de identificação" />
                        <TextInput
                        
                        value={identificationName}
                        onChange={(e) => {
                            setError("")
                            setIdentificationName(e.target.value)
                        }}
                        color="light"
                        placeholder="catalogo01"
                        name="identificationName"
                        id="identification-name" 
                        type="text"
                        aria-disabled={loading}
                        required 
                        shadow />
                    </div>
                    <div className="py-2 w-full">
                        <Label 
                        htmlFor="store-name" 
                        value="Nome da loja" />
                        <TextInput
                        
                        value={storeName}
                        onChange={(e) => {
                            setError("")
                            setStoreName(e.target.value);
                        }} 
                        color="light"
                        name="storeName"
                        id="store-name" 
                        type="text"
                        placeholder="Mister Store" 
                        maxLength={40}
                        aria-disabled={loading}
                        required 
                        shadow />
                    </div>
                    <div className="py-2 w-full">
                        <Label 
                        htmlFor="store-description" 
                        value="Descrição da loja" />
                        <Textarea
                        className='focus:ring-jordyblue focus:border-none focus:ring-2'
                        value={storeDescription}
                        onChange={(e) => {
                            setError("")
                            setStoreDescription(e.target.value);
                        }} 
                        color="light"
                        name="storeDescription"
                        id="store-description"
                        placeholder="Uma loja de roupas, calçados e acessórios..." 
                        rows={4}
                        maxLength={2000}
                        aria-disabled={loading}
                        required
                        shadow />
                    </div>
                    <div className="py-2 w-full">
                        <Label 
                        htmlFor="store-banner" 
                        value="Banner" />
                        <FileInput
                        aria-disabled={loading}
                        name="bannerImage"
                        color={"light"} 
                        id="store-banner" 
                        accept="image/*"
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
                        helperText="Selecione um novo banner para o catálogo"/>
                    </div>
                    <Label
                    value="Cores do catálogo"
                    />
                    <div>
                        <div className="p-2 inline-flex items-center space-x-2">
                            <Label 
                            htmlFor="primary-color" 
                            value="Cor principal" />
                            <input value={primaryColor} aria-disabled={loading} name="primaryColor" className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" type="color" onChange={(e) => {
                                setPrimaryColor(e.target.value);
                            }}/>
                        </div>
                        <div className="p-2 inline-flex items-center space-x-2">
                            <Label 
                            htmlFor="secondary-color" 
                            value="Cor secundária" />
                            <input value={secondaryColor} aria-disabled={loading} name="secondaryColor" className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" type="color" onChange={(e) => {
                                setSecondaryColor(e.target.value);
                            }}/>
                        </div>
                        <div className="p-2 inline-flex items-center space-x-2">
                            <Label 
                            htmlFor="tertiary-color" 
                            value="Cor terciária" />
                            <input value={tertiaryColor} aria-disabled={loading} name="tertiaryColor" className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" type="color" onChange={(e) => {
                                setTertiaryColor(e.target.value);
                            }}/>
                        </div>
                        <div className="p-2 inline-flex items-center space-x-2">
                            <Label 
                            htmlFor="text-color" 
                            value="Cor dos textos" />
                            <input value={textColor} aria-disabled={loading} name="textColor" className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" type="color" onChange={(e) => {
                                setTextColor(e.target.value);
                            }}/>
                        </div>
                    </div>
                    <div className="py-2 w-full">
                        <ErrorCard error={error}/>
                        <Button aria-disabled={loading} type="submit" className="shadow-md hover:shadow-md hover:shadow-cornflowerblue/50 bg-neonblue duration-200 hover:!bg-cornflowerblue focus:ring-jordyblue w-full" size="lg">{loading ? "Salvando..." : "Salvar alterações"}</Button>
                    </div>
                </form>
            </div>
            <div className="w-1/2 max-xl:w-full max-xl:mt-6 max-xl:pl-0 pl-8">
                <p className="text-lg mb-2">Pré-visualização:</p>
                <div className="w-full relative p-4 rounded-lg shadow-md" style={{backgroundColor: primaryColor, color: textColor}}>
                    <div className="p-4 absolute w-full top-0 right-0 rounded-lg flex items-center justify-between" style={{backgroundColor: secondaryColor}}>
                        <h1 className="font-bold break-all">{storeName}</h1>
                        <div className="relative w-64 p-5 rounded-lg" style={{backgroundColor: primaryColor}}>
                            <BiSearch className="absolute top-3 right-3"/>
                        </div>
                    </div>
                    <div className="py-[72px] flex flex-wrap text-sm">
                        <div className="p-4 w-full h-16 rounded-lg flex justify-center items-center bg-cover bg-center" style={{backgroundColor: tertiaryColor, backgroundImage: `url(${bannerImage})`}}></div>
                        <div className="p-2 rounded-lg flex flex-col m-2" style={{color: textColor === primaryColor ? "#000000" : textColor, border: `2px solid ${tertiaryColor}`}}>
                            <div className="w-full h-full rounded-lg p-8">Imagem de produto</div>
                            <p>Nome de um produto</p>
                            <p>R$0.00</p>
                        </div>
                        <div className="p-2 rounded-lg flex flex-col m-2" style={{color: textColor === primaryColor ? "#000000" : textColor, border: `2px solid ${tertiaryColor}`}}>
                            <div className="w-full h-full rounded-lg p-8">Imagem de produto</div>
                            <p>Nome de um produto</p>
                            <p>R$0.00</p>
                        </div>
                    </div>
                    <div className="w-full p-2 rounded-lg flex flex-col text-sm" style={{backgroundColor: secondaryColor}}>
                        <h1 className="font-bold break-all">{storeName}</h1>
                        <p className="break-all">{storeDescription}</p>
                    </div>
                </div>
                <p className="text-base inline-flex mt-2"><HiInformationCircle className="w-6 h-6 mr-1"/> Isto é uma versão simplificada</p>
            </div>
        </div>
    )
}