/**
 * COMPONENTE DE PREVIEW DO CATÁLOGO
 * 
 * Este arquivo contém um componente que exibe uma prévia visual de como o catálogo
 * ficará para os clientes. O componente simula a aparência final do catálogo com
 * as cores, nome da loja, descrição e layout que o usuário configurou.
 * 
 * Funcionalidades:
 * - Preview visual do catálogo
 * - Aplicação das cores personalizadas
 * - Simulação de produtos
 * - Banner da loja
 * - Layout responsivo
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { BiSearch } from "react-icons/bi"; // Importa ícone de busca
import { HiInformationCircle } from "react-icons/hi"; // Importa ícone de informação

export default function CatalogPreview({ 
    storeName, // Nome da loja
    storeDescription, // Descrição da loja
    primaryColor, // Cor principal do catálogo
    secondaryColor, // Cor secundária do catálogo
    tertiaryColor, // Cor terciária do catálogo
    textColor, // Cor do texto
    bannerImage // Imagem do banner da loja
}) {
    return (
        <div className="w-full">
            {/* Container principal do preview */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {/* Área principal do catálogo com cor de fundo personalizada */}
                <div 
                    className="w-full relative" 
                    style={{backgroundColor: primaryColor, color: textColor}}
                >
                    {/* Cabeçalho do catálogo */}
                    <div 
                        className="p-4 w-full flex items-center justify-between" 
                        style={{backgroundColor: secondaryColor}}
                    >
                        {/* Nome da loja */}
                        <h1 className="font-bold text-lg truncate">{storeName || "Nome da Loja"}</h1>
                        {/* Simulação da barra de busca */}
                        <div 
                            className="relative w-48 p-3 rounded-lg" 
                            style={{backgroundColor: primaryColor}}
                        >
                            <BiSearch className="absolute top-2 right-2 text-gray-600"/> {/* Ícone de busca */}
                        </div>
                    </div>
                    
                    {/* Conteúdo principal do catálogo */}
                    <div className="p-4">
                        {/* Banner da loja */}
                        <div 
                            className="w-full h-24 rounded-lg flex justify-center items-center bg-cover bg-center mb-4" 
                            style={{
                                backgroundColor: tertiaryColor, // Cor de fundo caso não haja imagem
                                backgroundImage: bannerImage ? `url(${bannerImage})` : 'none' // Imagem do banner se disponível
                            }}
                        >
                            {/* Texto placeholder se não há banner */}
                            {!bannerImage && (
                                <span className="text-gray-500 text-sm">Banner da loja</span>
                            )}
                        </div>
                        
                        {/* Grid de produtos simulados */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Produto 1 simulado */}
                            <div 
                                className="p-3 rounded-lg flex flex-col" 
                                style={{
                                    color: textColor === primaryColor ? "#000000" : textColor, // Ajusta cor do texto se for igual à cor principal
                                    border: `2px solid ${tertiaryColor}` // Borda com cor terciária
                                }}
                            >
                                {/* Placeholder da imagem do produto */}
                                <div className="w-full h-16 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 mb-2">
                                    Imagem
                                </div>
                                <p className="text-sm font-medium">Produto 1</p> {/* Nome do produto */}
                                <p className="text-sm">R$ 0,00</p> {/* Preço do produto */}
                            </div>
                            
                            {/* Produto 2 simulado */}
                            <div 
                                className="p-3 rounded-lg flex flex-col" 
                                style={{
                                    color: textColor === primaryColor ? "#000000" : textColor, // Ajusta cor do texto se for igual à cor principal
                                    border: `2px solid ${tertiaryColor}` // Borda com cor terciária
                                }}
                            >
                                {/* Placeholder da imagem do produto */}
                                <div className="w-full h-16 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 mb-2">
                                    Imagem
                                </div>
                                <p className="text-sm font-medium">Produto 2</p> {/* Nome do produto */}
                                <p className="text-sm">R$ 0,00</p> {/* Preço do produto */}
                            </div>
                        </div>
                    </div>
                    
                    {/* Rodapé do catálogo com informações da loja */}
                    <div 
                        className="w-full p-4 flex flex-col text-sm" 
                        style={{backgroundColor: secondaryColor}}
                    >
                        <h1 className="font-bold text-lg">{storeName || "Nome da Loja"}</h1> {/* Nome da loja */}
                        <p className="text-sm mt-1">{storeDescription || "Descrição da loja aparecerá aqui"}</p> {/* Descrição da loja */}
                    </div>
                </div>
            </div>
            
            {/* Aviso de que é uma versão simplificada */}
            <p className="text-sm text-gray-600 inline-flex items-center mt-3">
                <HiInformationCircle className="w-4 h-4 mr-1"/> {/* Ícone de informação */}
                Isto é uma versão simplificada
            </p>
        </div>
    );
}
