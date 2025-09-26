import { MdVerified } from "react-icons/md"; // Importação do ícone de verificação
import PlanCard from "@/app/dashboard/plan/components/PlanCard"; // Importação do componente de cartão de plano

/**
 * Componente que exibe os preços e benefícios dos planos de assinatura.
 * Inclui uma lista de planos e uma seção de benefícios do plano premium.
 */
export default function PricesGrid() {
    return (
        <div className="flex flex-col items-center pt-8" id="prices"> {/* Container principal */}
            <h1 className="text-3xl font-bold text-center">Nossas assinaturas</h1> {/* Título principal */}
            <p className="text-center"> {/* Descrição dos planos */}
              Nosso serviço tem os melhores preços do mercado. Assinando um plano você
              nos ajuda a manter o serviço funcionando e aprimorando-se constantemente
              para melhor satisfazer suas necessidades como vendedor.
            </p>
            <div className="bg-green-400 rounded-full py-2 px-4 mt-4 text-white"> {/* Aviso sobre alteração de preços */}
              <p>Atenção! Os preços dos planos serão aumentados em {process.env.NEXT_PUBLIC_NEXT_PRICE_ALTERATION_DAY}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center w-full"> {/* Container dos cartões de plano */}
              <div className="m-3 max-w-xs w-full"> {/* Cartão de plano mensal */}
                <PlanCard disabled recurrenceType={2} price={65}/>
              </div>
              <div className="m-3 max-w-xs w-full"> {/* Cartão de plano padrão */}
                <PlanCard disabled/>
              </div>
              <div className="m-3 max-w-xs w-full"> {/* Cartão de plano anual */}
                <PlanCard disabled recurrenceType={3} price={240}/>
              </div>
            </div>
            <div className="flex flex-col items-center"> {/* Container dos benefícios do plano premium */}
              <h2 className="text-2xl font-bold text-center mb-4">Benefícios do plano premium</h2> {/* Título dos benefícios */}
              <ul className="block space-y-2 text-justify"> {/* Lista de benefícios */}
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/> {/* Ícone de verificação */}
                  Catálogos ilimitados
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/> {/* Ícone de verificação */}
                  Hospedagem gratuita no Catálogo Maker
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/> {/* Ícone de verificação */}
                  Catálogo com as cores do seu negócio
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/> {/* Ícone de verificação */}
                  SEO otimizado para seus clientes te encontrarem facilmente
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/> {/* Ícone de verificação */}
                  Link compartilhável com qualquer pessoa
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/> {/* Ícone de verificação */}
                  Uma página exclusiva para seu catálogo
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/> {/* Ícone de verificação */}
                  Gerenciamento de pedidos fácil e otimizado
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/> {/* Ícone de verificação */}
                  Suporte humanizado
                </li>
              </ul>
            </div>
        </div>
    )
}