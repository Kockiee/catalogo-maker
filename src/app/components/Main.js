'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Providers from "./Providers"
import NavBar from "./NavBar"
import CMFooter from "./Footer"

export default function Main({children}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mobileMode = searchParams.get("mobileMode");
  
  return (
    <>
    {!pathname.includes("/catalog/") ? (
      <div className={`bg-periwinkle w-full h-full min-h-screen text-base font-medium text-prussianblue`}>
        <Providers>
          {mobileMode ? (
            <>
              <NavBar/>
              <div className="px-6 h-full">{children}</div>
            </>
          ) : (
            <>
              <NavBar/>
              <div className="px-6">{children}</div>
              <CMFooter/>
            </>
          )}
        </Providers>
      </div>
    ) : (
      <div className="w-full h-full min-h-screen">
        {children}
      </div>
    )}
    </>
  );
}