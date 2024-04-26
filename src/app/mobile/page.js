import { Button } from "flowbite-react";
import Image from "next/image";
import { FaAndroid, FaApple } from "react-icons/fa6";

export default function PAGE() {
    return (
        <div className="w-full flex justify-center">
            <div className="flex flex-col items-center pt-8 max-w-4xl h-[600px] max-sm:h-full">
              <h1 className="text-3xl font-bold">Baixe nosso aplicativo para celular.</h1>
              <p className="text-lg">Baixe e instale nosso aplicativo pelo nosso site em aproximadamente 3 minutos para gerenciar seus catálogos em qualquer lugar e a qualquer momento.</p>
              <div className="flex flex-row max-md:flex-col items-center">
                  <div className="p-8">
                      <Image
                      src="/mobile-download-image.png" 
                      width={300} 
                      height={300} 
                      alt="garota mechendo no celular"/>
                  </div>
                  <div className="flex flex-col items-center">
                      <a href={process.env.NEXT_PUBLIC_ANDROID_APK_LINK} target="blank">
                        <Button
                        size="lg"
                        className="w-72 bg-neonblue hover:!bg-neonblue/80 focus:ring-0 shadow-sm shadow-neonblue !mt-4 px-6">
                          <FaAndroid className="w-6 h-6 mr-2"/> Baixar para Android
                        </Button>
                      </a>
                      <Button
                      disabled
                      size="lg"
                      className="w-72 bg-neonblue hover:!bg-neonblue/80 focus:ring-0 shadow-sm shadow-neonblue !mt-4 px-6">
                        <FaApple className="w-6 h-6 mr-2"/> Baixar para IOS (Em Breve)
                      </Button>
                  </div>
              </div>
            </div>
        </div>
    );
}