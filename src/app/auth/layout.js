'use client'
import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import BackButton from '../components/BackButton';

export default function RootLayout({ children }) {
  const { user, DBUser } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mobileMode = searchParams.get("mobileMode");

  useEffect(() => {
    if (user && DBUser) {
      if (user.emailVerified) {
        router.push('/dashboard'); // Correção: usar router.push() ao invés de redirect()
      } else if (pathname !== "/auth/verify-email" && pathname !== "/auth/action") {
        router.push(`/auth/verify-email${mobileMode ? "?mobileMode=True" : ""}`);
      }
    }
  }, [user, DBUser, pathname, mobileMode, router]);

  return (
    <>
      <div className="max-w-4xl w-full">
        <BackButton />
      </div>
      {children}
    </>
  );
}