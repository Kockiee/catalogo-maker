// Importação do componente Image do Next.js para otimização de  imagens
import Image from "next/image";
// Importação do componente Button da biblioteca Flowbite React
import { Button } from "flowbite-react";
// Importação do ícone de WhatsApp da biblioteca react-icons
import { AiOutlineWhatsApp } from "react-icons/ai";
// Importação dos ícones de dólar e raio da biblioteca react-icons
import { HiCurrencyDollar, HiLightningBolt } from "react-icons/hi";
// Importação do componente PricesGrid para exibir a grade de preços
import PricesGrid from "@/app/components/PricesGrid";
// Importação do componente Link do Next.js para navegação entre páginas
import Link from "next/link";
// Importação do componente ScrollDownButton para rolagem suave na página
import ScrollDownButton from "./components/ScrollDownButton";
// Importação do ícone de smartphone da biblioteca react-icons
import { FiSmartphone } from "react-icons/fi";
// Importação do ícone do Android da biblioteca react-icons
import { FaAndroid } from "react-icons/fa6";

// Componente principal da página inicial
export default function Home({searchParams}) {
  return (
    <>
      {/* Renderização condicional baseada no parâmetro mobileMode */}
      {searchParams.mobileMode ? (
        // Layout para dispositivos móveis
        <main className="flex h-full flex-col items-center space-y-4">
          <div className="w-full h-full bg-blue flex flex-row max-md:flex-col justify-center items-center max-md:space-y-2">
            {/* Logo do Catálogo Maker */}
            <Image src="/catalog-flat-icon.png" alt="Catálogo Maker" width={400} height={400}/>
            <div className="flex flex-col items-center space-y-4 max-w-[859px] max-md:text-justify">
              <div>
                {/* Título principal da página */}
                <h1 className="text-gray-800 text-5xl max-sm:text-3xl font-black ">Seu catálogo pronto em 10 minutos.</h1>
                {/* Subtítulo com a proposta de valor */}
                <p className="text-xl max-sm:text-lg w-full">Com o Catálogo Maker você é capaz de ter o seu catálogo online ainda hoje e já começar a receber pedidos.</p>
              </div>
              {/* Chamada para ação para usuários existentes */}
              <h2 className="text-lg font-bold">Já tem uma conta ? Entre ou crie uma</h2>
              {/* Botões de login e cadastro */}
              <div className="flex space-x-4 items-center w-full pb-8">
                {/* Botão de login com parâmetro para modo móvel */}
                <Link href="/auth/signin?mobileMode=True" className="w-1/2">
                    <Button
                    size='xl'
                    className='w-full !bg-cornflowerblue !text-lightcyan hover:!bg-cornflowerblue/90 focus:!ring-jordyblue'>
                        Entrar
                    </Button>
                </Link>
                {/* Botão de cadastro com parâmetro para modo móvel */}
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
        // Layout para desktop
        <main className="flex h-full flex-col items-center space-y-4">
          {/* Seção hero com imagem e texto principal */}
          <div className="w-full h-[650px] max-md:h-full bg-blue flex flex-row max-md:flex-col justify-center items-center max-md:space-y-2">
            {/* Logo com efeito de hover */}
            <Image className="duration-500 hover:scale-110" alt="Catálogo Maker" src="/catalog-flat-icon.png" width={500} height={500}/>
            <div className="flex flex-col items-center space-y-2 max-w-[859px] max-md: text-justify">
              {/* Título principal da página */}
              <h1 className="text-gray-800 text-5xl max-sm:text-4xl font-black ">Seu catálogo pronto em 10 minutos.</h1>
              {/* Subtítulo com a proposta de valor */}
              <p className="text-xl max-sm:text-lg w-full">Com o Catálogo Maker você é capaz de ter o seu catálogo online ainda hoje e já começar a receber pedidos.</p>
              {/* Botão de chamada para ação principal */}
              <Link href="/auth/signup">
                <Button
                size="xl"
                className="bg-neonblue hover:!bg-neonblue/90 focus:ring-0 hover:shadow-lg hover:shadow-neonblue/50 hover:-translate-y-1 duration-500 !mt-4 px-6">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
          {/* Botão para rolar para a seção de preços */}
          <div className="w-full flex justify-center pt-6">
            <ScrollDownButton destinyId="#prices"/>
          </div>
          {/* Seção de recursos/benefícios */}
          <div className="flex flex-col items-center w-full max-w-[1100px] space-y-16 max-md:pt-16">
            {/* Recurso 1: Integração com WhatsApp */}
            <div className="flex flex-row max-md:flex-col items-center">
              <AiOutlineWhatsApp className="text-neonblue w-28 h-28"/>
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
            {/* Recurso 2: Preços competitivos */}
            <div className="flex flex-row max-md:flex-col items-center">
              <HiCurrencyDollar className="text-neonblue w-28 h-28"/>
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
            {/* Recurso 3: Velocidade e facilidade */}
            <div className="flex flex-row max-md:flex-col items-center">
              <HiLightningBolt className="text-neonblue w-28 h-28"/>
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
            {/* Seção de aplicativo móvel comentada (não está ativa no momento) */}
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
            {/* Componente de grade de preços */}
            <PricesGrid/>
            {/* Citação da empresa */}
            <p className="font-normal text-xl">
              "Ter um catálogo bom é necessidade de todo vendedor; entregar-lhe um catálogo mais do que bom é o nosso objetivo." - Catálogo Maker
            </p>
          </div>
        </main>
      )}
    </>
  );
};
