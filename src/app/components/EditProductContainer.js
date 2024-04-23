'use client'

import { useEffect, useState } from "react";
import { useTool } from "../contexts/ToolContext";
import { Label, Button, TextInput, Textarea, FileInput } from "flowbite-react";
import Image from 'next/image'
import { BiSearch } from "react-icons/bi";
import { HiInformationCircle, HiTrash } from "react-icons/hi";
import { useFormState } from 'react-dom';
import CreateProductVariants from "./ProductVariantsContainer";
import { updateProduct } from "../actions/updateProduct";
import Notification from "./Notification";

export default function EditProductContainer({catalogId, productId}) { 
    const { catalogs } = useTool();
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    const product = catalog.products.find(product => product.id === productId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [productName, setProductName] = useState(product.name);
    const [productDescription, setProductDescription] = useState(product.description);
    const [productPrice, setProductPrice] = useState(product.price);
    const [toAddImages, setToAddImages] = useState([]);
    const [actualImagesURL, setActualImagesURL] = useState(product.images);
    const [toRemoveImages, setToRemoveImages] = useState([]);
    const [variations, setVariations] = useState(product.variations);
    const [notification, setNotification] = useState(<></>)

    const [formState, formAction] = useFormState((state, formdata) => {
        toAddImages.forEach(img => {
            formdata.append('imagesToCreate', img);
        });
        toRemoveImages.forEach(img => {
            formdata.append('imagesToDelete', img);
        });
        formdata.set("price", productPrice)
        return updateProduct(state, formdata, catalogId, productId, variations);
    }, {message: ''});

    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false);
            if (formState.message === 'product-updated') {
                setNotification(<Notification setPattern={setNotification} type="success" message="Produto atualizado com sucesso."/>)
            } else if (formState.message === 'product-already-exists') {
                setError("Você já tem um produto igual a este no catálogo selecionado.");
            } else if (formState.message === 'invalid-params') {
                setError("Informações fornecidas inválidas.");
            }
        }
    }, [formState]);

    const renderProductImages = () => {
        return actualImagesURL.map((imageUrl, index) => {
            return (<div key={index} className="relative">
                <Image src={imageUrl} width={100} height={100} className="size-24 m-1"/>
                <button type="button"
                onClick={() => {
                    const newActualImagesURL = actualImagesURL.filter((_, i) => i !== index);
                    setActualImagesURL(newActualImagesURL);
                    if (imageUrl.includes("https://firebasestorage.googleapis.com")) {
                        setToRemoveImages([...toRemoveImages, imageUrl])
                    }

                    if (index >= product.images.length) {
                        const newToAddImages = [...toAddImages];
                        newToAddImages.splice(index - product.images.length, 1);
                        setToAddImages(newToAddImages);
                    }
                }}
                className="bg-cornflowerblue hover:bg-cornflowerblue/80 p-1 absolute right-1 bottom-1">
                    <HiTrash className="w-4 h-4"/>
                </button>
            </div>)
        });
    };

    return (
        <div className="bg-white !border-4 !border-lightcyan p-4 rounded flex flex-wrap">
            <div className="flex flex-col w-1/2 max-xl:w-full">
                <form
                onSubmit={() => {
                    setNotification(<Notification setPattern={setNotification} type="warning" message="Atualizando produto..."/>)
                    setLoading(true)
                }}
                action={(formdata) => formAction(formdata)}>
                    <div className="py-2 w-full">
                        <Label
                        htmlFor="name"
                        value="Nome do produto" />
                        <TextInput
                        
                        value={productName}
                        onChange={(e) => {
                            setProductName(e.target.value);
                        }}
                        color="light"
                        name="name"
                        type="text"
                        placeholder="Tênis De Corrida e Caminhada"
                        aria-disabled={loading}
                        required
                        shadow />
                    </div>
                    <div className="py-2 w-full">
                        <Label
                        htmlFor="description"
                        value="Descrição do produto" />
                        <Textarea
                        className='focus:ring-jordyblue focus:border-none focus:ring-2'
                        value={productDescription}
                        onChange={(e) => {
                            setProductDescription(e.target.value);
                        }} 
                        color="light"
                        name="description"
                        placeholder="Ótimo tênis para caminhada e corrida" 
                        rows={5}
                        maxLength={2000}
                        aria-disabled={loading}
                        required
                        shadow />
                    </div>
                    <div className="py-2 w-full">
                        <Label
                        htmlFor="price"
                        value="Preço do produto" />
                        <TextInput
                        
                        value={productPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            const valueInBRL = (value / 100);
                            setProductPrice(valueInBRL);
                        }} 
                        color="light"
                        name="price"
                        placeholder="R$ 180,00"
                        aria-disabled={loading}
                        required
                        shadow />
                    </div>
                    <div className="py-2 w-full">
                        <Label 
                        htmlFor="store-banner" 
                        value="Imagens do produto" />
                        <div className="flex-wrap flex justify-center items-center">
                            {renderProductImages()}
                        </div>
                        <FileInput
                        multiple
                        aria-disabled={loading}
                        name="bannerImage"
                        color="light"
                        id="store-banner" 
                        accept="image/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            setError("");
                            setToAddImages([...toAddImages, file]);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setActualImagesURL([...actualImagesURL, reader.result]);
                            };
                            if (file) { 
                                reader.readAsDataURL(file);
                            };
                        }}
                        helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."/>
                    </div>
                    <div className="py-2 w-full">
                        <CreateProductVariants variations={variations} setVariations={setVariations}/>
                    </div>
                    <div className="py-2 w-full">
                        <p className='text-red-600 text-sm'>{error}</p>
                        <Button aria-disabled={loading} type="submit" className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full" size="lg">{loading ? "Salvando produto..." : "Salvar alterações"}</Button>
                    </div>
                    {notification}
                </form>
            </div>
            <div className="w-1/2 max-xl:w-full p-4">
                <div className="w-full relative p-4 rounded-lg" style={{backgroundColor: catalog.primary_color, color: catalog.text_color}}>
                    <div className="p-4 absolute w-full top-0 right-0 rounded-lg flex items-center justify-between" style={{backgroundColor: catalog.secondary_color}}>
                        <h1 className="font-bold break-all">{catalog.store_name}</h1>
                        <div className="relative w-64 p-5 rounded-lg" style={{backgroundColor: catalog.primary_color}}>
                            <BiSearch className="absolute top-3 right-3"/>
                        </div>
                    </div>
                    <div className="py-[72px] flex flex-wrap text-sm" style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}>
                        <div className="w-1/2 max-lg:w-full p-4 flex-col">
                            <div 
                            className={actualImagesURL.length < 1 ? "p-4 rounded" : ""}
                            style={actualImagesURL.length < 1 ? {backgroundColor: catalog.secondary_color} : {}}>
                                <Image className="size-72" alt="Primeira imagem do produto." src={actualImagesURL[0]} width={288} height={288}/>
                            </div>
                            <div className="overflow-x-auto flex flex-row">
                                {actualImagesURL.map((imageUrl, index) => (
                                    <Image key={index} src={imageUrl} width={48} height={48} className="size-12 m-1"/>
                                ))}
                            </div>
                        </div>
                        <div className="w-1/2 max-lg:w-full p-4">
                            <p className="text-xl font-bold">{productName || "Nome do produto"}</p>
                            <p className="text-xl font-black">{productPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            <button 
                            style={{backgroundColor: catalog.secondary_color, color: catalog.text_color}}
                            className="rounded p-2.5 px-6 inline-flex items-center justify-center text-base hover:opacity-80 w-full">
                                Adicionar ao carrinho
                            </button>
                        </div>
                        <div className="w-full p-4">
                            <p className="break-all">
                                {productDescription}
                            </p>
                        </div>
                    </div>
                    <div className="w-full p-2 rounded-lg flex flex-col text-sm" style={{backgroundColor: catalog.secondary_color}}>
                        <h1 className="font-bold break-all">{catalog.store_name}</h1>
                        <p className="break-all">{catalog.store_description}</p>
                    </div>
                </div>
                <p className="text-base inline-flex mt-2"><HiInformationCircle className="w-6 h-6 mr-1"/> Isto é uma versão simplificada</p>
            </div>
        </div>
    )
}