/**
 * COMPONENTE DE FORMULÁRIO DE PRODUTO
 * 
 * Este arquivo contém o componente de formulário para criação e edição de produtos.
 * O componente agrupa todos os campos necessários para um produto (nome, descrição,
 * preço, imagens) e permite componentes adicionais como variações de produto.
 * 
 * Funcionalidades:
 * - Campos de nome, descrição e preço
 * - Upload e gerenciamento de imagens
 * - Suporte a componentes filhos (variações)
 * - Estados de loading e erro
 * - Validação de campos obrigatórios
 * - Botão de submit dinâmico
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Button } from "flowbite-react"; // Importa componente Button do Flowbite
import FormField from "./FormField"; // Importa componente de campo de formulário
import PriceInput from "./PriceInput"; // Importa componente de input de preço
import ImageGallery from "./ImageGallery"; // Importa componente de galeria de imagens
import ErrorCard from "../auth/components/ErrorCard"; // Importa componente de card de erro

export default function ProductForm({ 
    productName, // Nome do produto
    setProductName, // Função para atualizar o nome
    productDescription, // Descrição do produto
    setProductDescription, // Função para atualizar a descrição
    productPrice, // Preço do produto
    setProductPrice, // Função para atualizar o preço
    images, // Array de imagens do produto
    onImagesChange, // Função para atualizar as imagens
    onImageRemove, // Função para remover uma imagem
    variations, // Variações do produto
    setVariations, // Função para atualizar as variações
    loading, // Estado de carregamento
    error, // Mensagem de erro
    onSubmit, // Função de submit do formulário
    submitText, // Texto do botão de submit
    children // Para componentes adicionais como ProductVariants
}) {
    return (
        <div>
            {/* Campo de nome do produto */}
            <FormField
                label="Nome do produto"
                name="name"
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)} // Atualiza o nome
                placeholder="Tênis De Corrida e Caminhada"
                disabled={loading} // Desabilita durante carregamento
                required // Campo obrigatório
            />
            
            {/* Campo de descrição do produto */}
            <FormField
                type="textarea" // Tipo textarea para descrição
                label="Descrição do produto"
                name="description"
                id="description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)} // Atualiza a descrição
                placeholder="Ótimo tênis para caminhada e corrida"
                rows={5} // Número de linhas
                maxLength={2000} // Limite de caracteres
                disabled={loading} // Desabilita durante carregamento
                required // Campo obrigatório
            />
            
            {/* Campo de preço do produto */}
            <PriceInput
                label="Preço do produto"
                name="price"
                id="price"
                value={productPrice}
                onChange={setProductPrice} // Atualiza o preço
                placeholder="R$ 180,00"
                disabled={loading} // Desabilita durante carregamento
                required // Campo obrigatório
            />
            
            {/* Galeria de imagens do produto */}
            <ImageGallery
                label="Imagens do produto"
                name="productImages"
                id="product-images"
                images={images}
                onImagesChange={onImagesChange} // Atualiza as imagens
                onImageRemove={onImageRemove} // Remove uma imagem
                disabled={loading} // Desabilita durante carregamento
                required // Campo obrigatório
                maxImages={10} // Limite máximo de imagens
                helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)." // Texto de ajuda
            />
            
            {/* Componentes filhos (ex: variações de produto) */}
            {children}
            
            {/* Área de erro e botão de submit */}
            <div className="py-2 w-full">
                <ErrorCard error={error}/> {/* Exibe erro se houver */}
                <Button 
                    disabled={loading} // Desabilita durante carregamento
                    type="submit" // Tipo submit
                    className="shadow-md hover:shadow-md hover:shadow-cornflowerblue/50 bg-neonblue duration-200 hover:!bg-cornflowerblue focus:ring-jordyblue w-full" 
                    size="lg" // Tamanho grande
                >
                    {loading ? "Criando produto..." : submitText} {/* Texto dinâmico baseado no estado */}
                </Button>
            </div>
        </div>
    );
}
