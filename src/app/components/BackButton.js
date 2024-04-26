'use client'
import { useRouter } from "next/navigation"
import { HiArrowLeft } from "react-icons/hi"

export default function BackButton() {
    const router = useRouter();

    const handleClick = () => {
        router.back();
    }

    return (
        <button onClick={handleClick} className="inline-flex w-full max-sm:pl-0 pl-4 py-4 pr-4">
            <HiArrowLeft className="h-6 w-6 mr-0.5"/> Voltar
        </button>
    )
}