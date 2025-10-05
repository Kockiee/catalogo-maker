/**
 * Container para criação de catálogos
 * 
 * Este arquivo contém o componente principal para criar novos catálogos.
 * Inclui formulário completo com campos de texto, upload de imagem,
 * seleção de cores e pré-visualização em tempo real do catálogo.
 * 
 * Funcionalidades principais:
 * - Formulário completo de criação de catálogo
 * - Upload e pré-visualização de banner
 * - Seleção de cores personalizadas
 * - Pré-visualização em tempo real
 * - Validação de dados e tratamento de erros
 * - Integração com sistema de notificações
 */

'use client'
// Importa componente Button do Flowbite
import { Button } from "flowbite-react";
// Importa hooks do React para estado e efeitos
import { useEffect, useState } from "react";
// Importa ação para criar catálogo
import { createCatalog } from "@/app/actions/createCatalog";
// Importa contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importa hook useFormState do React DOM
import { useFormState } from 'react-dom';
// Importa contexto de ferramentas
import { useTool } from "@/app/contexts/ToolContext";
// Importa hook de notificações
import { useNotifications } from "@/app/hooks/useNotifications";
// Importa função de redirecionamento do Next.js
import { redirect } from "next/navigation";
// Importa componente de card de erro
import ErrorCard from "@/app/auth/components/ErrorCard";
// Importa componente de campo de formulário
import FormField from "@/app/components/FormField";
// Importa componente de upload de imagem
import ImageUpload from "@/app/components/ImageUpload";
// Importa componente de seleção de cores
import ColorPickerGroup from "@/app/components/ColorPickerGroup";
// Importa componente de pré-visualização do catálogo
import CatalogPreview from "@/app/components/CatalogPreview";


