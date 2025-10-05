/**
 * COMPONENTE DE GRADE DE PREÇOS
 * 
 * Este arquivo contém o componente que exibe os planos de assinatura do
 * Catálogo Maker na página inicial. O componente mostra os diferentes
 * planos disponíveis e seus benefícios para os usuários.
 * 
 * Funcionalidades:
 * - Exibição de planos de assinatura
 * - Aviso de alteração de preços
 * - Lista de benefícios do plano premium
 * - Design responsivo
 * - Integração com componente PlanCard
 */

import { MdVerified } from "react-icons/md"; // Importa ícone de verificação
import PlanCard from "@/app/dashboard/plan/components/PlanCard"; // Importa componente de card de plano

export default function PricesGrid() {
    return (
        <div className="flex flex-col items-center pt-8" id="prices">
            {/* Título da seção */}
            <h1 className="text-3xl font-bold text-center">Nossas assinaturas</h1>
            {/* Descrição dos planos */}
            <p className="text-center">
              Nosso serviço tem os melhores preços do mercado. Assinando um plano você
              nos ajuda a manter o serviço funcionando e aprimorando-se constantemente
              para melhor satisfazer suas necessidades como vendedor.
            </p>
            {/* Aviso de alteração de preços */}
            <div className="bg-green-400 rounded-full py-2 px-4 mt-4 text-white">
              <p>Atenção! Os preços dos planos serão aumentados em {process.env.NEXT_PUBLIC_NEXT_PRICE_ALTERATION_DAY}</p>
            </div>
            {/* Grid de planos */}
            <div className="flex flex-wrap items-center justify-center w-full">
              {/* Plano 1 */}
              <div className="m-3 max-w-xs w-full">
                <PlanCard disabled recurrenceType={2} price={65}/>
              </div>
              {/* Plano 2 (padrão) */}
              <div className="m-3 max-w-xs w-full">
                <PlanCard disabled/>
              </div>
              {/* Plano 3 */}
              <div className="m-3 max-w-xs w-full">
                <PlanCard disabled recurrenceType={3} price={240}/>
              </div>
            </div>
            {/* Seção de benefícios */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-center mb-4">Benefícios do plano premium</h2>
              <ul className="block space-y-2 text-justify">
                {/* Benefício: Catálogos ilimitados */}
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Catálogos ilimitados
                </li>
                {/* Benefício: Hospedagem gratuita */}
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Hospedagem gratuita no Catálogo Maker
                </li>
                {/* Benefício: Cores personalizadas */}
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Catálogo com as cores do seu negócio
                </li>
                {/* Benefício: SEO otimizado */}
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  SEO otimizado para seus clientes te encontrarem facilmente
                </li>
                {/* Benefício: Link compartilhável */}
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Link compartilhável com qualquer pessoa
                </li>
                {/* Benefício: Página exclusiva */}
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Uma página exclusiva para seu catálogo
                </li>
                {/* Benefício: Gerenciamento de pedidos */}
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Gerenciamento de pedidos fácil e otimizado
                </li>
                {/* Benefício: Suporte humanizado */}
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Suporte humanizado
                </li>
              </ul>
            </div>
        </div>
    )
}