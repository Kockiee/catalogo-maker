'use client'
import { redirect, useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import BackButton from '../components/BackButton';


export default function RootLayout({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mobileMode = searchParams.get("mobileMode");

  if (user) {
    if (user.emailVerified) {
      return redirect(`/dashboard`);
    } else if (pathname !== "/auth/verify-email" && pathname !== "/auth/action") {
      return redirect(`/auth/verify-email${mobileMode ? "?mobileMode=True" : ""}`);
    }
  }
  
  
  return (
    <>
      <div className="max-w-4xl w-full">
          <BackButton/>
      </div>
      {children}
    </>
  );
}
