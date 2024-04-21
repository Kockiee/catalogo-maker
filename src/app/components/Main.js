'use client'

import { usePathname } from "next/navigation"
import Providers from "./Providers"
import NavBar from "./NavBar"
import CMFooter from "./Footer"

export default function Main({children}) {
    const pathname = usePathname()
    return (
        <>
        {!pathname.includes("/catalog/") ? (
          <div className={`bg-periwinkle w-full h-full min-h-screen text-base font-medium text-prussianblue`}>
            <Providers>
              <NavBar/>
              <div className="px-8">{children}</div>
              <CMFooter/>
            </Providers>
          </div>
        ) : (
          <div className="w-full h-full min-h-screen">
            {children}
          </div>
        )}
        </>
    )
}