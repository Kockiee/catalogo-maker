'use client'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "flowbite-react";
import { ToolProvider } from '../contexts/ToolContext';
import ToolContainer from '../components/ToolContainer';

export default function DashboardLayout({children}) {
    const { DBUser, user } = useAuth()
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const mobileMode = searchParams.get("mobileMode");

    var isPremiumUser = DBUser === false ? null : (DBUser.premium ? true : false)

    if (user === null) {
      return redirect(`/auth/signin${mobileMode && "?mobileMode=True"}`);
    }

    if (user && !user.emailVerified) {
      return redirect(`/auth/verify-email${mobileMode && "?mobileMode=True"}`);
    }

    if (isPremiumUser === false && pathname != "/dashboard/plan" && pathname != "/dashboard/account") {
      return redirect(`/dashboard${mobileMode && "?mobileMode=True"}`)
    }

    return (
        <div>
          {user === false ? (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-prussianblue">
              <Spinner className="text-lightcyan" size="xl"/>
              <span>Carregando...</span>
            </div>
          ) : (
            <ToolProvider user={user}>
              <ToolContainer>
                {children}
              </ToolContainer>
            </ToolProvider>
          )}
        </div>
    )
}