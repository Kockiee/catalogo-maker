import { FaWhatsapp } from "react-icons/fa6";
import BackButton from "../dashboard/components/BackButton";

export const metadata = {
    // Metadados da página, incluindo título e descrição
    title: 'Termos de Uso',
    description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.",
};

export default function PAGE() {
    // Componente principal que renderiza os Termos de Uso
    return (
        <div className="flex flex-col items-center">
            <div className="max-w-4xl w-full">
                <BackButton/> {/* Botão para voltar à página anterior */}
            </div>
            <h1 className="font-bold text-2xl mb-4">Termos de Uso</h1>
            <div className="max-w-4xl space-y-4">
                <p>
                    Estes Termos de Uso ("Termos") regem o uso do serviço oferecido
                    pelo Catálogo Maker ("nós", "nosso" ou "nos") para criar catálogos
                    de produtos. Ao utilizar nosso serviço, você concorda com estes
                    Termos. Se você não concordar com estes Termos, não utilize nosso
                    serviço.
                </p>
                <h2 className="font-bold text-xl">1. Serviço</h2>
                <p>
                    O Catálogo Maker oferece uma plataforma online para criar, personalizar
                    e gerenciar catálogos de produtos.
                </p>
                <h2 className="font-bold text-xl">2. Conta do Usuário</h2>
                <p>
                    Para acessar o serviço completo, você precisa criar uma conta
                    de usuário. Você é responsável por manter a segurança de sua conta
                    e senha, e concorda em nos notificar imediatamente sobre qualquer
                    uso não autorizado de sua conta.
                </p>
                <h2 className="font-bold text-xl">3. Uso Aceitável</h2>
                <p>Ao utilizar nosso serviço, você concorda em:</p>
                <ul className="list-disc p-4">
                    <li>Não violar qualquer lei aplicável.</li>
                    <li>Não interferir no funcionamento adequado do serviço.</li>
                    <li>Não usar o serviço para qualquer finalidade ilegal ou não autorizada.</li>
                    <li>Não compartilhar sua conta com terceiros.</li>
                </ul>
                <h2 className="font-bold text-xl">4. Cancelamento e Suspensão</h2>
                <p>
                    Reservamo-nos o direito de suspender ou encerrar sua conta a
                    qualquer momento, por qualquer motivo, sem aviso prévio ou
                    responsabilidade.
                </p>
                <h2 className="font-bold text-xl">5. Limitação de Responsabilidade</h2>
                <p>
                    Em nenhuma circunstância seremos responsáveis por quaisquer danos
                    indiretos, incidentais, especiais, punitivos ou consequenciais decorrentes
                    do uso ou incapacidade de usar nosso serviço.
                </p>
                <h2 className="font-bold text-xl">6. Alterações nos Termos</h2>
                <p>
                    Podemos revisar estes Termos a qualquer momento sem aviso prévio.
                    O uso contínuo do serviço após tais alterações constitui sua aceitação
                    dos Termos revisados.
                </p>
                <h2 className="font-bold text-xl">7. Lei Aplicável</h2>
                <p>
                    Estes Termos serão regidos e interpretados de acordo com as leis do Brasil
                    sem considerar conflitos de disposições legais.
                </p>
                <h2 className="font-bold text-xl">9. Contato</h2>
                <p>
                    Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelos
                    contatos:
                </p>
                <ul className="list-disc p-4">
                    <li>Whatsapp: +55 16 997767624 <FaWhatsapp className="inline-flex ml-1 w-6 h-6"/></li>
                </ul>
                <p>
                    Última atualização: 17/04/2024
                </p>
            </div>
        </div>
    )
}