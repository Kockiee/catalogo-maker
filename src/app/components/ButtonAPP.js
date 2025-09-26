'use client' // Diretiva para indicar que este código executa no cliente
import { Button } from "flowbite-react"; // Importação do componente Button da biblioteca Flowbite React
import Link from "next/link"; // Importação do componente Link do Next.js para navegação

/**
 * Componente de botão personalizado que pode funcionar como botão normal ou link
 * @param {ReactNode} children - Conteúdo interno do botão
 * @param {boolean} negative - Define se o botão terá estilo negativo (vermelho)
 * @param {Function} onClick - Função de callback para o evento de clique
 * @param {string|null} href - URL para navegação (se fornecido, o botão se comporta como link)
 * @param {string} target - Alvo do link (_blank, _self, etc)
 * @param {string} className - Classes CSS adicionais
 * @param {string} type - Tipo do botão (submit, button, reset)
 * @param {boolean} disabled - Define se o botão está desabilitado
 */
export default function ButtonAPP({children, negative=false, onClick=() => {}, href=null, target, className="", type="submit", disabled=false}) {
    return (
        <>
            {href ? ( // Verifica se o href foi fornecido para determinar se é um link ou botão
                <Link href={href} target={target} className={className}> {/* Renderiza como Link se href estiver presente */}
                    <Button
                    disabled={disabled} // Define se o botão está desabilitado
                    className={`w-full h-full flex items-center duration-200 !border-b-4 ${negative ? '!bg-red-500 hover:!bg-red-600 focus:!ring-red-400' : '!bg-neonblue hover:!bg-neonblue/90 focus:!ring-periwinkle'}`} // Aplica estilos condicionais baseados na prop negative
                    onClick={onClick}> {/* Manipulador de evento de clique */}
                        {children} {/* Renderiza o conteúdo interno do botão */}
                    </Button>
                </Link>
            ) : ( // Caso contrário, renderiza como botão normal
                <Button 
                disabled={disabled} // Define se o botão está desabilitado
                type={type} // Define o tipo do botão (submit, button, reset)
                className={`${className} flex items-center duration-200 !border-b-4 ${negative ? '!bg-red-500 hover:!bg-red-600 focus:!ring-red-400' : '!bg-neonblue hover:!bg-neonblue/90 focus:!ring-periwinkle'}`} // Aplica estilos condicionais e classes adicionais
                onClick={onClick} // Manipulador de evento de clique
                >
                    {children} {/* Renderiza o conteúdo interno do botão */}
                </Button>
            )}
        </>
    )
}