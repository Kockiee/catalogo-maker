import Image from "next/image";
import { Button } from "flowbite-react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { HiCurrencyDollar, HiLightningBolt } from "react-icons/hi";
import PricesGrid from "./components/PricesGrid";
import Link from "next/link";
import ScrollDownButton from "./components/ScrollDownButton";
import { FiSmartphone } from "react-icons/fi";
import { FaAndroid } from "react-icons/fa6";

export default function Home({searchParams}) {
  return (
    <>
      {searchParams.mobileMode ? (
        <main className="flex h-full flex-col items-center space-y-4">
          <div className="w-full h-full bg-blue flex flex-row max-md:flex-col justify-center items-center max-md:space-y-2">
            <Image src="/catalog-flat-icon.png" alt="catálogo" width={400} height={400}/>
            <div className="flex flex-col items-center space-y-4 max-w-[859px] max-md:text-justify">
              <div>
                <h1 className="text-gray-800 text-5xl max-sm:text-3xl font-black ">Seu catálogo pronto em 10 minutos.</h1>
                <p className="text-xl max-sm:text-lg w-full">Com o Catálogo Maker você é capaz de ter o seu catálogo online ainda hoje e já começar a receber pedidos.</p>
              </div>
              <h2 className="text-lg font-bold">Já tem uma conta ? Entre ou crie uma</h2>
              <div className="flex space-x-4 items-center w-full pb-8">
                <Link href="/auth/signin?mobileMode=True" className="w-1/2">
                    <Button
                    size='xl'
                    className='w-full !bg-cornflowerblue !text-lightcyan hover:!bg-cornflowerblue/90 focus:!ring-jordyblue'>
                        Entrar
                    </Button>
                </Link>
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
        <main className="flex h-full flex-col items-center space-y-4">
          <div className="w-full h-[650px] max-md:h-full bg-blue flex flex-row max-md:flex-col justify-center items-center max-md:space-y-2">
            <Image src="/catalog-flat-icon.png" width={500} height={500}/>
            <div className="flex flex-col items-center space-y-2 max-w-[859px] max-md: text-justify">
              <h1 className="text-gray-800 text-5xl max-sm:text-4xl font-black ">Seu catálogo pronto em 10 minutos.</h1>
              <p className="text-xl max-sm:text-lg w-full">Com o Catálogo Maker você é capaz de ter o seu catálogo online ainda hoje e já começar a receber pedidos.</p>
              <Link href="/auth/signup">
                <Button
                size="xl"
                className="bg-neonblue hover:!bg-neonblue/80 focus:ring-0 shadow-sm shadow-neonblue !mt-4 px-6">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full flex justify-center pt-6">
            <ScrollDownButton destinyId="#prices"/>
          </div>
          <div className="flex flex-col items-center w-full max-w-[1100px] space-y-16 max-md:pt-16">
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
            <div className="flex flex-row max-md:flex-col items-center">
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
                  className="w-72 bg-neonblue hover:!bg-neonblue/80 focus:ring-0 shadow-sm shadow-neonblue !mt-4 px-6">
                    <FaAndroid className="w-6 h-6 mr-2"/> Baixar para Android
                  </Button>
                </a>
              </div>
            </div>
            <PricesGrid/>
            <p className="font-normal text-xl">
              "Ter um catálogo bom é necessidade de todo vendedor; entregar-lhe um catálogo mais do que bom é o nosso objetivo." - Catálogo Maker CEO
            </p>
          </div>
        </main>
      )}
    </>
  );
};
