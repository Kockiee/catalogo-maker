/**
 * COMPONENTE DE PROVIDERS
 * 
 * Este arquivo contém o componente que agrupa todos os providers de contexto
 * da aplicação. Atualmente inclui apenas o AuthProvider, mas pode ser
 * expandido para incluir outros providers conforme necessário.
 * 
 * Funcionalidades:
 * - Wrapper para providers de contexto
 * - Centralização de providers
 * - Facilita adição de novos providers
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente

import { AuthProvider } from "../contexts/AuthContext" // Importa o provider de autenticação

export default function Providers({children}) {
    return (
        <AuthProvider> {/* Wrapper do provider de autenticação */}
            {children} {/* Conteúdo que recebe o contexto */}
        </AuthProvider>
    )
}