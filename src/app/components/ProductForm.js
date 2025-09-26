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
    // Componente de formulário para criação ou edição de produtos
    return (
        <div>
            {/* Campo de entrada para o nome do produto */}
            <FormField
                label="Nome do produto"
                name="name"
                id="name"
                value={productName} // Valor atual do nome do produto
                onChange={(e) => setProductName(e.target.value)} // Atualiza o estado do nome do produto
                placeholder="Tênis De Corrida e Caminhada"
                disabled={loading} // Desabilita o campo enquanto o formulário está carregando
                required // Campo obrigatório
            />
            
            {/* Campo de texto para a descrição do produto */}
            <FormField
                type="textarea"
                label="Descrição do produto"
                name="description"
                id="description"
                value={productDescription} // Valor atual da descrição do produto
                onChange={(e) => setProductDescription(e.target.value)} // Atualiza o estado da descrição do produto
                placeholder="Ótimo tênis para caminhada e corrida"
                rows={5} // Número de linhas visíveis no campo de texto
                maxLength={2000} // Limite máximo de caracteres
                disabled={loading} // Desabilita o campo enquanto o formulário está carregando
                required // Campo obrigatório
            />
            
            {/* Campo de entrada para o preço do produto */}
            <PriceInput
                label="Preço do produto"
                name="price"
                id="price"
                value={productPrice} // Valor atual do preço do produto
                onChange={setProductPrice} // Atualiza o estado do preço do produto
                placeholder="R$ 180,00"
                disabled={loading} // Desabilita o campo enquanto o formulário está carregando
                required // Campo obrigatório
            />
            
            {/* Galeria de imagens do produto */}
            <ImageGallery
                label="Imagens do produto"
                name="productImages"
                id="product-images"
                images={images} // Lista de imagens do produto
                onImagesChange={onImagesChange} // Função para adicionar novas imagens
                onImageRemove={onImageRemove} // Função para remover imagens existentes
                disabled={loading} // Desabilita a galeria enquanto o formulário está carregando
                required // Campo obrigatório
                maxImages={10} // Número máximo de imagens permitidas
                helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)." // Texto de ajuda para o usuário
            />
            
            {children} {/* Renderiza componentes adicionais passados como filhos */}
            
            <div className="py-2 w-full">
                {/* Exibe mensagens de erro, se houver */}
                <ErrorCard error={error}/>
                {/* Botão de envio do formulário */}
                <Button 
                    disabled={loading} // Desabilita o botão enquanto o formulário está carregando
                    type="submit" 
                    className="shadow-md hover:shadow-md hover:shadow-cornflowerblue/50 bg-neonblue duration-200 hover:!bg-cornflowerblue focus:ring-jordyblue w-full" 
                    size="lg"
                >
                    {loading ? "Criando produto..." : submitText} {/* Texto dinâmico baseado no estado de carregamento */}
                </Button>
            </div>
        </div>
    );
}
