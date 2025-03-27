'use client'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "flowbite-react";
import { ToolProvider } from '../contexts/ToolContext';
import ToolContainer from '../components/ToolContainer';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {
  const { DBUser, user, mobileMode } = useAuth();
  const pathname = usePathname();
  
  // Estado para controlar o status de premium do usuário
  const [isPremiumUser, setIsPremiumUser] = useState(null);

  // useEffect para definir se o usuário é premium
  useEffect(() => {
    if (DBUser) {
      setIsPremiumUser(DBUser.premium ? true : false);
    }
  }, [DBUser]);

  // useEffect para redirecionamento baseado no status de login e email verificado
  useEffect(() => {
    if (user === null) {
      return redirect(`/auth/signin${mobileMode ? "?mobileMode=True" : ""}`);
    } else if (user && !user.emailVerified) {
      return redirect(`/auth/verify-email${mobileMode ? "?mobileMode=True" : ""}`);
    }
  }, [user, mobileMode]);

  // useEffect para redirecionar para a página de plano se o usuário não for premium
  useEffect(() => {
    if (isPremiumUser === false && pathname !== "/dashboard/plan" && pathname !== "/dashboard/account") {
      return redirect(`/dashboard/plan${mobileMode ? "?mobileMode=True" : ""}`);
    }
  }, [pathname, isPremiumUser, mobileMode]);

  // Se o usuário ou o estado premium não estiverem definidos, mostra o carregando
  if (user === null || isPremiumUser === null) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-prussianblue">
        <Spinner className="text-lightcyan" size="xl" />
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <ToolProvider user={user}>
      <ToolContainer>{children}</ToolContainer>
    </ToolProvider>
  );
}
