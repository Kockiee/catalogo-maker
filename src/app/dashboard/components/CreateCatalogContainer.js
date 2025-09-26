'use client'
// Importação de componentes do Flowbite React
import { Button } from "flowbite-react";
// Importação de hooks do React para estado e efeitos
import { useEffect, useState } from "react";
// Importação da ação do servidor para criar catálogo
import { createCatalog } from "@/app/actions/createCatalog";
// Importação do contexto de autenticação
import { useAuth } from "@/app/contexts/AuthContext";
// Importação do hook useFormState para gerenciar estado de formulários
import { useFormState } from 'react-dom';
// Importação do contexto de ferramentas do dashboard
import { useTool } from "@/app/contexts/ToolContext";
// Importação do hook personalizado para notificações
import { useNotifications } from "@/app/hooks/useNotifications";
// Importação da função de redirecionamento do Next.js
import { redirect } from "next/navigation";
// Importação de componentes de erro e formulário
import ErrorCard from "@/app/auth/components/ErrorCard";
import FormField from "@/app/components/FormField";
import ImageUpload from "@/app/components/ImageUpload";
import ColorPickerGroup from "@/app/components/ColorPickerGroup";
import CatalogPreview from "@/app/components/CatalogPreview";

/**
 * Componente container para criar um novo catálogo
 * Gerencia o estado do formulário, validação e envio dos dados
 * @returns {JSX.Element} Interface de criação de catálogo
 */
