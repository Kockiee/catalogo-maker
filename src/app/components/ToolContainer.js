'use client'
import { useTool } from "../contexts/ToolContext";
import { Spinner } from "flowbite-react"
import SideBar from "./SideBar";

export default function ToolContainer({children}) {
    const { catalogs } = useTool();

    return (
        <>
        {catalogs === false ? (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-prussianblue">
              <Spinner className="text-lightcyan" size="xl"/>
              <span>Carregando o dashboard...</span>
            </div>        
        ) : (
            <>
                <div className="w-full">
                    <SideBar/>
                    <div className="p-16 max-lg:px-0 max-sm:pt-0 pl-80 pb-48">
                        {children}
                    </div>
                </div>
            </>
        )}
        </>
    )
}