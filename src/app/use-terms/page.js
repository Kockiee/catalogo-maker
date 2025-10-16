/**
 * PÁGINA DE TERMOS DE USO
 * 
 * Este arquivo contém a página de termos de uso do site Catálogo Maker.
 * É uma página informativa que estabelece as regras e condições para
 * uso da plataforma, definindo direitos e responsabilidades dos usuários.
 * 
 * Funcionalidades:
 * - Exibe termos de uso completos
 * - Define regras de uso da plataforma
 * - Estabelece responsabilidades do usuário
 * - Informa sobre políticas de cancelamento
 * - Fornece informações de contato
 * - Inclui botão de navegação para voltar
 */

// Importa ícone do WhatsApp do pacote react-icons
import { FaWhatsapp } from "react-icons/fa6";
// Importa componente de botão de voltar
import BackButton from "../dashboard/components/BackButton";

// Define metadados da página para SEO
export const metadata = {
    title: 'Termos de Uso', // Título que aparece na aba do navegador
    description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.", // Descrição para resultados de busca
};

// Componente principal da página de termos de uso
export default function PAGE() {
    return (
        // Container principal com layout flexível centralizado
        <div className="flex flex-col items-center">
            {/* Container para o botão de voltar */}
            <div className="max-w-4xl w-full">
                <BackButton/>
            </div>
            
            {/* Título principal da página */}
            <h1 className="font-bold text-2xl mb-4">Termos de Uso</h1>
            
            {/* Container com largura máxima e espaçamento entre seções */}
            <div className="max-w-4xl space-y-4">
                {/* Introdução dos termos */}
                <p>
                    Estes Termos de Uso ("Termos") regem o uso do serviço oferecido
                    pelo Catálogo Maker ("nós", "nosso" ou "nos") para criar catálogos
                    de produtos. Ao utilizar nosso serviço, você concorda com estes
                    Termos. Se você não concordar com estes Termos, não utilize nosso
                    serviço.
                </p>
                
                {/* Seção 1: Descrição do serviço */}
                <h2 className="font-bold text-xl">1. Serviço</h2>
                <p>
                    O Catálogo Maker oferece uma plataforma online para criar, personalizar
                    e gerenciar catálogos de produtos.
                </p>
                
                {/* Seção 2: Conta do usuário */}
                <h2 className="font-bold text-xl">2. Conta do Usuário</h2>
                <p>
                    Para acessar o serviço completo, você precisa criar uma conta
                    de usuário. Você é responsável por manter a segurança de sua conta
                    e senha, e concorda em nos notificar imediatamente sobre qualquer
                    uso não autorizado de sua conta.
                </p>
                
                {/* Seção 3: Uso aceitável */}
                <h2 className="font-bold text-xl">3. Uso Aceitável</h2>
                <p>Ao utilizar nosso serviço, você concorda em:</p>
                {/* Lista de regras de uso */}
                <ul className="list-disc p-4">
                    <li>Não violar qualquer lei aplicável.</li>
                    <li>Não interferir no funcionamento adequado do serviço.</li>
                    <li>Não usar o serviço para qualquer finalidade ilegal ou não autorizada.</li>
                    <li>Não compartilhar sua conta com terceiros.</li>
                </ul>
                
                {/* Seção 4: Cancelamento e suspensão */}
                <h2 className="font-bold text-xl">4. Cancelamento e Suspensão</h2>
                <p>
                    Reservamo-nos o direito de suspender ou encerrar sua conta a
                    qualquer momento, por qualquer motivo, sem aviso prévio ou
                    responsabilidade.
                </p>
                
                {/* Seção 5: Limitação de responsabilidade */}
                <h2 className="font-bold text-xl">5. Limitação de Responsabilidade</h2>
                <p>
                    Em nenhuma circunstância seremos responsáveis por quaisquer danos
                    indiretos, incidentais, especiais, punitivos ou consequenciais decorrentes
                    do uso ou incapacidade de usar nosso serviço.
                </p>
                
                {/* Seção 6: Alterações nos termos */}
                <h2 className="font-bold text-xl">6. Alterações nos Termos</h2>
                <p>
                    Podemos revisar estes Termos a qualquer momento sem aviso prévio.
                    O uso contínuo do serviço após tais alterações constitui sua aceitação
                    dos Termos revisados.
                </p>
                
                {/* Seção 7: Lei aplicável */}
                <h2 className="font-bold text-xl">7. Lei Aplicável</h2>
                <p>
                    Estes Termos serão regidos e interpretados de acordo com as leis do Brasil
                    sem considerar conflitos de disposições legais.
                </p>
                
                {/* Seção 9: Contato */}
                <h2 className="font-bold text-xl">9. Contato</h2>
                <p>
                    Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelos
                    contatos:
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