export default function CreateCatalogContainer() {
    // Estados para armazenar os dados do formulário
    const [storeName, setStoreName] = useState("");           // Nome da loja
    const [storeDescription, setStoreDescription] = useState(""); // Descrição da loja
    // Estado para armazenar as cores personalizadas do catálogo
    const [colors, setColors] = useState({
        primaryColor: "#bfd7ff",   // Cor de fundo principal (azul claro)
        secondaryColor: "#5465ff", // Cor do cabeçalho (azul neon)
        tertiaryColor: "#788bff",  // Cor dos detalhes (azul médio)
        textColor: "#ffffff"       // Cor do texto (branco)
    });
    const [bannerImage, setBannerImage] = useState(null);     // Imagem do banner
    // Hooks para acessar dados do usuário e funções do contexto
    const { user } = useAuth();                              // Dados do usuário autenticado
    const { updateCatalogs } = useTool();                    // Função para atualizar lista de catálogos
    const [loading, setLoading] = useState(false);           // Estado de carregamento
    const [error, setError] = useState("");                  // Mensagens de erro
    const { notify } = useNotifications();                   // Funções de notificação

    /**
     * Função para lidar com mudanças nas cores do catálogo
     * Atualiza o estado de cores dinamicamente
     * @param {string} colorKey - Chave da cor a ser alterada
     * @param {string} value - Novo valor da cor em formato hexadecimal
     */
    const handleColorChange = (colorKey, value) => {
        setColors(prev => ({ ...prev, [colorKey]: value }));
    };

    /**
     * Configuração do estado do formulário usando useFormState
     * Define a lógica de validação e envio do formulário
     */
    const [formState, formAction] = useFormState((state, formdata) => {
        // Valida se a imagem do banner foi selecionada
        if (bannerImage) {
            // Mostra notificação de processamento
            notify.processing("Criando catálogo...");
            // Chama a ação do servidor para criar o catálogo
            return createCatalog(state, formdata, user.uid);
        } else {
            // Define erro se não há imagem do banner
            setError("Você precisa selecionar uma imagem para ser o banner do catálogo")
        }
    }, {message: ''});

    /**
     * Efeito para lidar com respostas do servidor após envio do formulário
     * Processa diferentes tipos de resposta e executa ações apropriadas
     */
    useEffect(() => {
        // Verifica se há uma mensagem de resposta do servidor
        if (formState.message !== '') {
            // Catálogo criado com sucesso
            if (formState.message === 'catalog-created') {
                notify.catalogCreated();     // Mostra notificação de sucesso
                updateCatalogs();           // Atualiza lista de catálogos no contexto
                redirect(`/dashboard/catalogs`); // Redireciona para lista de catálogos
            } else if (formState.message === 'catalog-already-exists') {
                setError("Você já tem um catálogo com essas informações.");
            } else if (formState.message === 'invalid-params') {
                setError("Informações de catálogo inválidas.");
            }
        }
    }, [formState]);

    // Renderiza a interface de criação de catálogo
    return (
        <div>
            {/* Título da página */}
            <h1 className="text-3xl font-black mb-2">Crie um catálogo agora.</h1>
            {/* Container principal com layout flexível */}
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-wrap">
                {/* Seção do formulário - ocupa metade da largura em telas grandes */}
                <div className="flex flex-col w-1/2 max-xl:w-full">
                    {/* Formulário para criação do catálogo */}
                    <form
                    onSubmit={() => setLoading(true)}  // Define loading como true ao submeter
                    action={(formdata) => formAction(formdata)}> {/* Ação do formulário */}
                        {/* Campo para nome de identificação do catálogo */}
                        <FormField
                            label="Nome de identificação"
                            name="identificationName"
                            id="identification-name"
                            onChange={() => { setError("") }}  // Limpa erros ao digitar
                            placeholder="Catálogo01"
                            maxLength={50}
                            disabled={loading}
                            required
                        />

                        {/* Campo para nome da loja */}
                        <FormField
                            label="Nome da loja"
                            name="storeName"
                            id="store-name"
                            value={storeName}
                            onChange={(e) => {
                                setError("");                    // Limpa erros
                                setStoreName(e.target.value);    // Atualiza estado
                            }}
                            placeholder="Mister Store"
                            maxLength={40}
                            disabled={loading}
                            required
                        />

                        {/* Campo para descrição da loja */}
                        <FormField
                            type="textarea"
                            label="Descrição da loja"
                            name="storeDescription"
                            id="store-description"
                            value={storeDescription}
                            onChange={(e) => {
                                setError("");                        // Limpa erros
                                setStoreDescription(e.target.value); // Atualiza estado
                            }}
                            placeholder="Uma loja de roupas, calçados e acessórios..."
                            rows={4}
                            maxLength={2000}
                            disabled={loading}
                            required
                        />

                        {/* Campo para upload da imagem do banner */}
                        <ImageUpload
                            label="Banner"
                            name="bannerImage"
                            id="store-banner"
                            onChange={e => {
                                setError("");                    // Limpa erros
                                const file = e.target.files[0];  // Obtém o arquivo selecionado
                                const reader = new FileReader(); // Cria leitor de arquivo

                                // Callback quando o arquivo é carregado
                                reader.onloadend = () => {
                                    setBannerImage(reader.result); // Atualiza preview da imagem
                                };
                                // Se há arquivo, lê como URL de dados
                                if (file) {
                                    reader.readAsDataURL(file);
                                }
                            }}
                            disabled={loading}
                            required
                            helperText="O banner que deve aparecer no topo do catálogo"
                        />

                        {/* Componente para seleção de cores do catálogo */}
                        <ColorPickerGroup
                            colors={colors}
                            onColorChange={handleColorChange}
                            disabled={loading}
                        />

                        {/* Container para erros e botão de submit */}
                        <div className="py-2 w-full">
                            {/* Componente para exibir erros */}
                            <ErrorCard error={error}/>
                            {/* Botão para criar o catálogo */}
                            <Button
                                aria-disabled={loading}  // Acessibilidade para estado desabilitado
                                type="submit"
                                className="shadow-md hover:shadow-md hover:shadow-cornflowerblue/50 bg-neonblue duration-200 hover:!bg-cornflowerblue focus:ring-jordyblue w-full"
                                size="lg"
                            >
                                {/* Texto dinâmico baseado no estado de loading */}
                                {loading ? "Criando catálogo..." : "Criar catálogo"}
                            </Button>
                        </div>
                    </form>
                </div>
                {/* Seção de preview do catálogo - ocupa a outra metade */}
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
    );
};