'use client'
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation"
import { HiArrowLeft } from "react-icons/hi"

export default function BackButton() {
    const router = useRouter();

    const handleClick = () => {
        router.back();
    }

    return (
        <Button onClick={handleClick} className="duration-200 inline-flex bg-neonblue hover:!bg-neonblue/80 shadow-md focus:ring-jordyblue text-lightcyan mb-4">
            <HiArrowLeft className="h-6 w-6 mr-0.5"/> Voltar
        </Button>
    )
}