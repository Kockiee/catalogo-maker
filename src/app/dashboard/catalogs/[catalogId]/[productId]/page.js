'use client'
import EditProductContainer from "@/app/components/EditProductContainer"
import { useTool } from "@/app/contexts/ToolContext";

export default function PAGE({params}) {
    const catalogId = params.catalogId
    const productId = params.productId
    return (
        <EditProductContainer catalogId={catalogId} productId={productId}/>
    )
}