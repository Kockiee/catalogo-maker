import { useTool } from "../contexts/ToolContext";
import { Spinner } from "flowbite-react"

export default function  ToolContainer({children}) {
    const { catalogs } = useTool()

    return (
        <>
        {catalogs === false ? (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-prussianblue">
              <Spinner className="text-lightcyan" size="xl"/>
              <span>Carregando o dashboard...</span>
            </div>        
        ) : (
            <>
            {children}
            </>
        )}
        </>
    )
}