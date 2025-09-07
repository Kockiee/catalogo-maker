'use client'

import { useEffect, useState } from "react";
import { useTool } from "../../../contexts/ToolContext";
import Image from 'next/image'
import { useFormState } from 'react-dom';
import CreateProductVariants from "./ProductVariantsContainer";
import { updateProduct } from "../../../actions/updateProduct";
import { useNotifications } from "../../../hooks/useNotifications";
import ProductForm from "../../../components/ProductForm";

export default function EditProductContainer({catalogId, productId}) { 
    const { catalogs } = useTool();
    const { notify } = useNotifications();
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    const product = catalog.products.find(product => product.id === productId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [productName, setProductName] = useState(product.name);
    const [productDescription, setProductDescription] = useState(product.description);
    const [productPrice, setProductPrice] = useState(product.price);
    const [toAddImages, setToAddImages] = useState([]);
    const [toRemoveImages, setToRemoveImages] = useState([]);
    const [variations, setVariations] = useState(product.variations);
    
    // Converter imagens existentes para o formato do ImageGallery
    const [images, setImages] = useState(
        product.images.map((imageUrl, index) => ({
            url: imageUrl,
            id: `existing-${index}`,
            isExisting: true
        }))
    );

    const handleImagesChange = (newImages) => {
        setImages(newImages);
    };

    const handleImageRemove = (imageToRemove, index) => {
        if (imageToRemove.isExisting && imageToRemove.url.includes("https://firebasestorage.googleapis.com")) {
            setToRemoveImages(prev => [...prev, imageToRemove.url]);
        }
        
        // Se é uma imagem nova que foi adicionada
        if (!imageToRemove.isExisting) {
            setToAddImages(prev => prev.filter(img => img !== imageToRemove.file));
        }
    };

    const [formState, formAction] = useFormState((state, formdata) => {
        setLoading(true);
        notify.processing("Atualizando produto...");
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
                notify.productUpdated();
            } else if (formState.message === 'product-already-exists') {
                setError("Você já tem um produto igual a este no catálogo selecionado.");
            } else if (formState.message === 'invalid-params') {
                setError("Informações fornecidas inválidas.");
            }
        }
    }, [formState]);


    return (
        <div className="flex flex-row w-full max-xl:flex-col">
            <div className="p-8 w-1/3 max-xl:w-full max-xl:p-0">
                <Image 
                    className="max-xl:hidden size-80 rounded-lg" 
                    width={300} 
                    height={300} 
                    src={images[0]?.url || product.images[0]} 
                    alt={productName} 
                />
                <h1 className="font-black text-3xl mb-4">{productName}</h1>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap w-full">
                <div className="flex flex-col w-full">
                    <ProductForm
                        productName={productName}
                        setProductName={setProductName}
                        productDescription={productDescription}
                        setProductDescription={setProductDescription}
                        productPrice={productPrice}
                        setProductPrice={setProductPrice}
                        images={images}
                        onImagesChange={handleImagesChange}
                        onImageRemove={handleImageRemove}
                        loading={loading}
                        error={error}
                        onSubmit={() => {
                            notify.processing("Atualizando produto...");
                            setLoading(true)
                        }}
                        submitText="Salvar alterações"
                    >
                        <div className="py-2 w-full">
                            <CreateProductVariants variations={variations} setVariations={setVariations}/>
                        </div>
                    </ProductForm>
                </div>
            </div>
        </div>
    )
}