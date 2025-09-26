'use client' // Diretiva para indicar que este código executa no cliente

// Importação de componentes do Flowbite React para construção do rodapé
import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";
// Importação do hook usePathname para obter o caminho atual da URL
import { usePathname } from 'next/navigation';

// Componente de rodapé personalizado da aplicação
export default function CMFooter() {
  // Obtém o caminho atual da URL para renderização condicional
  const pathname = usePathname()

  return (
    <>
      {/* Renderiza o rodapé apenas quando não estiver na área de dashboard */}
      {!pathname.includes("dashboard") && (
        <Footer container className="mt-16 bg-jordyblue">
          <div className="w-full text-center">
            <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
              {/* Logo e nome da aplicação no rodapé */}
              <FooterBrand
                href="/"
                src="/logo.png"
                alt="catálogo maker logo"
                name="Catálogo Maker"
              />
              {/* Links importantes no rodapé */}
              <FooterLinkGroup className="text-lightcyan">
                <FooterLink href="/about">Sobre nós</FooterLink>
                <FooterLink href="/privacy-policy">Política de privacidade</FooterLink>
                <FooterLink href="/use-terms">Termos de uso</FooterLink>
              </FooterLinkGroup>
            </div>
            {/* Linha divisória no rodapé */}
            <FooterDivider />
            {/* Informações de copyright com ano atual */}
            <FooterCopyright href="/" by="Imagen" year={new Date().getFullYear()} className="text-lightcyan/70" />
          </div>
        </Footer>
      )}
    </>
  )
}