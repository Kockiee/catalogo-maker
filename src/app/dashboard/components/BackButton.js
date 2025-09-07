'use client'
import { useRouter } from "next/navigation"
import { HiArrowLeft } from "react-icons/hi"
import ButtonAPP from "../../components/ButtonAPP";

export default function BackButton() {
    const router = useRouter();

    const handleClick = () => {
        router.back();
    }

    return (
        <ButtonAPP onClick={handleClick} className="mb-4">
            <HiArrowLeft className="h-6 w-6 mr-0.5"/> Voltar
        </ButtonAPP>
    )
}