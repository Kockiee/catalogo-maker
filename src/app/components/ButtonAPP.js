/**
 * COMPONENTE DE BOTÃO PERSONALIZADO
 * 
 * Este arquivo contém um componente de botão personalizado que estende o Button do Flowbite
 * com estilos customizados e funcionalidades específicas do Catálogo Maker. O componente
 * suporta tanto botões normais quanto botões de link, com variações de estilo positivo e negativo.
 * 
 * Funcionalidades:
 * - Botões normais e de link
 * - Estilos positivo (azul) e negativo (vermelho)
 * - Suporte a navegação com Next.js Link
 * - Animações e transições suaves
 * - Estados de desabilitado
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Button } from "flowbite-react"; // Importa o componente Button do Flowbite
import Link from "next/link"; // Importa o componente Link do Next.js para navegação

export default function ButtonAPP({
    children, // Conteúdo do botão (texto, ícones, etc.)
    negative = false, // Se deve usar estilo negativo (vermelho) ao invés do positivo (azul)
    onClick = () => {}, // Função chamada quando o botão é clicado
    href = null, // URL para navegação (se fornecido, vira um link)
    target, // Target do link (ex: "_blank" para abrir em nova aba)
    className = "", // Classes CSS adicionais
    type = "submit", // Tipo do botão (submit, button, etc.)
    disabled = false // Se o botão está desabilitado
}) {
    return (
        <>
            {/* Se href foi fornecido, renderiza como link */}
            {href ? (
                <Link href={href} target={target} className={className}>
                    <Button
                        disabled={disabled} // Aplica estado desabilitado
                        className={`w-full h-full flex items-center duration-200 !border-b-4 ${
                            negative 
                                ? '!bg-error hover:!bg-error/90 focus:!ring-error/50' // Estilo negativo (vermelho)
                                : 'bg-primary-400 hover:!bg-primary-500 focus:!ring-primary-200' // Estilo positivo (azul)
                        }`} 
                        onClick={onClick} // Função de clique
                    >
                        {children} {/* Conteúdo do botão */}
                    </Button>
                </Link>
            ) : (
                /* Se não há href, renderiza como botão normal */
                <Button 
                    disabled={disabled} // Aplica estado desabilitado
                    type={type} // Tipo do botão
                    className={`${className} flex items-center duration-200 !border-b-4 ${
                        negative 
                            ? '!bg-error hover:!bg-error/90 focus:!ring-error/50' // Estilo negativo (vermelho)
                            : 'bg-primary-400 hover:!bg-primary-500 focus:!ring-primary-200' // Estilo positivo (azul)
                    }`} 
                    onClick={onClick} // Função de clique
                >
                    {children} {/* Conteúdo do botão */}
                </Button>
            )}
        </>
    )
}