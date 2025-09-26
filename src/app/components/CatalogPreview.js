'use client' // Diretiva para indicar que este código executa no cliente
import { BiSearch } from "react-icons/bi"; // Importação do ícone de busca
import { HiInformationCircle } from "react-icons/hi"; // Importação do ícone de informação

/**
 * Componente de pré-visualização do catálogo
 * Exibe uma representação visual de como o catálogo ficará com as configurações atuais
 * 
 * @param {string} storeName - Nome da loja
 * @param {string} storeDescription - Descrição da loja
 * @param {string} primaryColor - Cor primária (fundo principal)
 * @param {string} secondaryColor - Cor secundária (cabeçalho e rodapé)
 * @param {string} tertiaryColor - Cor terciária (bordas e detalhes)
 * @param {string} textColor - Cor do texto
 * @param {string} bannerImage - URL da imagem do banner
 */
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
        <div className="w-1/2 max-xl:w-full max-xl:mt-6 max-xl:pl-0 pl-8"> {/* Container principal com responsividade */}
            <p className="text-lg mb-2">Pré-visualização:</p> {/* Título da seção */}
            <div 
                className="w-full relative p-4 rounded-lg shadow-md" 
                style={{backgroundColor: primaryColor, color: textColor}} // Aplica cor de fundo e texto dinâmicas
            >
                {/* Cabeçalho do catálogo */}
                <div 
                    className="p-4 absolute w-full top-0 right-0 rounded-lg flex items-center justify-between" 
                    style={{backgroundColor: secondaryColor}} // Aplica cor secundária ao cabeçalho
                >
                    <h1 className="font-bold break-all">{storeName}</h1> {/* Nome da loja */}
                    <div 
                        className="relative w-64 p-5 rounded-lg" 
                        style={{backgroundColor: primaryColor}} // Campo de busca com cor primária
                    >
                        <BiSearch className="absolute top-3 right-3"/> {/* Ícone de busca */}
                    </div>
                </div>
                
                {/* Conteúdo principal do catálogo */}
                <div className="py-[72px] flex flex-wrap text-sm"> {/* Espaçamento para não sobrepor o cabeçalho */}
                    {/* Banner do catálogo */}
                    <div 
                        className="p-4 w-full h-16 rounded-lg flex justify-center items-center bg-cover bg-center" 
                        style={{
                            backgroundColor: tertiaryColor, 
                            backgroundImage: bannerImage ? `url(${bannerImage})` : 'none' // Usa imagem de banner se disponível
                        }}
                    ></div>
                    
                    {/* Primeiro produto de exemplo */}
                    <div 
                        className="p-2 rounded-lg flex flex-col m-2" 
                        style={{
                            color: textColor === primaryColor ? "#000000" : textColor, // Ajusta cor do texto para garantir legibilidade
                            border: `2px solid ${tertiaryColor}` // Borda com cor terciária
                        }}
                    >
                        <div className="w-full h-full rounded-lg p-8">Imagem de produto</div> {/* Placeholder para imagem */}
                        <p>Nome de um produto</p> {/* Nome do produto de exemplo */}
                        <p>R$0.00</p> {/* Preço de exemplo */}
                    </div>
                    
                    {/* Segundo produto de exemplo */}
                    <div 
                        className="p-2 rounded-lg flex flex-col m-2" 
                        style={{
                            color: textColor === primaryColor ? "#000000" : textColor, // Ajusta cor do texto para garantir legibilidade
                            border: `2px solid ${tertiaryColor}` // Borda com cor terciária
                        }}
                    >
                        <div className="w-full h-full rounded-lg p-8">Imagem de produto</div> {/* Placeholder para imagem */}
                        <p>Nome de um produto</p> {/* Nome do produto de exemplo */}
                        <p>R$0.00</p> {/* Preço de exemplo */}
                    </div>
                </div>
                
                {/* Rodapé do catálogo */}
                <div 
                    className="w-full p-2 rounded-lg flex flex-col text-sm" 
                    style={{backgroundColor: secondaryColor}} // Aplica cor secundária ao rodapé
                >
                    <h1 className="font-bold break-all">{storeName}</h1> {/* Nome da loja no rodapé */}
                    <p className="break-all">{storeDescription}</p> {/* Descrição da loja */}
                </div>
            </div>
            
            {/* Nota informativa abaixo da pré-visualização */}
            <p className="text-base inline-flex mt-2">
                <HiInformationCircle className="w-6 h-6 mr-1"/> {/* Ícone de informação */}
                Isto é uma versão simplificada
            </p>
        </div>
    );
}
