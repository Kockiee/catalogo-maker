'use client'
import { Button } from "flowbite-react";
import FormField from "./FormField";
import PriceInput from "./PriceInput";
import ImageGallery from "./ImageGallery";
import ErrorCard from "../auth/components/ErrorCard";

export default function ProductForm({ 
    productName,
    setProductName,
    productDescription,
    setProductDescription,
    productPrice,
    setProductPrice,
    images,
    onImagesChange,
    onImageRemove,
    variations,
    setVariations,
    loading,
    error,
    onSubmit,
    submitText,
    children // Para componentes adicionais como ProductVariants
}) {
    return (
        <div>
            <FormField
                label="Nome do produto"
                name="name"
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Tênis De Corrida e Caminhada"
                disabled={loading}
                required
            />
            
            <FormField
                type="textarea"
                label="Descrição do produto"
                name="description"
                id="description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Ótimo tênis para caminhada e corrida"
                rows={5}
                maxLength={2000}
                disabled={loading}
                required
            />
            
            <PriceInput
                label="Preço do produto"
                name="price"
                id="price"
                value={productPrice}
                onChange={setProductPrice}
                placeholder="R$ 180,00"
                disabled={loading}
                required
            />
            
            <ImageGallery
                label="Imagens do produto"
                name="productImages"
                id="product-images"
                images={images}
                onImagesChange={onImagesChange}
                onImageRemove={onImageRemove}
                disabled={loading}
                required
                maxImages={10}
                helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."
            />
            
            {children}
            
            <div className="py-2 w-full">
                <ErrorCard error={error}/>
                <Button 
                    disabled={loading}
                    type="submit" 
                    className="shadow-md hover:shadow-md hover:shadow-cornflowerblue/50 bg-neonblue duration-200 hover:!bg-cornflowerblue focus:ring-jordyblue w-full" 
                    size="lg"
                >
                    {loading ? "Criando produto..." : submitText}
                </Button>
            </div>
        </div>
    );
}
