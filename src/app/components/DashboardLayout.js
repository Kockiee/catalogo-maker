'use client'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "flowbite-react";
import { ToolProvider } from '../contexts/ToolContext';
import ToolContainer from '../components/ToolContainer';
import { useEffect } from 'react';

export default function DashboardLayout({children}) {
    const { DBUser, user, mobileMode } = useAuth();
    const pathname = usePathname();

    var isPremiumUser = DBUser === false ? null : (DBUser.premium ? true : false);

    if (user === null) {
      return redirect(`/auth/signin${mobileMode ? "?mobileMode=True" : ""}`);
    } else if (user && !user.emailVerified) {
      return redirect(`/auth/verify-email${mobileMode ? "?mobileMode=True" : ""}`);
    }
    
    useEffect(() => {
      if (isPremiumUser === false && pathname != "/dashboard/plan" && pathname != "/dashboard/account") {
        return redirect(`/dashboard/plan${mobileMode ? "?mobileMode=True" : ""}`);
      }
    }, [pathname, isPremiumUser])

    // MODIFICAR DELETAR USUÁRIO
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