/**
 * PÁGINA DE POLÍTICA DE PRIVACIDADE
 * 
 * Este arquivo contém a página de política de privacidade do site Catálogo Maker.
 * É uma página informativa que explica como a empresa coleta, utiliza e protege
 * as informações dos usuários, cumprindo requisitos legais de transparência.
 * 
 * Funcionalidades:
 * - Exibe política de privacidade completa
 * - Informa sobre coleta e uso de dados
 * - Explica práticas de segurança
 * - Fornece informações de contato
 * - Inclui botão de navegação para voltar
 */

// Importa ícone do WhatsApp do pacote react-icons
import { FaWhatsapp } from "react-icons/fa6";
// Importa componente de botão de voltar
import BackButton from "../dashboard/components/BackButton";

// Define metadados da página para SEO
export const metadata = {
    title: 'Política de Privacidade', // Título que aparece na aba do navegador
    description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.", // Descrição para resultados de busca
};

// Componente principal da página de política de privacidade
export default function PAGE() {
    return (
        // Container principal com layout flexível centralizado
        <div className="flex flex-col items-center">
            {/* Container para o botão de voltar */}
            <div className="max-w-4xl w-full">
                <BackButton/>
            </div>
            
            {/* Título principal da página */}
            <h1 className="font-bold text-2xl mb-4">Política de Privacidade</h1>
            
            {/* Container com largura máxima e espaçamento entre seções */}
            <div className="max-w-4xl space-y-4">
                {/* Introdução da política */}
                <p>
                    Esta Política de Privacidade descreve como Catálogo Maker coleta,
                    utiliza e protege as informações que você fornece quando visita nosso site.
                </p>
                
                {/* Seção sobre coleta de informações */}
                <h2 className="font-bold text-xl">Coleta de Informações</h2>
                <p>
                    Não coletamos informações pessoais identificáveis sobre você quando visita
                    nosso site, a menos que você nos forneça essas informações de forma voluntária.
                </p>
                
                {/* Seção sobre informações fornecidas voluntariamente */}
                <h2 className="font-bold text-xl">Informações que Você Fornece Voluntariamente</h2>
                <p>
                    Podemos coletar informações pessoais identificáveis que você nos forneça
                    voluntariamente ao entrar em contato conosco através do formulário de contato
                    ou por e-mail. Essas informações podem incluir seu nome, endereço de e-mail
                    e quaisquer outras informações que você escolha fornecer.
                </p>
                
                {/* Seção sobre uso das informações */}
                <h2 className="font-bold text-xl">Uso de Informações</h2>
                <p>
                    As informações que você nos fornece serão utilizadas apenas para responder às
                    suas consultas e fornecer o serviço solicitado. Não compartilharemos suas informações
                    pessoais com terceiros sem o seu consentimento, exceto quando exigido por lei.
                </p>
                
                {/* Seção sobre cookies */}
                <h2 className="font-bold text-xl">Cookies e Tecnologias Semelhantes</h2>
                <p>
                    Nosso site não utiliza cookies ou outras tecnologias de rastreamento para
                    coletar informações sobre você.
                </p>
                
                {/* Seção sobre links para sites terceiros */}
                <h2 className="font-bold text-xl">Links para Sites de Terceiros</h2>
                <p>
                    Nosso site pode conter links para sites de terceiros. Por favor, esteja ciente
                    de que não somos responsáveis pelas práticas de privacidade desses outros sites.
                    Encorajamos nossos usuários a estarem cientes quando deixam nosso site e a ler as
                    políticas de privacidade de cada site que coleta informações pessoalmente 
                    identificáveis.
                </p>
                
                {/* Seção sobre segurança */}
                <h2 className="font-bold text-xl">Segurança da Informação</h2>
                <p>
                    Tomamos medidas razoáveis para proteger as informações que você nos fornece
                    contra acesso não autorizado, divulgação, alteração ou destruição.
                </p>
                
                {/* Seção sobre alterações na política */}
                <h2 className="font-bold text-xl">Alterações a Esta Política de Privacidade</h2>
                <p>
                    Podemos atualizar nossa Política de Privacidade de tempos em tempos. Recomendamos
                    que você revise esta página periodicamente para quaisquer alterações. Ao continuar
                    a usar nosso site após quaisquer alterações nesta Política de Privacidade, você
                    estará aceitando tais alterações.
                </p>
                
                {/* Seção de contato */}
                <h2 className="font-bold text-xl">Contato</h2>
                <p>
                    Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato 
                    conosco pelos contatos:
                </p>
                
                {/* Lista com informações de contato */}
                <ul className="list-disc p-4">
                    {/* Item de contato com ícone do WhatsApp */}
                    <li>Whatsapp: +55 16 997767624 <FaWhatsapp className="inline-flex ml-1 w-6 h-6"/></li>
                </ul>
                
                {/* Data da última atualização */}
                <p>
                    Última atualização: 17/04/2024
                </p>
            </div>
        </div>
    )
}