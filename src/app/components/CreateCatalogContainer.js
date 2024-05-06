'use client'
import { Button, FileInput, Label, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { createCatalog } from "../actions/createCatalog";
import { useAuth } from "../contexts/AuthContext";
import { useFormState } from 'react-dom';
import { useTool } from "../contexts/ToolContext";
import { HiInformationCircle } from "react-icons/hi";
import Notification from "./Notification";
import { redirect } from "next/navigation";
import ErrorCard from "./ErrorCard";


export default function CreateCatalogContainer() {
    const [storeName, setStoreName] = useState("");
    const [storeDescription, setStoreDescription] = useState("");
    const [primaryColor, setPrimaryColor] = useState("#bfd7ff");
    const [secondaryColor, setSecondaryColor] = useState("#5465ff");
    const [tertiaryColor, setTertiaryColor] = useState("#788bff");
    const [textColor, setTextColor] = useState("#ffffff");
    const [bannerImage, setBannerImage] = useState(null);
    const { user } = useAuth();
    const { updateCatalogs } = useTool()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState(<></>);


    const [formState, formAction] = useFormState((state, formdata) => {
        if (bannerImage) {
            setLoading(true)
            setNotification(<Notification setPattern={setNotification} type="warning" message="Criando catálogo..."/>);
            return createCatalog(state, formdata, user.uid);
        } else {
            setError("Você precisa selecionar uma imagem para ser o banner do catálogo")
        }
    }, {message: ''});

    useEffect(() => {
        if (formState.message !== '') {
            if (formState.message === 'catalog-created') {
                setNotification(<Notification setPattern={setNotification} type="success" message="Catálogo criado com sucesso !"/>);
                updateCatalogs();
                redirect(`/dashboard/catalogs/${formState.catalogId}`);
            } else if (formState.message === 'catalog-already-exists') {
                setError("Você já tem um catálogo com essas informações.");
            } else if (formState.message === 'invalid-params') {
                setError("Informações de catálogo inválidas.");
            }
        }
    }, [formState]);

    return (
        <div className="bg-white !border-4 !border-lightcyan p-4 rounded flex flex-wrap">
            <div className="flex flex-col w-1/2 max-xl:w-full">
                <h1 className="text-xl font-black w-full">Crie um catálogo agora.</h1>
                <form 
                onSubmit={() => setLoading(true)}
                action={(formdata) => formAction(formdata)}>
                    <div className="py-2 w-full">
                        <Label 
                        htmlFor="identification-name" 
                        value="Nome de identificação" />
                        <TextInput
                        maxLength={50}
                        color="light"
                        name="identificationName"
                        id="identification-name" 
                        type="text"
                        onChange={() => {
                            setError("")
                        }}
                        placeholder="Catálogo01"
                        aria-disabled={loading}
                        required 
                        shadow />
                    </div>
                    <div className="py-2 w-full">
                        <Label 
                        htmlFor="store-name" 
                        value="Nome da loja" />
                        <TextInput
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
                        required
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
                        helperText="O banner que deve aparecer no topo do catálogo"/>
                    </div>
                    <div>
                        <div className="p-2 inline-flex items-center space-x-2">
                            <Label 
                            htmlFor="primary-color" 
                            value="Cor principal" />
                            <input aria-disabled={loading} name="primaryColor" className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" type="color" value={primaryColor} onChange={(e) => {
                                setPrimaryColor(e.target.value);
                            }}/>
                        </div>
                        <div className="p-2 inline-flex items-center space-x-2">
                            <Label 
                            htmlFor="secondary-color" 
                            value="Cor secundária" />
                            <input aria-disabled={loading} name="secondaryColor" className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" type="color" value={secondaryColor} onChange={(e) => {
                                setSecondaryColor(e.target.value);
                            }}/>
                        </div>
                        <div className="p-2 inline-flex items-center space-x-2">
                            <Label 
                            htmlFor="tertiary-color" 
                            value="Cor terciária" />
                            <input aria-disabled={loading} name="tertiaryColor" className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" type="color" value={tertiaryColor} onChange={(e) => {
                                setTertiaryColor(e.target.value);
                            }}/>
                        </div>
                        <div className="p-2 inline-flex items-center space-x-2">
                            <Label 
                            htmlFor="text-color" 
                            value="Cor dos textos" />
                            <input aria-disabled={loading} name="textColor" className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" type="color" value={textColor} onChange={(e) => {
                                setTextColor(e.target.value);
                            }}/>
                        </div>
                        <div className="py-2 w-full">
                            <ErrorCard error={error}/>
                            <Button aria-disabled={loading} type="submit" className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full" size="lg">{loading ? "Criando catálogo..." : "Criar catálogo"}</Button>
                        </div>
                        {notification}
                    </div>
                </form>
            </div>
            <div className="w-1/2 max-xl:w-full p-4">
                <div className="w-full relative p-4 rounded-lg" style={{backgroundColor: primaryColor, color: textColor}}>
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
    );
};