/**
 * COMPONENTE DE RODAPÉ
 * 
 * Este arquivo contém o componente de rodapé do Catálogo Maker que exibe
 * informações da empresa, links importantes e copyright. O rodapé só
 * aparece em páginas públicas, sendo ocultado no dashboard.
 * 
 * Funcionalidades:
 * - Logo e nome da empresa
 * - Links de navegação (Sobre nós, Política de privacidade, Termos de uso)
 * - Copyright com ano atual
 * - Ocultação automática no dashboard
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react"; // Importa componentes do Footer do Flowbite
import { usePathname } from 'next/navigation'; // Importa hook para obter o caminho atual da página

export default function CMFooter() {
  // Obtém o caminho atual da página
  const pathname = usePathname()

  return (
    <>
      {/* Só renderiza o rodapé se não estiver na página do dashboard */}
      {!pathname.includes("dashboard") && (
        <Footer container className="mt-16 bg-jordyblue">
          <div className="w-full text-center">
            {/* Área principal do rodapé */}
            <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
              {/* Logo e nome da empresa */}
              <FooterBrand
                href="/" // Link para a página inicial
                src="/logo.png" // Caminho da imagem do logo
                alt="catálogo maker logo" // Texto alternativo da imagem
                name="Catálogo Maker" // Nome da empresa
              />
              {/* Grupo de links do rodapé */}
              <FooterLinkGroup className="text-lightcyan">
                <FooterLink href="/about">Sobre nós</FooterLink> {/* Link para página sobre */}
                <FooterLink href="/privacy-policy">Política de privacidade</FooterLink> {/* Link para política de privacidade */}
                <FooterLink href="/use-terms">Termos de uso</FooterLink> {/* Link para termos de uso */}
              </FooterLinkGroup>
            </div>
            {/* Divisor do rodapé */}
            <FooterDivider />
            {/* Copyright com ano atual */}
            <FooterCopyright 
              href="/" // Link para página inicial
              by="Imagen" // Nome da empresa proprietária
              year={new Date().getFullYear()} // Ano atual obtido dinamicamente
              className="text-lightcyan/70" // Classe para cor do texto
            />
          </div>
        </Footer>
      )}
    </>
  )
}