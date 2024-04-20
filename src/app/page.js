'use client'
import Image from "next/image";
import { Button } from "flowbite-react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { HiArrowDown, HiCurrencyDollar, HiLightningBolt } from "react-icons/hi";
import PricesGrid from "./components/PricesGrid";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center space-y-4">
      <div className="w-full h-[650px] max-md:h-full bg-blue flex flex-row max-md:flex-col justify-center items-center max-md:space-y-2">
        <Image src="/catalog-flat-icon.png" width={500} height={500}/>
        <div className="flex flex-col items-center space-y-2 max-w-[859px] max-md:text-justify">
          <h1 className="text-gray-800 text-5xl font-black ">Seu catálogo pronto em 10 minutos.</h1>
          <p className="text-xl w-full">Com o Catálogo Maker você é capaz de ter o seu catálogo online ainda hoje e já começar a receber pedidos !</p>
          <Link href="/auth/signup">
            <Button
            size="xl"
            className="bg-neonblue hover:!bg-neonblue/80 focus:ring-0 shadow-sm shadow-neonblue !mt-4 px-6">
              Começar Agora
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <button
        className="bg-cornflowerblue hover:opacity-70 rounded-full animate-bounce p-3"
        onClick={() => {
          const destiny = document.querySelector("#prices");
          window.scrollTo({
            top: destiny.offsetTop,
            behavior: 'smooth'
          });
        }}
        >
          <HiArrowDown className="text-lightcyan w-8 h-8 "/>
        </button>
      </div>
      <div className="flex flex-col items-center w-full max-w-[1100px] space-y-16 max-md:pt-16">
        <div className="flex flex-row max-md:flex-col items-center">
          <AiOutlineWhatsApp className="text-neonblue w-28 h-28"/>
          <div className="flex flex-col pl-6 max-md:pl-0 max-w-[780px]">
            <h1 className="text-gray-800 text-2xl ">
              Receba seus pedidos via Whatsapp.
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
        <PricesGrid/>
        {/* <p className="max-w-[900px] text-2xl py-4 text-justify text-cornflowerblue">"Ter um catálogo bom é uma necessidade de todo vendedor; entregar-lhe um catálogo mais do que bom é o nosso objetivo." - Catálogo Maker CEO</p> */}
        {/* <div>
          <h1 className="text-xl font-bold text-prussianblue"></h1>
          <p>
            
          </p>
        </div> */}
          <p className="font-normal text-xl">
            "Ter um catálogo bom é necessidade de todo vendedor; entregar-lhe um catálogo mais do que bom é o nosso objetivo." - Catálogo Maker CEO
          </p>
      </div>
    </main>
  );
};
