/**
 * LAYOUT DO CATÁLOGO - ESTRUTURA PRINCIPAL
 * 
 * Este arquivo define o layout principal para todas as páginas de um catálogo
 * específico. É um componente de layout que envolve todas as páginas do catálogo
 * com funcionalidades comuns como navegação, carrinho e contexto de dados.
 * 
 * Funcionalidades:
 * - Define a estrutura comum para todas as páginas do catálogo
 * - Fornece contexto de dados do catálogo para componentes filhos
 * - Gera metadados dinâmicos baseados no catálogo
 * - Configura cache e revalidação de dados
 * - Inclui navegação e carrinho de compras
 */

// Importa o componente container principal do catálogo
import CatalogContainer from "@/app/catalog/components/CatalogContainer";
// Importa o provider de contexto do catálogo
import { CatalogProvider } from "../../contexts/CatalogContext";

// Define o tempo de revalidação do cache em segundos (5 minutos)
export const revalidate = 300;

// Função que gera metadados dinâmicos para SEO baseados no catálogo
export async function generateMetadata({ params }) {
  // Extrai o ID do catálogo dos parâmetros da URL
  const id = params.catalogId;

  // Faz uma requisição para buscar os dados do catálogo
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${id}`);
  // Converte a resposta em formato JSON
  const catalog = await response.json()

  // Retorna os metadados que serão usados para SEO
  return {
    title: {
      default: catalog.store_name, // Título padrão será o nome da loja
      template: `%s - ${catalog.store_name}` // Template para títulos de páginas filhas
    },
    description: catalog.store_description, // Descrição será a descrição da loja
  };
}

// Componente de layout principal do catálogo
export default function LAYOUT({children, params}) {
    return (
        // Provider de contexto que disponibiliza dados do catálogo para todos os componentes filhos
        <CatalogProvider>
            {/* Container principal que inclui navegação, carrinho e estrutura do catálogo */}
            <CatalogContainer catalogId={params.catalogId}>
                {/* Renderiza as páginas filhas (children) dentro do layout */}
                {children}
            </CatalogContainer>
        </CatalogProvider>
    )
}