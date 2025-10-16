/**
 * Componente de botão de voltar
 * 
 * Este arquivo contém um componente simples que renderiza
 * um botão para navegar de volta à página anterior.
 * Usa o hook useRouter do Next.js para navegação programática.
 * 
 * Funcionalidades principais:
 * - Navegação para página anterior
 * - Ícone de seta para esquerda
 * - Estilo consistente com ButtonAPP
 * - Posicionamento fixo no layout
 */

'use client'
// Importa hook de navegação do Next.js
import { useRouter } from "next/navigation"
// Importa ícone de seta para esquerda
import { HiArrowLeft } from "react-icons/hi"
// Importa componente de botão personalizado
import ButtonAPP from "../../components/ButtonAPP";

// Componente principal do botão de voltar
export default function BackButton() {
    // Hook para navegação programática
    const router = useRouter();

    // Função que executa a navegação para página anterior
    const handleClick = () => {
        router.back(); // Navega para a página anterior no histórico
    }

    return (
        /* Botão de voltar com ícone e texto */
        <ButtonAPP onClick={handleClick} className="mb-6 w-fit">
            <HiArrowLeft className="h-5 w-5 mr-2"/> Voltar
        </ButtonAPP>
    )
}