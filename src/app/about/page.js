/**
 * PÁGINA "SOBRE NÓS" - CATÁLOGO MAKER
 * 
 * Este arquivo contém a página "Sobre Nós" do site Catálogo Maker.
 * É uma página informativa que apresenta a empresa, sua história, missão
 * e informações de contato para os usuários que desejam conhecer mais
 * sobre a plataforma e a equipe por trás do projeto.
 * 
 * Funcionalidades:
 * - Exibe informações sobre a empresa e sua história
 * - Apresenta a missão e valores da Catálogo Maker
 * - Fornece informações de contato via WhatsApp
 * - Utiliza metadados para SEO (título e descrição da página)
 */

// Importa o ícone do WhatsApp do pacote react-icons
import { FaWhatsapp } from "react-icons/fa6";

// Define os metadados da página para SEO (Search Engine Optimization)
export const metadata = {
    title: 'Sobre Nós', // Título que aparece na aba do navegador
    description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.", // Descrição que aparece nos resultados de busca
};

// Componente principal da página "Sobre Nós"
export default function PAGE() {
    return (
        // Container principal com layout flexível centralizado
        <div className="flex flex-col items-center">
            {/* Título principal da página */}
            <h1 className="font-bold text-2xl mb-4">Sobre a Catálogo Maker</h1>
            
            {/* Container com largura máxima e espaçamento entre elementos */}
            <div className="max-w-4xl space-y-4">
                {/* Parágrafo de introdução sobre a empresa */}
                <p>
                    Somos uma equipe apaixonada por ajudar pequenos e médios lojistas,
                    comprometida em oferecer tecnologias eficientes, fáceis de usar e
                    com preços acessíveis para nossos clientes. Desde muito tempo atrás,
                    temos trabalhado incansavelmente para facilitar as vendas e a gestão
                    de pedidos de lojistas do Brasil todo.
                </p>
                
                {/* Citação destacada da empresa */}
                <p className="my-2 font-semibold">
                    "Nascemos não como sonho de empresário mas como sonho de cada um
                    dos lojistas e vendedores brasileiros." - Catálogo Maker
                </p>
                
                {/* Seção sobre a história da empresa */}
                <h2 className="font-bold text-xl">Nossa História</h2>
                <p>
                    A Catálogo Maker surgiu como uma alternativa a outros serviços de
                    catálogo online, sendo em comparação com os demais, muito mais fácil
                    de usar e tendo preços ótimos em relação aos benefícios que oferecemos
                    aos nossos clientes.
                </p>
                
                {/* Seção sobre a missão da empresa */}
                <h2 className="font-bold text-xl">Nossa Missão</h2>
                <p>
                    Nossa missão na Catálogo Maker é não só facilitar a forma com que o lojista
                    brasileiro vende mas também transformar como os mesmos tratam seus pedidos. 
                    Estamos empenhados em:
                </p>
                
                {/* Lista com os objetivos da empresa */}
                <ul className="list-disc p-4">
                    <li>Fornecer um ótimo software de automação comercial;</li>
                    <li>Dar aos nossos usuários catálogos bons e modernos;</li>
                    <li>Melhorar cada vez mais nossas aplicações.</li>
                </ul>
                
                {/* Seção de contato */}
                <h2 className="font-bold text-xl">Entre em Contato</h2>
                <p>
                    Estamos ansiosos para ouvir de você! Se você tiver alguma dúvida, comentário ou apenas quiser dizer olá, entre em contato conosco.
                </p>
                
                {/* Lista com informações de contato */}
                <ul className="list-disc p-4">
                    {/* Item de contato com ícone do WhatsApp */}
                    <li>Whatsapp: +55 16 997767624 <FaWhatsapp className="inline-flex ml-1 w-6 h-6"/></li>
                </ul>
            </div>
        </div>
    )
}