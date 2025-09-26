/**
 * @type {import('next').NextConfig}
 * Configuração do Next.js para a aplicação Catálogo Maker
 */
const nextConfig = {
    // Configurações para otimização de imagens
    images: {
        // Padrões de domínios remotos permitidos para carregamento de imagens
        // Essencial para carregar imagens do Firebase Storage
        remotePatterns: [
            {
                protocol: 'https',                          // Protocolo seguro obrigatório
                hostname: 'firebasestorage.googleapis.com', // Domínio do Firebase Storage
                port: ''                                    // Porta vazia = usar padrão (443)
            },
        ],
    },
    // Configurações adicionais podem ser adicionadas conforme necessário
    // Exemplo: configurações de build, redirects, rewrites, etc.
};

export default nextConfig;
