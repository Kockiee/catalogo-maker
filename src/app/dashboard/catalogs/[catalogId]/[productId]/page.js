// Indica que este arquivo é um componente cliente (necessário no Next.js 13+ 
// quando se quer usar hooks, estado ou qualquer funcionalidade que dependa do client-side)
'use client'

// Importa o componente EditProductContainer, que será responsável por renderizar 
// e gerenciar a edição de um produto específico dentro de um catálogo
import EditProductContainer from "@/app/dashboard/catalogs/components/EditProductContainer"

// Define o componente de página padrão exportado pelo Next.js.
// O nome PAGE é arbitrário, mas por convenção é usado em maiúsculas para representar um componente React.
export default function PAGE({params}) {
    
    // Extrai o parâmetro catalogId da rota dinâmica.
    // Este parâmetro é fornecido automaticamente pelo Next.js com base na URL.
    const catalogId = params.catalogId
    
    // Extrai o parâmetro productId da rota dinâmica.
    // Assim como o catalogId, vem da estrutura de rotas do Next.js.
    const productId = params.productId

    // Retorna o componente EditProductContainer, passando os IDs do catálogo e do produto como props.
    // Isso permite que o componente saiba qual produto e catálogo devem ser editados.
    return (
        <EditProductContainer catalogId={catalogId} productId={productId}/>
    )
}
