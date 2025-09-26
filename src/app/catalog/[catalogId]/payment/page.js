// Este arquivo define a página de pagamento de um catálogo específico.
// Busca os dados do catálogo pelo ID e renderiza o componente de pagamento.

import CatalogPaymentPage from "@/app/catalog/components/CatalogPaymentPage";

// Metadados da página, usados para SEO e identificação do conteúdo
export const metadata = {
  title: "Pagamento",
};

// Função principal que retorna o conteúdo da página de pagamento
export default async function PAGE ({params}) {
  // Busca os dados do catálogo usando o ID recebido via parâmetro
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${params.catalogId}`);
    const catalog = await response.json()

  // Renderiza o componente de pagamento, passando os dados do catálogo
    return (
        <CatalogPaymentPage catalog={catalog} />
    )
}