import { MdVerified } from "react-icons/md";
import PlanCard from "../components/PlanCard";

export default function PricesGrid() {
    return (
        <div className="flex flex-col items-center pt-8" id="prices">
            <h1 className="text-3xl font-bold text-center">Nossas assinaturas</h1>
            <p className="text-center">
              Nosso serviço tem os melhores preços do mercado. Assinando um plano você
              nos ajuda a manter o serviço funcionando e aprimorando-se constantemente
              para melhor satisfazer suas necessidades como vendedor.
            </p>
            <div className="bg-green-400 rounded-full py-2 px-4 mt-4 text-white">
              <p>Atenção! Os preços dos planos serão aumentados em 07/06/2024</p>
            </div>
            <div className="flex flex-wrap items-center justify-center w-full">
              <div className="m-3 max-w-xs w-full">
                <PlanCard disabled recurrenceType={2} price={65}/>
              </div>
              <div className="m-3 max-w-xs w-full">
                <PlanCard disabled/>
              </div>
              <div className="m-3 max-w-xs w-full">
                <PlanCard disabled recurrenceType={3} price={240}/>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-center mb-4">Benefícios do plano premium</h2>
              <ul className="block space-y-2 text-justify">
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Catálogos ilimitados
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Hospedagem gratuita no Catálogo Maker
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Catálogo com as cores do seu negócio
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  SEO otimizado para seus clientes te encontrarem facilmente
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Link compartilhável com qualquer pessoa
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Uma página exclusiva para seu catálogo
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Gerenciamento de pedidos fácil e otimizado
                </li>
                <li>
                  <MdVerified className="text-green-500 w-6 h-6 mr-1 inline-flex"/>
                  Suporte humanizado
                </li>
              </ul>
            </div>
        </div>
    )
}