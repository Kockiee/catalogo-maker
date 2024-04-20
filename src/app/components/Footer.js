'use client'
import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";
import { usePathname } from 'next/navigation';

export default function CMFooter() {
  const pathname = usePathname()

  return (
    <>
      {!pathname.includes("dashboard") && (
        <Footer container className="mt-16 bg-jordyblue">
          <div className="w-full text-center">
            <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
              <FooterBrand
                href="/"
                src="/logo.png"
                alt="catálogo maker logo"
                name="Catálogo Maker"
              />
              <FooterLinkGroup className="text-lightcyan">
                <FooterLink href="/about">Sobre nós</FooterLink>
                <FooterLink href="/privacy-police">Política de privacidade</FooterLink>
                <FooterLink href="/use-terms">Termos de uso</FooterLink>
              </FooterLinkGroup>
            </div>
            <FooterDivider />
            <FooterCopyright href="/" by="Catálogo Maker™" year={2024} className="text-lightcyan/70" />
          </div>
        </Footer>
      )}
    </>
  )
}