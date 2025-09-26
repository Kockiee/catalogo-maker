'use client'
// Importação do hook useRouter do Next.js para navegação
import { useRouter } from "next/navigation";
// Importação do hook useEffect do React
import { useEffect } from "react";
// Importação do ícone de verificação
import { MdVerified } from "react-icons/md";

/**
 * Página de confirmação de pagamento concluído
 * Exibe mensagem de sucesso e redireciona automaticamente para o dashboard
 * @returns {JSX.Element} Interface de confirmação de pagamento
 */
export default function PAGE() {
    // Hook para navegação programática
    const router = useRouter();

    /**
     * Efeito para redirecionamento automático após 3 segundos
     * Garante que o usuário volte ao dashboard após ver a confirmação
     */
    useEffect(() => {
        // Timer para redirecionamento automático
        setTimeout(() => {
            router.push('/dashboard')  // Redireciona para dashboard principal
        }, 3000)  // 3 segundos de delay
    }, [])  // Array vazio = executa apenas na montagem

    // Renderiza a interface de confirmação
    return (
        <div className="w-full h-full flex justify-center">
            <div className="flex flex-col items-center">
                {/* Ícone de verificação verde indicando sucesso */}
                <MdVerified className="w-32 h-32 text-green-400"/>
                {/* Mensagem de confirmação */}
                <p className="text-xl">Parabéns, sua conta agora é premium !!!</p>
                {/* Mensagem de redirecionamento */}
                <p>Estamos de redirecionando para o painel de controle...</p>
            </div>
        </div>
    )
}