'use client'
import { redirect, usePathname } from 'next/navigation'
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "flowbite-react"
import SideBar from "../components/SideBar";
import { ToolProvider } from '../contexts/ToolContext';
import ToolContainer from '../components/ToolContainer';

export default function DashboardLayout({children}) {
    const { DBUser, user } = useAuth()
    const pathname = usePathname()

    var isPremiumUser = DBUser === false ? null : (DBUser.premium ? true : false)

    if (user === null) {
      return redirect('/auth/signin');
    }

    if (user && !user.emailVerified) {
      return redirect('/auth/verify-email');
    }

    if (isPremiumUser === false && pathname != "/dashboard/plan" && pathname != "/dashboard/account") {
      return redirect('/dashboard/plan')
    }

    return (
        <div>
          {user === false ? (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-prussianblue">
              <Spinner className="text-lightcyan" size="xl"/>
              <span>Carregando...</span>
            </div>
          ) : (
            <ToolProvider userID={user.uid}>
              <ToolContainer>
                {children}
              </ToolContainer>
            </ToolProvider>
          )}
        </div>
    )
}