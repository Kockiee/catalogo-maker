'use client'

import { useEffect, useState } from "react";
import { useTool } from "../contexts/ToolContext";
import { Label, Button, TextInput, Textarea, FileInput } from "flowbite-react";
import Image from 'next/image'
import { BiSearch } from "react-icons/bi";
import { HiInformationCircle, HiTrash } from "react-icons/hi";
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
                <Image src={imageUrl} width={100} height={100} className="size-24 m-1"/>
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
        <div className="bg-white !border-4 !border-lightcyan p-4 rounded flex flex-wrap">
            <div className="flex flex-col w-1/2 max-xl:w-full">
                <h1 className="text-xl font-black w-full">Crie um novo produto para {catalog.name}</h1>
                <form 
                onSubmit={() => setLoading(true)}
                action={(formdata) => formAction(formdata)}>
                    <div className="py-2 w-full">
                        <Label
                        htmlFor="name"
                        value="Nome do produto" />
                        <TextInput
                        
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
                        <Button aria-disabled={loading} type="submit" className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full" size="lg">{loading ? "Criando produto..." : "Criar produto"}</Button>
                    </div>
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
                    <div className="py-[72px] flex flex-wrap text-sm">
                        <div className="w-1/2 max-lg:w-full p-4 flex-col">
                            <div 
                            className={selectedImagesURL.length < 1 ? "p-4 rounded" : ""}
                            style={selectedImagesURL.length < 1 ? {backgroundColor: catalog.secondary_color} : {}}>
                                <Image className="size-72" alt="Primeira imagem do produto." src={selectedImagesURL[0]} width={288} height={288}/>
                            </div>
                            <div className="overflow-x-auto flex flex-row">
                                {selectedImagesURL.map((imageUrl, index) => (
                                    <Image key={index} src={imageUrl} width={48} height={48} className="size-12 m-1"/>
                                ))}
                            </div>
                        </div>
                        <div className="w-1/2 max-lg:w-full p-4" style={{color: catalog.text_color === catalog.primary_color ? "#000000" : catalog.text_color}}>
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
    );
};