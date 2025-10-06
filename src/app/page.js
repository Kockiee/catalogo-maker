/**
 * PÁGINA INICIAL - LANDING PAGE
 * 
 * Este arquivo contém a página inicial do site Catálogo Maker, que serve
 * como landing page para apresentar a plataforma e seus benefícios.
 * A página se adapta entre modo desktop e mobile para melhor experiência.
 * 
 * Funcionalidades:
 * - Apresenta proposta de valor da plataforma
 * - Exibe benefícios principais (WhatsApp, preços, facilidade)
 * - Botões de call-to-action para cadastro/login
 * - Layout responsivo (desktop/mobile)
 * - Seção de preços e planos
 * - Citação inspiracional da empresa
 */

// Importa componente de imagem otimizada do Next.js
import Image from "next/image";
// Importa componente de botão do Flowbite
import { Button } from "flowbite-react";
// Importa ícones do pacote react-icons
import { AiOutlineWhatsApp } from "react-icons/ai";
import { HiCurrencyDollar, HiLightningBolt } from "react-icons/hi";
import { FiSmartphone } from "react-icons/fi";
import { FaAndroid } from "react-icons/fa6";
// Importa componente de grade de preços
import PricesGrid from "@/app/components/PricesGrid";
// Importa componente de link do Next.js
import Link from "next/link";
// Importa componente de botão de scroll
import ScrollDownButton from "./components/ScrollDownButton";

