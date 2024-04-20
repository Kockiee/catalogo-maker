'use client'
import { redirect, usePathname } from 'next/navigation'
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "flowbite-react"
import SideBar from "../components/SideBar";
import { ToolProvider } from '../contexts/ToolContext';
import ToolContainer from '../components/ToolContainer';

export const metadata = {
  title: 'Dashboard',
  description: "Com o Catálogo Maker você é capaz de criar um catálogo online para sua loja ainda hoje e já começar a receber pedidos de forma automática.",
};

export default function PAGE({children}) {
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
              <ToolContainer content={
                <div className="w-full">
                  <SideBar/>
                  <div className="p-16 max-lg:px-0 max-sm:pt-0 pl-80 pb-48">
                      {children}
                  </div>
                </div>
              }/>
            </ToolProvider>
          )}
        </div>
    )
}