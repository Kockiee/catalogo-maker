'use client'

import { useEffect, useState } from "react";
import { useTool } from "@/app/contexts/ToolContext";
import { useFormState } from 'react-dom';
import CreateProductVariants from "./ProductVariantsContainer";
import { createProduct } from "@/app/actions/createProduct";
import { useAuth } from "@/app/contexts/AuthContext";
import { redirect } from "next/navigation"
import { useNotifications } from "@/app/hooks/useNotifications";
import ProductForm from "@/app/components/ProductForm";

export default function CreateProductContainer({catalogId}) {
    const { catalogs } = useTool();
    const { user } = useAuth();
    const { notify } = useNotifications();
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [variations, setVariations] = useState([]);

    const handleImagesChange = (newImages) => {
        setImages(newImages);
    };

    const [formState, formAction] = useFormState((state, formdata) => {
        if (images.length > 0) {
            images.forEach(img => {
                formdata.append('images', img.file);
            });
            formdata.set("price", productPrice);
            return createProduct(state, formdata, catalog.id, user.uid, variations);
        } else {
            notify.imageRequired();
        }
    }, {message: ''});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (images.length > 0) {
            setLoading(true);
            notify.processing("Criando produto...");
            // Criar FormData e submeter
            const formData = new FormData(e.target);
            images.forEach(img => {
                formData.append('images', img.file);
            });
            formData.set("price", productPrice);
            formAction(formData);
        } else {
            notify.imageRequired();
        }
    };

    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false);
            if (formState.message === 'product-created') {
                notify.productCreated();
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
                    <form onSubmit={handleSubmit}>
                        <ProductForm
                            productName={productName}
                            setProductName={setProductName}
                            productDescription={productDescription}
                            setProductDescription={setProductDescription}
                            productPrice={productPrice}
                            setProductPrice={setProductPrice}
                            images={images}
                            onImagesChange={handleImagesChange}
                            loading={loading}
                            error={error}
                            onSubmit={() => setLoading(true)}
                            submitText="Criar produto"
                        >
                        <div className="py-2 w-full">
                            <CreateProductVariants variations={variations} setVariations={setVariations}/>
                        </div>
                        </ProductForm>
                    </form>
                </div>
            </div>
        </div>
    );
};