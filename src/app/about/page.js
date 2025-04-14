import { FaWhatsapp } from "react-icons/fa6";

export const metadata = {
    title: 'Sobre Nós',
    description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.",
};

export default function PAGE() {
    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl mb-4">Sobre a Catálogo Maker</h1>
            <div className="max-w-4xl space-y-4">
                <p>
                    Somos uma equipe apaixonada por ajudar pequenos e médios lojistas,
                    comprometida em oferecer tecnologias eficientes, fáceis de usar e
                    com preços acessíveis para nossos clientes. Desde muito tempo atrás,
                    temos trabalhado incansavelmente para facilitar as vendas e a gestão
                    de pedidos de lojistas do Brasil todo.
                </p>
                <p className="my-2 font-semibold">
                    "Nascemos não como sonho de empresário mas como sonho de cada um
                    dos lojistas e vendedores brasileiros." - Catálogo Maker
                </p>
                <h2 className="font-bold text-xl">Nossa História</h2>
                <p>
                    A Catálogo Maker surgiu como uma alternativa a outros serviços de
                    catálogo online, sendo em comparação com os demais, muito mais fácil
                    de usar e tendo preços ótimos em relação aos benefícios que oferecemos
                    aos nossos clientes.
                </p>
                <h2 className="font-bold text-xl">Nossa Missão</h2>
                <p>
                    Nossa missão na Catálogo Maker é não só facilitar a forma com que o lojista
                    brasileiro vende mas também transformar como os mesmos tratam seus pedidos. 
                    Estamos empenhados em:
                </p>
                <ul className="list-disc p-4">
                    <li>Fornecer um ótimo software de automação comercial;</li>
                    <li>Dar aos nossos usuários catálogos bons e modernos;</li>
                    <li>Melhorar cada vez mais nossas aplicações.</li>
                </ul>
                <h2 className="font-bold text-xl">Entre em Contato</h2>
                <p>
                    Estamos ansiosos para ouvir de você! Se você tiver alguma dúvida, comentário ou apenas quiser dizer olá, entre em contato conosco.
                </p>
                <ul className="list-disc p-4">
                    <li>Whatsapp: +55 16 997767624 <FaWhatsapp className="inline-flex ml-1 w-6 h-6"/></li>
                </ul>
            </div>
        </div>
    )
}