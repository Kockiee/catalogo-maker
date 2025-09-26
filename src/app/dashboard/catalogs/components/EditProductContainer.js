'use client'

// Importação de hooks do React
import { useEffect, useState } from "react";
// Importação do contexto de ferramentas
import { useTool } from "../../../contexts/ToolContext";
// Importação do componente Image do Next.js
import Image from 'next/image'
// Importação do hook useFormState do React DOM
import { useFormState } from 'react-dom';
// Importação do componente para variações de produto
import CreateProductVariants from "./ProductVariantsContainer";
// Importação da ação do servidor para atualizar produto
import { updateProduct } from "../../../actions/updateProduct";
// Importação do hook personalizado para notificações
import { useNotifications } from "../../../hooks/useNotifications";
// Importação do componente de formulário de produto
import ProductForm from "../../../components/ProductForm";

/**
 * Componente container para edição de produtos existentes em catálogos
 * Permite editar nome, descrição, preço, imagens e variações do produto
 * @param {string} catalogId - ID único do catálogo
 * @param {string} productId - ID único do produto a ser editado
 * @returns {JSX.Element} Interface de edição de produto
 */
export default function EditProductContainer({catalogId, productId}) {
    // Desestruturação dos dados do contexto de ferramentas
    const { catalogs } = useTool();
    // Desestruturação da função de notificação
    const { notify } = useNotifications();
    // Encontra o catálogo específico na lista de catálogos
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    // Encontra o produto específico na lista de produtos do catálogo
    const product = catalog.products.find(product => product.id === productId);
    // Estados para controlar o processo de edição do produto
    const [loading, setLoading] = useState(false);                       // Estado de carregamento
    const [error, setError] = useState("");                             // Mensagens de erro
    // Estados para os dados editáveis do produto
    const [productName, setProductName] = useState(product.name);                           // Nome do produto
    const [productDescription, setProductDescription] = useState(product.description);     // Descrição do produto
    const [productPrice, setProductPrice] = useState(product.price);                        // Preço do produto
    // Estados para gerenciar as imagens (adicionar/remover)
    const [toAddImages, setToAddImages] = useState([]);                 // Imagens novas para adicionar
    const [toRemoveImages, setToRemoveImages] = useState([]);           // Imagens existentes para remover
    const [variations, setVariations] = useState(product.variations);   // Variações do produto

    /**
     * Converte as imagens existentes do produto para o formato do ImageGallery
     * Cada imagem existente recebe um ID único e flag indicando que já existe
     */
    const [images, setImages] = useState(
        product.images.map((imageUrl, index) => ({
            url: imageUrl,        // URL da imagem no Firebase Storage
            id: `existing-${index}`, // ID único para identificar a imagem
            isExisting: true      // Flag indicando que é imagem existente
        }))
    );

    /**
     * Função para lidar com mudanças nas imagens do produto
     * Atualiza o estado de imagens quando o usuário faz upload ou remove
     * @param {Array} newImages - Array com as novas imagens
     */
    const handleImagesChange = (newImages) => {
        setImages(newImages);
    };

    /**
     * Função para lidar com a remoção de imagens
     * Separa imagens existentes (para deletar do storage) de novas (para cancelar upload)
     * @param {Object} imageToRemove - Imagem a ser removida
     * @param {number} index - Índice da imagem na lista
     */
    const handleImageRemove = (imageToRemove, index) => {
        // Se é uma imagem existente no Firebase Storage
        if (imageToRemove.isExisting && imageToRemove.url.includes("https://firebasestorage.googleapis.com")) {
            setToRemoveImages(prev => [...prev, imageToRemove.url]);  // Adiciona à lista de remoção
        }

        // Se é uma imagem nova que foi adicionada mas ainda não salva
        if (!imageToRemove.isExisting) {
            setToAddImages(prev => prev.filter(img => img !== imageToRemove.file));  // Remove da lista de adição
        }
    };

    /**
     * Configuração do estado do formulário usando useFormState
     * Define a lógica de validação e submissão do formulário de edição
     */
    const [formState, formAction] = useFormState((state, formdata) => {
        setLoading(true);  // Ativa estado de carregamento
        notify.processing("Atualizando produto...");  // Exibe notificação de processamento
        // Adiciona imagens novas ao FormData
        toAddImages.forEach(img => {
            formdata.append('imagesToCreate', img);
        });
        // Adiciona URLs de imagens a serem removidas ao FormData
        toRemoveImages.forEach(img => {
            formdata.append('imagesToDelete', img);
        });
        // Define o preço no FormData
        formdata.set("price", productPrice)
        // Chama a ação do servidor para atualizar o produto
        return updateProduct(state, formdata, catalogId, productId, variations);
    }, {message: ''});

    /**
     * Efeito para lidar com respostas do servidor após submissão do formulário
     * Processa diferentes tipos de resposta e executa ações apropriadas
     */
    useEffect(() => {
        // Só executa se há uma mensagem de resposta
        if (formState.message !== '') {
            setLoading(false);  // Desativa estado de carregamento
            // Produto atualizado com sucesso
            if (formState.message === 'product-updated') {
                notify.productUpdated();  // Exibe notificação de sucesso
            } else if (formState.message === 'product-already-exists') {
                setError("Você já tem um produto igual a este no catálogo selecionado.");
            } else if (formState.message === 'invalid-params') {
                setError("Informações fornecidas inválidas.");
            }
        }
    }, [formState]);  // Dependência: executa quando formState muda


    // Renderiza a interface de edição de produto com layout responsivo
    return (
        <div className="flex flex-row w-full max-xl:flex-col">
            {/* Seção lateral com preview da imagem e título (desktop) */}
            <div className="p-8 w-1/3 max-xl:w-full max-xl:p-0">
                {/* Preview da primeira imagem do produto */}
                <Image
                    className="max-xl:hidden size-80 rounded-lg"
                    width={300}
                    height={300}
                    src={images[0]?.url || product.images[0]}
                    alt={productName}
                />
                {/* Título do produto */}
                <h1 className="font-black text-3xl mb-4">{productName}</h1>
            </div>

            {/* Container principal do formulário */}
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap w-full">
                <div className="flex flex-col w-full">
                    {/* Formulário de edição de produto */}
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
                    {/* Seção de variações do produto */}
                    <div className="py-2 w-full">
                        <CreateProductVariants variations={variations} setVariations={setVariations}/>
                    </div>
                    </ProductForm>
                </div>
            </div>
        </div>
    )
}