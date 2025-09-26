'use client'

import { AuthProvider } from "../contexts/AuthContext"

export default function Providers({children}) {
    // Componente que encapsula o contexto de autenticação para os filhos
    return (
        <AuthProvider>
            {children} {/* Renderiza os componentes filhos dentro do contexto de autenticação */}
        </AuthProvider>
    )
}