// Componente principal para criação de catálogos
export default function CreateCatalogContainer() {
    // Estado para o nome da loja
    const [storeName, setStoreName] = useState("");
    // Estado para a descrição da loja
    const [storeDescription, setStoreDescription] = useState("");
    // Estado para as cores do catálogo com valores padrão
    const [colors, setColors] = useState({
        primaryColor: "#bfd7ff", // Cor primária (azul claro)
        secondaryColor: "#5465ff", // Cor secundária (azul)
        tertiaryColor: "#788bff", // Cor terciária (azul médio)
        textColor: "#ffffff" // Cor do texto (branco)
    });
    // Estado para a imagem do banner
    const [bannerImage, setBannerImage] = useState(null);
    // Extrai dados do usuário do contexto de autenticação
    const { user } = useAuth();
    // Extrai função de atualização de catálogos do contexto de ferramentas
    const { updateCatalogs } = useTool();
    // Estado de loading durante criação
    const [loading, setLoading] = useState(false);
    // Estado para mensagens de erro
    const [error, setError] = useState("");
    // Hook para exibir notificações ao usuário
    const { notify } = useNotifications();

    // Função que atualiza uma cor específica
    const handleColorChange = (colorKey, value) => {
        setColors(prev => ({ ...prev, [colorKey]: value }));
    };


    // Hook para gerenciar o estado do formulário e ações
    const [formState, formAction] = useFormState((state, formdata) => {
        if (bannerImage) {
            notify.processing("Criando catálogo..."); // Mostra notificação de processamento
            return createCatalog(state, formdata, user.uid); // Chama ação de criação
        } else {
            setError("Você precisa selecionar uma imagem para ser o banner do catálogo") // Define erro se não há imagem
        }
    }, {message: ''});

    // Efeito que processa o resultado da criação do catálogo
    useEffect(() => {
        if (formState.message !== '') {
            if (formState.message === 'catalog-created') {
                notify.catalogCreated(); // Notifica sucesso
                updateCatalogs(); // Atualiza lista de catálogos
                redirect(`/dashboard/catalogs`); // Redireciona para página de catálogos
            } else if (formState.message === 'catalog-already-exists') {
                setError("Você já tem um catálogo com essas informações."); // Erro de duplicação
            } else if (formState.message === 'invalid-params') {
                setError("Informações de catálogo inválidas."); // Erro de parâmetros inválidos
            }
        }
    }, [formState]); // Executa quando formState muda

    return (
        <div className="w-full">
            {/* Título principal da página */}
            <h1 className="text-3xl font-black mb-6 text-primary-800">Crie um catálogo agora.</h1>
            {/* Container principal do formulário */}
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
                {/* Grid responsivo com formulário e pré-visualização */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
                    {/* Coluna do formulário */}
                    <div className="flex flex-col">
                    {/* Formulário de criação do catálogo */}
                    <form 
                    onSubmit={() => setLoading(true)} // Define loading ao submeter
                    action={(formdata) => formAction(formdata)} // Ação do formulário
                    className="space-y-6">
                        {/* Campo de nome de identificação */}
                        <FormField
                            label="Nome de identificação"
                            name="identificationName"
                            id="identification-name"
                            onChange={() => {
                                setError("") // Limpa erro ao digitar
                            }}
                            placeholder="Catálogo01"
                            maxLength={50}
                            disabled={loading}
                            required
                        />
                        
                        {/* Campo de nome da loja */}
                        <FormField
                            label="Nome da loja"
                            name="storeName"
                            id="store-name"
                            value={storeName}
                            onChange={(e) => {
                                setError("") // Limpa erro ao digitar
                                setStoreName(e.target.value); // Atualiza estado
                            }}
                            placeholder="Mister Store"
                            maxLength={40}
                            disabled={loading}
                            required
                        />
                        
                        {/* Campo de descrição da loja */}
                        <FormField
                            type="textarea"
                            label="Descrição da loja"
                            name="storeDescription"
                            id="store-description"
                            value={storeDescription}
                            onChange={(e) => {
                                setError("") // Limpa erro ao digitar
                                setStoreDescription(e.target.value); // Atualiza estado
                            }}
                            placeholder="Uma loja de roupas, calçados e acessórios..."
                            rows={4}
                            maxLength={2000}
                            disabled={loading}
                            required
                        />
                        
                        {/* Campo de upload de banner */}
                        <ImageUpload
                            label="Banner"
                            name="bannerImage"
                            id="store-banner"
                            onChange={e => {
                                setError("") // Limpa erro ao selecionar
                                const file = e.target.files[0] // Pega o arquivo selecionado
                                const reader = new FileReader(); // Cria leitor de arquivo

                                reader.onloadend = () => {
                                    setBannerImage(reader.result); // Atualiza estado com resultado
                                };
                                if (file) { 
                                    reader.readAsDataURL(file); // Lê arquivo como data URL
                                }
                            }}
                            disabled={loading}
                            required
                            helperText="O banner que deve aparecer no topo do catálogo"
                        />
                        
                        {/* Grupo de seleção de cores */}
                        <ColorPickerGroup
                            colors={colors}
                            onColorChange={handleColorChange}
                            disabled={loading}
                        />
                        
                        {/* Botão de submit e card de erro */}
                        <div className="py-2 w-full">
                            <ErrorCard error={error}/>
                            <Button 
                                aria-disabled={loading} 
                                type="submit" 
                                className="shadow-md hover:shadow-md hover:shadow-cornflowerblue/50 bg-neonblue duration-200 hover:!bg-cornflowerblue focus:ring-jordyblue w-full" 
                                size="lg"
                            >
                                {loading ? "Criando catálogo..." : "Criar catálogo"}
                            </Button>
                        </div>
                    </form>
                    </div>
                    {/* Coluna da pré-visualização */}
                    <div className="flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 text-primary-800">Pré-visualização</h2>
                        {/* Container sticky para pré-visualização */}
                        <div className="sticky top-4">
                            <CatalogPreview
                                storeName={storeName}
                                storeDescription={storeDescription}
                                primaryColor={colors.primaryColor}
                                secondaryColor={colors.secondaryColor}
                                tertiaryColor={colors.tertiaryColor}
                                textColor={colors.textColor}
                                bannerImage={bannerImage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};