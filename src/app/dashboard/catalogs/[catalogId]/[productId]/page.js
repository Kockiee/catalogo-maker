import EditProductContainer from "@/app/components/EditProductContainer"

export default function PAGE({params}) {
    const catalogId = params.catalogId
    const productId = params.productId
    return (
        <EditProductContainer catalogId={catalogId} productId={productId}/>
    )
}