import CreateProductContainer from "@/app/components/CreateProductContainer"

export default function PAGE({params}) {
    return (
        <CreateProductContainer catalogId={params.catalogId}/>
    )
}