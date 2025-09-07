'use client'

import { useEffect, useState } from "react";
import { useTool } from "../../../contexts/ToolContext";
import { Label, Button, TextInput, Textarea, FileInput } from "flowbite-react";
import Image from 'next/image'
import { BiSearch } from "react-icons/bi";
import { HiInformationCircle, HiTrash } from "react-icons/hi";
import { useFormState } from 'react-dom';
import CreateProductVariants from "./ProductVariantsContainer";
import { updateProduct } from "../../../actions/updateProduct";
import Notification from "../../../components/Notification";
import ErrorCard from "../../../auth/components/ErrorCard";

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
        setLoading(true);
        setNotification(<Notification setPattern={setNotification} type="warning" message="Atualizando produto...."/>);
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
                <Image priority alt={product.name} src={imageUrl} width={100} height={100} className="size-24 m-1 rounded-lg"/>
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
        <div className="flex flex-row w-full max-xl:flex-col">
            <div className="p-8 w-1/3 max-xl:w-full max-xl:p-0">
                <Image className="max-xl:hidden size-80 rounded-lg" width={300} height={300} src={actualImagesURL[0]} alt={productName} />
                <h1 className="font-black text-3xl mb-4">{productName}</h1>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap w-full">
                <div className="flex flex-col w-full">
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
                            type="text"
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
                            <ErrorCard error={error}/>
                            <Button aria-disabled={loading} type="submit" className="shadow-md hover:shadow-md hover:shadow-cornflowerblue/50 bg-neonblue duration-200 hover:!bg-cornflowerblue focus:ring-jordyblue w-full" size="lg">{loading ? "Salvando produto..." : "Salvar alterações"}</Button>
                        </div>
                        {notification}
                    </form>
                </div>
            </div>
        </div>
    )
}