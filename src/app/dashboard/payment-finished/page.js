'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MdVerified } from "react-icons/md";

export default function PAGE() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/dashboard')
        }, 3000)
    }, [])
    return (
        <div className="w-full h-full flex justify-center">
            <div className="flex flex-col items-center">
                <MdVerified className="w-32 h-32 text-green-400"/>
                <p className="text-xl">Parabéns, sua conta agora é premium !!!</p>
                <p>Estamos de redirecionando para o painel de controle...</p>
            </div>
        </div>
    )
}