'use client'
import { useTool } from "../../contexts/ToolContext";
import { FullScreenLoader } from "../../components/LoadingSpinner";
import SideBar from "./SideBar";
import BackButton from "./BackButton";
import { useState, useEffect } from "react";

export default function ToolContainer({children}) {
    const { catalogs } = useTool();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Detectar se estamos em mobile/tablet
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
        {catalogs === false ? (
            <FullScreenLoader message="Carregando o dashboard..." />
        ) : (
            <>
                <div className="w-full min-h-screen">
                    <SideBar onToggle={setSidebarOpen} />
                    <div className={`
                        transition-all duration-300 ease-in-out
                        ${isMobile 
                            ? 'p-4 pt-20' 
                            : sidebarOpen 
                                ? 'p-4 lg:p-16 pl-4 lg:pl-80' 
                                : 'p-4 lg:p-16 pl-4 lg:pl-20'
                        }
                        pb-48 min-h-screen
                    `}>
                        <BackButton/>
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