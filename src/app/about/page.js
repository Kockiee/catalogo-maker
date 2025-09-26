// Este arquivo define a página "Sobre Nós" do Catálogo Maker.
// Apresenta informações sobre a equipe, missão, história e contato da empresa.
// Utiliza React para renderizar o conteúdo e o ícone do WhatsApp para facilitar o contato.

import { FaWhatsapp } from "react-icons/fa6";

// Metadados da página, usados para SEO e identificação do conteúdo
export const metadata = {
    title: 'Sobre Nós',
    description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.",
};

// Função principal que retorna o conteúdo da página "Sobre Nós"
export default function PAGE() {
    return (
        <div className="flex flex-col items-center">
            {/* Título principal da página */}
            <h1 className="font-bold text-2xl mb-4">Sobre a Catálogo Maker</h1>
            <div className="max-w-4xl space-y-4">
                {/* Parágrafo sobre a equipe e propósito */}
                <p>
                    Somos um grupo de alunos do terceiro ano do ensino médio da
                    Etec Sylvio de Mattos Carvalho de Matão-SP, apaixonados por ajudar pequenos e médios lojistas.
                </p>
                {/* Frase de destaque */}
                <p className="my-2 font-semibold">
                    "Nascemos com o sonho de cada um dos lojistas e vendedores brasileiros." - Catálogo Maker
                </p>
                {/* Seção de história */}
                <h2 className="font-bold text-xl">Nossa História</h2>
                <p>
                    A Catálogo Maker surgiu como uma alternativa a outros serviços de
                    catálogo online, sendo em comparação com os demais, muito mais fácil
                    de usar e tendo preços ótimos em relação aos benefícios que oferecemos
                    aos nossos clientes.
                </p>
                {/* Seção de missão */}
                <h2 className="font-bold text-xl">Nossa Missão</h2>
                <p>
                    Nossa missão na Catálogo Maker é não só facilitar a forma com que o lojista
                    brasileiro vende mas também transformar como os mesmos tratam seus pedidos. 
                    Estamos empenhados em:
                </p>
                {/* Lista de objetivos da missão */}
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
                {/* Lista de formas de contato, incluindo WhatsApp com ícone */}
                <ul className="list-disc p-4">
                    <li>Whatsapp: +55 16 997767624 <FaWhatsapp className="inline-flex ml-1 w-6 h-6"/></li>
                </ul>
            </div>
        </div>
    )
}