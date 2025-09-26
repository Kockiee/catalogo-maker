'use client'
// Importação do contexto de ferramentas do dashboard
import { useTool } from "../../contexts/ToolContext";
// Importação do componente Spinner do Flowbite React
import { Spinner } from "flowbite-react"
// Importação do componente de barra lateral
import SideBar from "./SideBar";
// Importação do componente de botão voltar
import BackButton from "./BackButton";

/**
 * Container principal das ferramentas do dashboard
 * Gerencia o estado de carregamento dos catálogos e fornece estrutura de layout
 * @param {React.ReactNode} children - Componentes filhos a serem renderizados
 * @returns {JSX.Element} Container com sidebar e conteúdo, ou tela de carregamento
 */
export default function ToolContainer({children}) {
    // Desestruturação dos dados do contexto de ferramentas
    const { catalogs } = useTool();

    // Renderização condicional baseada no estado de carregamento dos catálogos
    return (
        <>
        {/* Estado de carregamento: exibe spinner enquanto catálogos ainda não foram carregados */}
        {catalogs === false ? (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-prussianblue">
              <Spinner className="text-lightcyan" size="xl"/>  {/* Spinner de carregamento */}
              <span>Carregando o dashboard...</span>          {/* Texto de carregamento */}
            </div>
        ) : (
            /* Layout principal quando os dados estão carregados */
            <>
                <div className="w-full">
                    <SideBar/>  {/* Barra lateral de navegação */}
                    {/* Container principal do conteúdo */}
                    <div className="p-16 max-lg:px-0 max-sm:pt-4 pl-80 pb-48">
                        <BackButton/>    {/* Botão de voltar (se aplicável) */}
                        {children}       {/* Conteúdo específico da página */}
                    </div>
                </div>
            </>
        )}
        </>
    )
}