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
        <ButtonAPP onClick={handleClick} className="mb-6 w-fit">
            <HiArrowLeft className="h-5 w-5 mr-2"/> Voltar
        </ButtonAPP>
    )
}