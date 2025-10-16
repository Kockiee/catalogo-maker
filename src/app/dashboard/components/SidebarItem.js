/**
 * Componente de item da sidebar
 * 
 * Este arquivo contém um componente reutilizável que representa
 * um item de navegação na sidebar. Cada item pode ter um ícone,
 * texto e link de destino, com estilos consistentes e hover effects.
 * 
 * Funcionalidades principais:
 * - Item de navegação com ícone e texto
 * - Suporte a links internos e externos
 * - Estilos consistentes com hover effects
 * - Integração com Next.js Link
 */

// Importa componente Link do Next.js para navegação
import Link from "next/link";

// Componente de item da sidebar
export default function SidebarItem({icon, text, href, target = "_self"}) {
    return (
        /* Link de navegação */
        <Link href={href} target={target}>
          {/* Container do item com estilos */}
          <div
          className="rounded-lg flex flex-row items-center bg-transparent hover:!bg-primary-400/70 duration-100 !text-white py-3 px-2">
            {/* Ícone do item */}
            {icon}
            {/* Texto do item */}
            <p className="ml-3">{text}</p>
          </div>
        </Link>
    )
}