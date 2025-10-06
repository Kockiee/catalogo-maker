/**
 * Página de confirmação de pagamento concluído
 * 
 * Este arquivo contém a página que é exibida após o usuário
 * concluir com sucesso o pagamento de um plano. Mostra uma
 * mensagem de parabéns e redireciona automaticamente para
 * o dashboard após 3 segundos.
 * 
 * Funcionalidades principais:
 * - Exibe confirmação de pagamento bem-sucedido
 * - Redirecionamento automático para o dashboard
 * - Interface visual com ícone de verificação
 * - Mensagem de parabéns para o usuário
 */

'use client'
// Importa hook de navegação do Next.js
import { useRouter } from "next/navigation";
// Importa hook useEffect do React
import { useEffect } from "react";
// Importa ícone de verificação
import { MdVerified } from "react-icons/md";

// Componente principal da página de pagamento concluído
export default function PAGE() {
    // Hook para navegação programática
    const router = useRouter();

    // Efeito que redireciona para o dashboard após 3 segundos
    useEffect(() => {
        setTimeout(() => {
            router.push('/dashboard') // Redireciona para o dashboard
        }, 3000) // Aguarda 3 segundos antes de redirecionar
    }, []) // Executa apenas uma vez quando o componente é montado
    
    return (
        /* Container principal centralizado */
        <div className="w-full h-full flex justify-center">
            <div className="flex flex-col items-center">
                {/* Ícone de verificação grande e verde */}
                <MdVerified className="w-32 h-32 text-green-400"/>
                {/* Mensagem de parabéns */}
                <p className="text-xl">Parabéns, sua conta agora é premium !!!</p>
                {/* Mensagem de redirecionamento */}
                <p>Estamos de redirecionando para o painel de controle...</p>
            </div>
        </div>
    )
}