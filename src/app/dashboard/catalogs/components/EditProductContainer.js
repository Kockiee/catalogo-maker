/**
 * Container para edição de produtos
 * 
 * Este arquivo contém o componente principal para editar
 * um produto existente. Permite modificar todas as informações
 * do produto incluindo nome, descrição, preço, imagens e variações.
 * 
 * Funcionalidades principais:
 * - Edição de informações do produto
 * - Upload e remoção de imagens
 * - Gerenciamento de variações
 * - Validação de dados
 * - Integração com sistema de notificações
 */

'use client'

// Importa hooks do React para estado e efeitos
import { useEffect, useState } from "react";
// Importa contexto de ferramentas
import { useTool } from "../../../contexts/ToolContext";
// Importa componente Image do Next.js
import Image from 'next/image'
// Importa hook useFormState do React DOM
import { useFormState } from 'react-dom';
// Importa componente de variações de produtos
import CreateProductVariants from "./ProductVariantsContainer";
// Importa ação para atualizar produto
import { updateProduct } from "../../../actions/updateProduct";
// Importa hook de notificações
import { useNotifications } from "../../../hooks/useNotifications";
// Importa componente de formulário de produto
import ProductForm from "../../../components/ProductForm";

// Componente principal para edição de produtos
export default function EditProductContainer({catalogId, productId}) { 
    // Extrai catálogos do contexto de ferramentas
    const { catalogs } = useTool();
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications();
    // Encontra o catálogo específico
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    // Encontra o produto específico
    const product = catalog.products.find(product => product.id === productId);
    // Estado de loading durante atualização
    const [loading, setLoading] = useState(false);
    // Estado para mensagens de erro
    const [error, setError] = useState("");
    // Estado para o nome do produto
    const [productName, setProductName] = useState(product.name);
    // Estado para a descrição do produto
    const [productDescription, setProductDescription] = useState(product.description);
    // Estado para o preço do produto
    const [productPrice, setProductPrice] = useState(product.price);
    // Estado para imagens que serão adicionadas
    const [toAddImages, setToAddImages] = useState([]);
    // Estado para imagens que serão removidas
    const [toRemoveImages, setToRemoveImages] = useState([]);
    // Estado para as variações do produto
    const [variations, setVariations] = useState(product.variations);
    
    // Converter imagens existentes para o formato do ImageGallery
    const [images, setImages] = useState(
        product.images.map((imageUrl, index) => ({
            url: imageUrl, // URL da imagem
            id: `existing-${index}`, // ID único
            isExisting: true // Marca como imagem existente
        }))
    );

    // Função que atualiza a lista de imagens
    const handleImagesChange = (newImages) => {
        setImages(newImages); // Atualiza estado das imagens
    };

    // Função que gerencia a remoção de imagens
    const handleImageRemove = (imageToRemove, index) => {
        if (imageToRemove.isExisting && imageToRemove.url.includes("https://firebasestorage.googleapis.com")) {
            setToRemoveImages(prev => [...prev, imageToRemove.url]); // Adiciona à lista de remoção
        }
        
        // Se é uma imagem nova que foi adicionada
        if (!imageToRemove.isExisting) {
            setToAddImages(prev => prev.filter(img => img !== imageToRemove.file)); // Remove da lista de adição
        }
    };

    // Hook para gerenciar o estado do formulário e ações
    const [formState, formAction] = useFormState((state, formdata) => {
        setLoading(true); // Marca como carregando
        notify.processing("Atualizando produto..."); // Mostra notificação de processamento
        toAddImages.forEach(img => {
            formdata.append('imagesToCreate', img); // Adiciona imagens para criar
        });
        toRemoveImages.forEach(img => {
            formdata.append('imagesToDelete', img); // Adiciona imagens para deletar
        });
        formdata.set("price", productPrice) // Define o preço
        return updateProduct(state, formdata, catalogId, productId, variations); // Chama ação de atualização
    }, {message: ''});

    // Efeito que processa o resultado da atualização do produto
    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false); // Para loading
            if (formState.message === 'product-updated') {
                notify.productUpdated(); // Notifica sucesso
            } else if (formState.message === 'product-already-exists') {
                setError("Você já tem um produto igual a este no catálogo selecionado."); // Erro de duplicação
            } else if (formState.message === 'invalid-params') {
                setError("Informações fornecidas inválidas."); // Erro de parâmetros inválidos
            }
        }
    }, [formState]); // Executa quando formState muda


    return (
        <div className="flex flex-row w-full max-xl:flex-col">
            {/* Coluna da imagem e título do produto */}
            <div className="p-8 w-1/3 max-xl:w-full max-xl:p-0">
                {/* Imagem principal do produto */}
                <Image 
                    className="max-xl:hidden size-80 rounded-lg" 
                    width={300} 
                    height={300} 
                    src={images[0]?.url || product.images[0]} 
                    alt={productName} 
                />
                {/* Título com nome do produto */}
                <h1 className="font-black text-3xl mb-4">{productName}</h1>
            </div>
            {/* Coluna do formulário de edição */}
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap w-full">
                <div className="flex flex-col w-full">
                    {/* Formulário de edição do produto */}
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
                            notify.processing("Atualizando produto..."); // Mostra notificação
                            setLoading(true) // Marca como carregando
                        }}
                        submitText="Salvar alterações"
                    >
                        {/* Container para variações do produto */}
                        <div className="py-2 w-full">
                            <CreateProductVariants variations={variations} setVariations={setVariations}/>
                        </div>
                    </ProductForm>
                </div>
            </div>
        </div>
    )
}