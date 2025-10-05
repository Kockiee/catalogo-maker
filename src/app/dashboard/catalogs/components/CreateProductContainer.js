/**
 * Container para criação de produtos
 * 
 * Este arquivo contém o componente principal para criar
 * um novo produto dentro de um catálogo específico.
 * Inclui formulário completo com campos de texto, upload
 * de imagens, definição de variações e validação de dados.
 * 
 * Funcionalidades principais:
 * - Formulário completo de criação de produto
 * - Upload de múltiplas imagens
 * - Definição de variações do produto
 * - Validação de dados e tratamento de erros
 * - Integração com sistema de notificações
 * - Redirecionamento após criação
 */

'use client'

// Importa hooks do React para estado e efeitos
import { useEffect, useState } from "react";
// Importa contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importa hook useFormState do React DOM
import { useFormState } from 'react-dom';
// Importa componente de variações de produtos
import CreateProductVariants from "./ProductVariantsContainer";
// Importa ação para criar produto
import { createProduct } from "@/app/actions/createProduct";
// Importa contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importa função de redirecionamento do Next.js
import { redirect } from "next/navigation"
// Importa hook de notificações
import { useNotifications } from "@/app/hooks/useNotifications";
// Importa componente de formulário de produto
import ProductForm from "@/app/components/ProductForm";

// Componente principal para criação de produtos
export default function CreateProductContainer({catalogId}) {
    // Extrai catálogos do contexto de ferramentas
    const { catalogs } = useTool();
    // Extrai dados do usuário do contexto de autenticação
    const { user } = useAuth();
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications();
    // Encontra o catálogo específico
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    // Estado de loading durante criação
    const [loading, setLoading] = useState(false);
    // Estado para mensagens de erro
    const [error, setError] = useState("");
    // Estado para o nome do produto
    const [productName, setProductName] = useState("");
    // Estado para a descrição do produto
    const [productDescription, setProductDescription] = useState("");
    // Estado para o preço do produto
    const [productPrice, setProductPrice] = useState(0);
    // Estado para as imagens do produto
    const [images, setImages] = useState([]);
    // Estado para as variações do produto
    const [variations, setVariations] = useState([]);

    // Função que atualiza a lista de imagens
    const handleImagesChange = (newImages) => {
        setImages(newImages); // Atualiza estado das imagens
    };

    // Hook para gerenciar o estado do formulário e ações
    const [formState, formAction] = useFormState((state, formdata) => {
        if (images.length > 0) {
            images.forEach(img => {
                formdata.append('images', img.file); // Adiciona imagens ao FormData
            });
            formdata.set("price", productPrice); // Define o preço
            return createProduct(state, formdata, catalog.id, user.uid, variations); // Chama ação de criação
        } else {
            notify.imageRequired(); // Notifica que imagem é obrigatória
        }
    }, {message: ''});

    // Função que gerencia o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault(); // Previne comportamento padrão
        if (images.length > 0) {
            setLoading(true); // Marca como carregando
            notify.processing("Criando produto..."); // Mostra notificação de processamento
            // Criar FormData e submeter
            const formData = new FormData(e.target);
            images.forEach(img => {
                formData.append('images', img.file); // Adiciona imagens ao FormData
            });
            formData.set("price", productPrice); // Define o preço
            formAction(formData); // Chama ação do formulário
        } else {
            notify.imageRequired(); // Notifica que imagem é obrigatória
        }
    };

    // Efeito que processa o resultado da criação do produto
    useEffect(() => {
        if (formState.message !== '') {
            setLoading(false); // Para loading
            if (formState.message === 'product-created') {
                notify.productCreated(); // Notifica sucesso
                redirect(`/dashboard/catalogs/${catalog.id}#products-table`); // Redireciona para tabela de produtos
            } else if (formState.message === 'product-already-exists') {
                setError("Você já tem um produto igual a este no catálogo selecionado."); // Erro de duplicação
            } else if (formState.message === 'invalid-params') {
                setError("Informações fornecidas inválidas."); // Erro de parâmetros inválidos
            }
        }
    }, [formState]); // Executa quando formState muda

    return (
        <div>
            {/* Título da página com nome do catálogo */}
            <h1 className="text-3xl font-black mb-2">Crie um produto para o catálogo {catalog.name}</h1>
            {/* Container principal do formulário */}
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap">
                <div className="flex flex-col w-full">
                    {/* Formulário de criação do produto */}
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
                            onSubmit={() => setLoading(true)} // Marca como carregando ao submeter
                            submitText="Criar produto"
                        >
                        {/* Container para variações do produto */}
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