// Importação do componente Link do Next.js para navegação
import Link from "next/link";

/**
 * Componente de item individual da barra lateral (sidebar)
 * Representa um link clicável com ícone e texto para navegação
 * @param {React.ReactNode} icon - Ícone a ser exibido (componente React)
 * @param {string} text - Texto descritivo do item
 * @param {string} href - URL de destino do link
 * @param {string} target - Alvo do link (_self, _blank, etc.) - padrão "_self"
 * @returns {JSX.Element} Item de navegação da sidebar
 */
export default function SidebarItem({icon, text, href, target = "_self"}) {
    // Renderiza um link com conteúdo estilizado
    return (
        <Link href={href} target={target}>
          {/* Container do item com estilos hover e layout flexível */}
          <div
          className="rounded-lg flex flex-row items-center bg-transparent hover:!bg-neonblue/70 duration-100 !text-white py-3 px-2">
            {icon}        {/* Ícone do item */}
            <p className="ml-3">{text}</p>  {/* Texto descritivo */}
          </div>
        </Link>
    )
}