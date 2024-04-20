import CatalogNavbar from "./CatalogNavbar";
import CatalogCart from "./CatalogCart";
import { cloneElement } from "react";

export default async function CatalogContainer({children, catalogId}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/catalogs/get-catalog/${catalogId}`);
    const catalog = await response.json();

    return (
        <>
            <CatalogNavbar catalog={catalog}/>
            <div
            className="min-h-screen"
            style={{color: catalog.text_color, backgroundColor: catalog.primary_color}}>
                <CatalogCart catalog={catalog}/>
                <div className="pt-2 px-4 w-full flex justify-center">
                    <div className="max-w-7xl w-full">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}