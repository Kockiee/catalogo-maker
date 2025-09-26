'use client'

// Importação de hooks do React
import { useEffect, useState } from "react";
// Importação do contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importação do hook useFormState do React DOM
import { useFormState } from 'react-dom';
// Importação do componente para variações de produto
import CreateProductVariants from "./ProductVariantsContainer";
// Importação da ação do servidor para criar produto
import { createProduct } from "@/app/actions/createProduct";
// Importação do contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importação da função redirect do Next.js
import { redirect } from "next/navigation"
// Importação do hook personalizado para notificações
import { useNotifications } from "@/app/hooks/useNotifications";
// Importação do componente de formulário de produto
import ProductForm from "@/app/components/ProductForm";

/**
 * Componente container para criação de produtos em catálogos
 * Gerencia o estado do formulário, upload de imagens e criação do produto
 * @param {string} catalogId - ID único do catálogo onde o produto será criado
 * @returns {JSX.Element} Interface de criação de produto
 */
export default function CreateProductContainer({catalogId}) {
    // Desestruturação dos dados do contexto de ferramentas
    const { catalogs } = useTool();
    // Desestruturação dos dados do contexto de autenticação
    const { user } = useAuth();
    // Desestruturação da função de notificação
    const { notify } = useNotifications();
    // Encontra o catálogo específico na lista de catálogos
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    // Estados para controlar o processo de criação do produto
    const [loading, setLoading] = useState(false);                       // Estado de carregamento
    const [error, setError] = useState("");                             // Mensagens de erro
    // Estados para os dados do produto
    const [productName, setProductName] = useState("");                 // Nome do produto
    const [productDescription, setProductDescription] = useState("");   // Descrição do produto
    const [productPrice, setProductPrice] = useState(0);                // Preço do produto
    const [images, setImages] = useState([]);                           // Array de imagens do produto
    const [variations, setVariations] = useState([]);                   // Variações do produto (cores, tamanhos, etc.)

    /**
     * Função para lidar com mudanças nas imagens do produto
     * Atualiza o estado de imagens quando o usuário faz upload
     * @param {Array} newImages - Array com as novas imagens selecionadas
     */
    const handleImagesChange = (newImages) => {
        setImages(newImages);
    };

    /**
     * Configuração do estado do formulário usando useFormState
     * Define a lógica de validação e submissão do formulário de produto
     */
    const [formState, formAction] = useFormState((state, formdata) => {
        // Valida se há pelo menos uma imagem selecionada
        if (images.length > 0) {
            // Adiciona todas as imagens ao FormData
            images.forEach(img => {
                formdata.append('images', img.file);
            });
            // Define o preço do produto no FormData
            formdata.set("price", productPrice);
            // Chama a ação do servidor para criar o produto
            return createProduct(state, formdata, catalog.id, user.uid, variations);
        } else {
            // Se não há imagens, exibe notificação de erro
            notify.imageRequired();
        }
    }, {message: ''});

    /**
     * Função para lidar com a submissão do formulário
     * Valida os dados e prepara o FormData para envio
     * @param {Event} e - Evento de submit do formulário
     */
    const handleSubmit = (e) => {
        e.preventDefault();  // Previne o comportamento padrão do formulário
        // Valida se há pelo menos uma imagem
        if (images.length > 0) {
            setLoading(true);  // Ativa estado de carregamento
            notify.processing("Criando produto...");  // Exibe notificação de processamento
            // Cria FormData e adiciona as imagens
            const formData = new FormData(e.target);
            images.forEach(img => {
                formData.append('images', img.file);
            });
            // Define o preço no FormData
            formData.set("price", productPrice);
            // Submete o formulário
            formAction(formData);
        } else {
            // Se não há imagens, exibe erro
            notify.imageRequired();
        }
    };

    /**
     * Efeito para lidar com respostas do servidor após submissão do formulário
     * Processa diferentes tipos de resposta e executa ações apropriadas
     */
    useEffect(() => {
        // Só executa se há uma mensagem de resposta
        if (formState.message !== '') {
            setLoading(false);  // Desativa estado de carregamento
            // Produto criado com sucesso
            if (formState.message === 'product-created') {
                notify.productCreated();  // Exibe notificação de sucesso
                // Redireciona para a tabela de produtos do catálogo
                redirect(`/dashboard/catalogs/${catalog.id}#products-table`);
            } else if (formState.message === 'product-already-exists') {
                setError("Você já tem um produto igual a este no catálogo selecionado.");
            } else if (formState.message === 'invalid-params') {
                setError("Informações fornecidas inválidas.");
            }
        }
    }, [formState]);  // Dependência: executa quando formState muda

    // Renderiza a interface de criação de produto
    return (
        <div>
            {/* Título da página com nome do catálogo */}
            <h1 className="text-3xl font-black mb-2">Crie um produto para o catálogo {catalog.name}</h1>

            {/* Container principal do formulário */}
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap">
                <div className="flex flex-col w-full">
                    {/* Formulário de criação de produto */}
                    <form onSubmit={handleSubmit}>
                        {/* Componente de formulário reutilizável */}
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
                        {/* Seção de variações do produto */}
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