'use client'
import EditProductContainer from "@/app/dashboard/catalogs/components/EditProductContainer"
import { useTool } from "@/app/contexts/ToolContext";

export default function PAGE({params}) {
    const catalogId = params.catalogId
    const productId = params.productId
    return (
        <EditProductContainer catalogId={catalogId} productId={productId}/>
    )
}