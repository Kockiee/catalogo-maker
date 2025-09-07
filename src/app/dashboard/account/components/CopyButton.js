'use client'

import { Tooltip } from "flowbite-react"
import { MdOutlineContentCopy } from "react-icons/md"

export default function CopyButton({toCopy, successMessage}) {
    return (
        <>
            <Tooltip content={successMessage} placement="left" className="bg-green-400" arrow={false} trigger="click">
                <button className="duration-200 text-lightcyan bg-cornflowerblue hover:bg-neonblue rounded p-1.5 border border-neonblue ml-2" onClick={() => {
                  navigator.clipboard.writeText(toCopy)
                }}><MdOutlineContentCopy className="w-6 h-6"/></button>
            </Tooltip>
        </>
    )
}