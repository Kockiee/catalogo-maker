import CatalogProductsGrid from "@/app/catalog/components/CatalogProductsGrid";

export default async function PAGE({params}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${params.catalogId}`);
    const catalog = await response.json()

    return(
        <div>
            <div className="bg-cover bg-center w-full h-56 mb-8 rounded" style={{backgroundImage: `url("${catalog.banner_url}")`}}></div>
            <CatalogProductsGrid catalog={catalog}/>
        </div>
    );
}