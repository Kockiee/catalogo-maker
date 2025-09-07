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
        <div className="w-1/2 max-xl:w-full max-xl:mt-6 max-xl:pl-0 pl-8">
            <p className="text-lg mb-2">Pré-visualização:</p>
            <div 
                className="w-full relative p-4 rounded-lg shadow-md" 
                style={{backgroundColor: primaryColor, color: textColor}}
            >
                <div 
                    className="p-4 absolute w-full top-0 right-0 rounded-lg flex items-center justify-between" 
                    style={{backgroundColor: secondaryColor}}
                >
                    <h1 className="font-bold break-all">{storeName}</h1>
                    <div 
                        className="relative w-64 p-5 rounded-lg" 
                        style={{backgroundColor: primaryColor}}
                    >
                        <BiSearch className="absolute top-3 right-3"/>
                    </div>
                </div>
                <div className="py-[72px] flex flex-wrap text-sm">
                    <div 
                        className="p-4 w-full h-16 rounded-lg flex justify-center items-center bg-cover bg-center" 
                        style={{
                            backgroundColor: tertiaryColor, 
                            backgroundImage: bannerImage ? `url(${bannerImage})` : 'none'
                        }}
                    />
                    <div 
                        className="p-2 rounded-lg flex flex-col m-2" 
                        style={{
                            color: textColor === primaryColor ? "#000000" : textColor, 
                            border: `2px solid ${tertiaryColor}`
                        }}
                    >
                        <div className="w-full h-full rounded-lg p-8">Imagem de produto</div>
                        <p>Nome de um produto</p>
                        <p>R$0.00</p>
                    </div>
                    <div 
                        className="p-2 rounded-lg flex flex-col m-2" 
                        style={{
                            color: textColor === primaryColor ? "#000000" : textColor, 
                            border: `2px solid ${tertiaryColor}`
                        }}
                    >
                        <div className="w-full h-full rounded-lg p-8">Imagem de produto</div>
                        <p>Nome de um produto</p>
                        <p>R$0.00</p>
                    </div>
                </div>
                <div 
                    className="w-full p-2 rounded-lg flex flex-col text-sm" 
                    style={{backgroundColor: secondaryColor}}
                >
                    <h1 className="font-bold break-all">{storeName}</h1>
                    <p className="break-all">{storeDescription}</p>
                </div>
            </div>
            <p className="text-base inline-flex mt-2">
                <HiInformationCircle className="w-6 h-6 mr-1"/> 
                Isto é uma versão simplificada
            </p>
        </div>
    );
}
