'use client'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'


export default function RootLayout({ children }) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (user && user.emailVerified) {
    return redirect("/dashboard")
  } else if (user && !user.emailVerified) {
    if (pathname != "/auth/verify-email" && pathname != "/auth/action") {
      return redirect("/auth/verify-email")
    }
  }
  
  return (
    <>
      {children}
    </>
  );
}
