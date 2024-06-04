'use client'

import { useEffect, useState } from "react";
import { useTool } from "../contexts/ToolContext";
import { Label, Button, TextInput, Textarea, FileInput } from "flowbite-react";
import Image from 'next/image'
import { HiTrash } from "react-icons/hi";
import { useFormState } from 'react-dom';
import CreateProductVariants from "./ProductVariantsContainer";
import { createProduct } from "../actions/createProduct";
import { useAuth } from "../contexts/AuthContext";
import { redirect } from "next/navigation"
import ErrorCard from "./ErrorCard";

export default function CreateProductContainer({catalogId}) {
    const { catalogs } = useTool();
    const { user } = useAuth();
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImagesURL, setSelectedImagesURL] = useState([]);
    const [variations, setVariations] = useState([]);
    const [notification, setNotification] = useState(<></>);

    const renderProductImages = () => {
        return selectedImagesURL.map((imageUrl, index) => (
            <div key={index} className="relative">
                <Image src={imageUrl} width={100} height={100} className="size-24 m-1 rounded-lg"/>
                <button
                onClick={() => {
                    const newSelectedImagesURL = [...selectedImagesURL];
                    newSelectedImagesURL.splice(index, 1);
                    setSelectedImagesURL(newSelectedImagesURL);

                    const newSelectedImages = [...selectedImages];
                    newSelectedImages.splice(index, 1);
                    setSelectedImages(newSelectedImages);
                }}
                className="bg-cornflowerblue hover:bg-cornflowerblue/80 p-1 absolute right-1 bottom-1">
                    <HiTrash className="w-4 h-4"/>
                </button>
            </div>
        ));
    };

    const [formState, formAction] = useFormState((state, formdata) => {
        if (selectedImages.length > 0) {
            setNotification(<Notification setPattern={setNotification} type="warning" message="Criando produto..."/>);
            selectedImages.forEach(img => {
                formdata.append('images', img);
            });
            formdata.set("price", productPrice);
            return createProduct(state, formdata, catalog.id, user.uid, variations);
        } else {
            setError("Você precisa selecionar ao menos uma imagem para o produto.");
        }
    }, {message: ''});

    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false);
            if (formState.message === 'product-created') {
                setNotification(<Notification setPattern={setNotification} type="success" message="Produto criado com sucesso !"/>);
                redirect(`/dashboard/catalogs/${catalog.id}#products-table`);
            } else if (formState.message === 'product-already-exists') {
                setError("Você já tem um produto igual a este no catálogo selecionado.");
            } else if (formState.message === 'invalid-params') {
                setError("Informações fornecidas inválidas.");
            }
        }
    }, [formState]);

    return (
        <div>
            <h1 className="text-3xl font-black mb-2">Crie um produto para o catálogo {catalog.name}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap">
                <div className="flex flex-col w-full">
                    <form 
                    onSubmit={() => setLoading(true)}
                    action={(formdata) => formAction(formdata)}
                    >
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
                            value={productDescription}
                            className='focus:ring-jordyblue focus:border-none focus:ring-2'
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
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                const valueInBRL = (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                                e.target.value = valueInBRL;
                                
                                const numericString = valueInBRL.replace(/[^\d,]/g, '');
                                const replacedComma = numericString.replace(',', '.');
                                const formattedValue = parseFloat(replacedComma);
                                
                                setProductPrice(formattedValue);
                            }} 
                            color="blue"
                            name="price"
                            type="text"
                            placeholder="R$ 180,00"
                            aria-disabled={loading}
                            required/>
                        </div>
                        <div className="py-2 w-full">
                            <Label 
                            htmlFor="product-images" 
                            value="Imagens do produto" />
                            <div className="flex-wrap flex justify-center items-center">
                                {renderProductImages()}
                            </div>
                            <FileInput
                            required
                            multiple
                            aria-disabled={loading}
                            name="productImages"
                            color="light"
                            id="product-images" 
                            accept="image/*"
                            onChange={e => {
                                const files = e.target.files;
                                if (files.length + selectedImages.length > 10) {
                                    setError("Você só pode selecionar até 10 imagens para o produto.");
                                    return;
                                }
                                setError("");
                                for (let i = 0; i < files.length; i++) {
                                    const file = files[i];
                                    setSelectedImages(prevState => [...prevState, file]);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setSelectedImagesURL(prevState => [...prevState, reader.result])
                                    };
                                    if (file) { 
                                        reader.readAsDataURL(file);
                                    }
                                }
                            }}
                            helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."/>
                        </div>
                        <div className="py-2 w-full">
                            <CreateProductVariants variations={variations} setVariations={setVariations}/>
                        </div>
                        <div className="py-2 w-full">
                            <ErrorCard error={error}/>
                            <Button aria-disabled={loading} type="submit" className="shadow-md hover:shadow-md hover:shadow-cornflowerblue/50 bg-neonblue duration-200 hover:!bg-cornflowerblue focus:ring-jordyblue w-full" size="lg">{loading ? "Criando produto..." : "Criar produto"}</Button>
                        </div>
                        {notification}
                    </form>
                </div>
            </div>
        </div>
    );
};