/**
 * Container principal de ferramentas do dashboard
 * 
 * Este arquivo contém o container principal que gerencia o layout
 * do dashboard, incluindo a sidebar, botão de voltar e responsividade.
 * Controla o estado da sidebar e adapta o layout para diferentes
 * tamanhos de tela.
 * 
 * Funcionalidades principais:
 * - Gerenciamento do layout responsivo
 * - Controle da sidebar (aberta/fechada)
 * - Detecção de dispositivos móveis
 * - Botão de voltar
 * - Loading states
 */

'use client'
// Importa contexto de ferramentas
import { useTool } from "../../contexts/ToolContext";
// Importa componente de loading em tela cheia
import { FullScreenLoader } from "../../components/LoadingSpinner";
// Importa componente da sidebar
import SideBar from "./SideBar";
// Importa componente do botão de voltar
import BackButton from "./BackButton";
// Importa hooks do React para estado e efeitos
import { useState, useEffect } from "react";

// Componente principal do container de ferramentas
export default function ToolContainer({children}) {
    // Extrai catálogos do contexto de ferramentas
    const { catalogs } = useTool();
    // Estado que controla se a sidebar está aberta
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Estado para detectar se estamos em mobile/tablet
    const [isMobile, setIsMobile] = useState(false);

    // Efeito que detecta o tamanho da tela e ajusta o layout
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // Considera mobile se largura < 1024px
        };
        
        checkMobile(); // Verifica na montagem
        window.addEventListener('resize', checkMobile); // Adiciona listener para mudanças de tamanho
        
        return () => window.removeEventListener('resize', checkMobile); // Remove listener na desmontagem
    }, []);

    return (
        <>
        {/* Se catálogos ainda estão carregando, mostra loading */}
        {catalogs === false ? (
            <FullScreenLoader message="Carregando o dashboard..." />
        ) : (
            <>
                <div className="w-full min-h-screen">
                    {/* Sidebar com callback para controlar estado */}
                    <SideBar onToggle={setSidebarOpen} />
                    {/* Container principal com padding responsivo */}
                    <div className={`
                        transition-all duration-300 ease-in-out
                        ${isMobile 
                            ? 'p-4 pt-20' // Mobile: padding menor com espaço para header
                            : sidebarOpen 
                                ? 'p-4 lg:p-16 pl-4 lg:pl-80' // Desktop com sidebar aberta
                                : 'p-4 lg:p-16 pl-4 lg:pl-20' // Desktop com sidebar fechada
                        }
                        pb-48 min-h-screen
                    `}>
                        {/* Botão de voltar */}
                        <BackButton/>
                        {/* Container do conteúdo com largura máxima */}
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </>
        )}
        </>
    )
}