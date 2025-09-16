'use client'
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ToolProvider } from "../../contexts/ToolContext";
import ToolContainer from "./ToolContainer";
import { FullScreenLoader } from "../../components/LoadingSpinner";

export default function DashboardLayout({ children }) {
  const { DBUser, user, mobileMode } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Estado inicial definido como false para evitar re-renderizações inesperadas
  const [isPremiumUser, setIsPremiumUser] = useState(null);

  // Define se o usuário é premium com base no DBUser
  useEffect(() => {
    if (DBUser) {
      setIsPremiumUser(DBUser.premium);
    }
  }, [DBUser]);

  // Redirecionamento baseado no status de login e verificação de email
  useEffect(() => {
    if (user === null) {
      router.push(`/auth/signin${mobileMode ? "?mobileMode=True" : ""}`);
    } else if (user && !user.emailVerified) {
      router.push(`/auth/verify-email${mobileMode ? "?mobileMode=True" : ""}`);
    }
  }, [user, mobileMode, router]);

  // Redirecionamento se o usuário não for premium
  useEffect(() => {
    if (isPremiumUser === false && pathname !== "/dashboard/plan" && pathname !== "/dashboard/account") {
      router.push(`/dashboard/plan${mobileMode ? "?mobileMode=True" : ""}`);
    }
  }, [pathname, isPremiumUser, mobileMode, router]);

  // Exibir um spinner de carregamento enquanto os dados do usuário ainda não foram carregados
  if (user === false || user === null || DBUser === false || DBUser === null) {
    return <FullScreenLoader message="Carregando..." />;
  } else {
    return (
      <ToolProvider user={user}>
        <ToolContainer>{children}</ToolContainer>
      </ToolProvider>
    );
  }
}