import CreateProductContainer from "@/app/dashboard/catalogs/components/CreateProductContainer"

export default function PAGE({params}) {
    return (
        <CreateProductContainer catalogId={params.catalogId}/>
    )
}