'use client'
import { BiSearch } from "react-icons/bi";
import { HiInformationCircle } from "react-icons/hi";

export default function CatalogPreview({ 
    storeName, 
    storeDescription, 
    primaryColor, 
    secondaryColor, 
    tertiaryColor, 
    textColor, 
    bannerImage 
}) {
    return (
        <div className="w-full">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div 
                className="w-full relative" 
                style={{backgroundColor: primaryColor, color: textColor}}
            >
                <div 
                    className="p-4 w-full flex items-center justify-between" 
                    style={{backgroundColor: secondaryColor}}
                >
                    <h1 className="font-bold text-lg truncate">{storeName || "Nome da Loja"}</h1>
                    <div 
                        className="relative w-48 p-3 rounded-lg" 
                        style={{backgroundColor: primaryColor}}
                    >
                        <BiSearch className="absolute top-2 right-2 text-gray-600"/>
                    </div>
                </div>
                <div className="p-4">
                    <div 
                        className="w-full h-24 rounded-lg flex justify-center items-center bg-cover bg-center mb-4" 
                        style={{
                            backgroundColor: tertiaryColor, 
                            backgroundImage: bannerImage ? `url(${bannerImage})` : 'none'
                        }}
                    >
                        {!bannerImage && (
                            <span className="text-gray-500 text-sm">Banner da loja</span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div 
                            className="p-3 rounded-lg flex flex-col" 
                            style={{
                                color: textColor === primaryColor ? "#000000" : textColor, 
                                border: `2px solid ${tertiaryColor}`
                            }}
                        >
                            <div className="w-full h-16 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 mb-2">
                                Imagem
                            </div>
                            <p className="text-sm font-medium">Produto 1</p>
                            <p className="text-sm">R$ 0,00</p>
                        </div>
                        <div 
                            className="p-3 rounded-lg flex flex-col" 
                            style={{
                                color: textColor === primaryColor ? "#000000" : textColor, 
                                border: `2px solid ${tertiaryColor}`
                            }}
                        >
                            <div className="w-full h-16 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 mb-2">
                                Imagem
                            </div>
                            <p className="text-sm font-medium">Produto 2</p>
                            <p className="text-sm">R$ 0,00</p>
                        </div>
                    </div>
                </div>
                <div 
                    className="w-full p-4 flex flex-col text-sm" 
                    style={{backgroundColor: secondaryColor}}
                >
                    <h1 className="font-bold text-lg">{storeName || "Nome da Loja"}</h1>
                    <p className="text-sm mt-1">{storeDescription || "Descrição da loja aparecerá aqui"}</p>
                </div>
            </div>
            </div>
            <p className="text-sm text-gray-600 inline-flex items-center mt-3">
                <HiInformationCircle className="w-4 h-4 mr-1"/> 
                Isto é uma versão simplificada
            </p>
        </div>
    );
}
