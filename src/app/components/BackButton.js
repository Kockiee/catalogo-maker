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
        <Button onClick={handleClick} className="inline-flex bg-cornflowerblue hover:!bg-neonblue/80 border-jordyblue border-4 focus:ring-jordyblue text-lightcyan mb-4">
            <HiArrowLeft className="h-6 w-6 mr-0.5"/> Voltar
        </Button>
    )
}