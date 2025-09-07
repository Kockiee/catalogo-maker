'use client'

import { Tooltip } from "flowbite-react"
import { MdOutlineContentCopy } from "react-icons/md"
import { useNotifications } from "../../../hooks/useNotifications"

export default function CopyButton({toCopy, successMessage}) {
    const { notify } = useNotifications();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(toCopy);
            notify.copiedToClipboard();
        } catch (error) {
            notify.error("Erro ao copiar para a área de transferência");
        }
    };

    return (
        <>
            <Tooltip content="Copiar" placement="left" className="bg-gray-600" arrow={false}>
                <button 
                    className="duration-200 text-lightcyan bg-cornflowerblue hover:bg-neonblue rounded p-1.5 border border-neonblue ml-2" 
                    onClick={handleCopy}
                >
                    <MdOutlineContentCopy className="w-6 h-6"/>
                </button>
            </Tooltip>
        </>
    )
}