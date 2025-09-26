'use client'
// Importação do hook useRouter do Next.js para navegação
import { useRouter } from "next/navigation"
// Importação do ícone de seta para esquerda
import { HiArrowLeft } from "react-icons/hi"
// Importação do componente ButtonAPP personalizado
import ButtonAPP from "../../components/ButtonAPP";

/**
 * Componente de botão para voltar à página anterior
 * Utiliza o histórico de navegação do navegador para retornar
 * @returns {JSX.Element} Botão de voltar estilizado
 */
export default function BackButton() {
    // Hook para acessar funções de navegação
    const router = useRouter();

    /**
     * Função para lidar com o clique no botão
     * Volta para a página anterior no histórico de navegação
     */
    const handleClick = () => {
        router.back();  // Navega para a página anterior
    }

    // Renderiza o botão de voltar
    return (
        <ButtonAPP onClick={handleClick} className="mb-4">
            <HiArrowLeft className="h-6 w-6 mr-0.5"/> Voltar  {/* Ícone e texto */}
        </ButtonAPP>
    )
}