// Componente principal da página inicial
export default function Home({searchParams}) {
  return (
    <>
      {/* Modo mobile - layout otimizado para dispositivos móveis */}
      {searchParams.mobileMode ? (
        <main className="flex h-full flex-col items-center space-y-4">
          {/* Seção hero para mobile */}
          <div className="w-full h-full bg-blue flex flex-row max-md:flex-col justify-center items-center max-md:space-y-2">
            {/* Logo da aplicação */}
            <Image src="/catalog-flat-icon.png" alt="Catálogo Maker" width={400} height={400}/>
            
            {/* Conteúdo principal para mobile */}
            <div className="flex flex-col items-center space-y-4 max-w-[859px] max-md:text-justify">
              <div>
                {/* Título principal */}
                <h1 className="text-gray-800 text-5xl max-sm:text-3xl font-black ">Seu catálogo pronto em 10 minutos.</h1>
                {/* Subtítulo explicativo */}
                <p className="text-xl max-sm:text-lg w-full">Com o Catálogo Maker você é capaz de ter o seu catálogo online ainda hoje e já começar a receber pedidos.</p>
              </div>
              
              {/* Título para seção de login/cadastro */}
              <h2 className="text-lg font-bold">Já tem uma conta ? Entre ou crie uma</h2>
              
              {/* Botões de ação para mobile */}
              <div className="flex space-x-4 items-center w-full pb-8">
                {/* Link para página de login */}
                <Link href="/auth/signin?mobileMode=True" className="w-1/2">
                    <Button
                    size='xl'
                    className='w-full !bg-cornflowerblue !text-lightcyan hover:!bg-cornflowerblue/90 focus:!ring-jordyblue'>
                        Entrar
                    </Button>
                </Link>
                {/* Link para página de cadastro */}
                <Link href="/auth/signup?mobileMode=True" className="w-1/2">
                    <Button
                    size='xl'
                    className='w-full !bg-neonblue text-center !border-4 !border-jordyblue text-lightcyan hover:!bg-neonblue/90 focus:!ring-0'>
                        Criar Conta
                    </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* Modo desktop - layout completo com todas as seções */
        <main className="flex h-full flex-col items-center space-y-4">
          {/* Seção hero principal */}
          <div className="w-full h-[650px] max-md:h-full bg-blue flex flex-row max-md:flex-col justify-center items-center max-md:space-y-2">
            {/* Logo com animação de hover */}
            <Image className="duration-500 hover:scale-110" alt="Catálogo Maker" src="/catalog-flat-icon.png" width={500} height={500}/>
            
            {/* Conteúdo principal */}
            <div className="flex flex-col items-center space-y-2 max-w-[859px] max-md: text-justify">
              {/* Título principal */}
              <h1 className="text-gray-800 text-5xl max-sm:text-4xl font-black ">Seu catálogo pronto em 10 minutos.</h1>
              {/* Subtítulo explicativo */}
              <p className="text-xl max-sm:text-lg w-full">Com o Catálogo Maker você é capaz de ter o seu catálogo online ainda hoje e já começar a receber pedidos.</p>
              
              {/* Botão de call-to-action principal */}
              <Link href="/auth/signup">
                <Button
                size="xl"
                className="bg-neonblue hover:!bg-neonblue/90 focus:ring-0 hover:shadow-lg hover:shadow-neonblue/50 hover:-translate-y-1 duration-500 !mt-4 px-6">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Botão para rolar para seção de preços */}
          <div className="w-full flex justify-center pt-6">
            <ScrollDownButton destinyId="#prices"/>
          </div>
          
          {/* Seção de benefícios e recursos */}
          <div className="flex flex-col items-center w-full max-w-[1100px] space-y-16 max-md:pt-16">
            {/* Benefício 1: Integração com WhatsApp */}
            <div className="flex flex-row max-md:flex-col items-center">
              {/* Ícone do WhatsApp */}
              <AiOutlineWhatsApp className="text-neonblue w-28 h-28"/>
              {/* Conteúdo do benefício */}
              <div className="flex flex-col pl-6 max-md:pl-0 max-w-[780px]">
                <h1 className="text-gray-800 text-2xl ">
                  Receba seus pedidos via Whatsapp
                </h1>
                <p>
                  Nós implementamos em nossa solução uma automação de whatsapp que 
                  por meio do número de telefone fornecido envia avisos e informações
                  sobre cada pedido realizado em seu respectivo catálogo.
                </p>
              </div>
            </div>
            
            {/* Benefício 2: Preços competitivos */}
            <div className="flex flex-row max-md:flex-col items-center">
              {/* Ícone de dinheiro */}
              <HiCurrencyDollar className="text-neonblue w-28 h-28"/>
              {/* Conteúdo do benefício */}
              <div className="flex flex-col pl-6 max-md:pl-0 max-w-[780px]">
                <h1 className="text-gray-800 text-2xl ">
                  Problemas com custos ?
                </h1>
                <p>
                  Os preços são o que mais desinteressam potênciais grandes vendedores e,
                  por isso nós estamos sempre adaptando os preços de nossas assinaturas
                  para baixo dos da concorrência e para te o melhor custo benefício do mercado.
                </p>
              </div>
            </div>
            
            {/* Benefício 3: Velocidade e facilidade */}
            <div className="flex flex-row max-md:flex-col items-center">
              {/* Ícone de raio */}
              <HiLightningBolt className="text-neonblue w-28 h-28"/>
              {/* Conteúdo do benefício */}
              <div className="flex flex-col pl-6 max-md:pl-0 max-w-[780px]">
                <h1 className="text-gray-800 text-2xl">
                  Velocidade e facilidade
                </h1>
                <p>
                  Nós da Catálogo Maker prezamos sempre pela velocidade
                  e facilidade de uso de nossas tecnologias e serviços,
                  por isso o Catálogo Maker é a melhor opção para você
                  que quer seu catálogo ainda hoje !
                </p>
              </div>
            </div>
            
            {/* Seção de aplicativo móvel (comentada) */}
            {/* <div className="flex flex-row max-md:flex-col items-center">
              <FiSmartphone className="text-neonblue w-32 h-32"/>
              <div className="flex flex-col pl-6 max-md:pl-0 max-w-[780px]">
                <h1 className="text-gray-800 text-2xl">
                  Baixe nosso aplicativo para dispositivos móveis
                </h1>
                <p>
                  Com nosso aplicativo de celular você consegue gerenciar seus catálogos e pedidos em qualquer lugar, baixe agora. 
                </p>
                <a href='/catalogo-maker.apk'>
                  <Button
                  size="lg"
                  className="duration-200 w-72 bg-neonblue hover:!bg-neonblue/80 focus:ring-0 shadow-sm shadow-neonblue !mt-4 px-6">
                    <FaAndroid className="w-6 h-6 mr-2"/> Baixar para Android
                  </Button>
                </a>
              </div>
            </div> */}
            
            {/* Seção de preços e planos */}
            <PricesGrid/>
            
            {/* Citação inspiracional da empresa */}
            <p className="font-normal text-xl">
              "Ter um catálogo bom é necessidade de todo vendedor; entregar-lhe um catálogo mais do que bom é o nosso objetivo." - Catálogo Maker
            </p>
          </div>
        </main>
      )}
    </>
  );
};
