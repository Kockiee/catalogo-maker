'use client'
import { Button } from "flowbite-react";
import Link from "next/link";

export default function ButtonAPP({children, negative=false, onClick=() => {}, href=null, target, className="", type="submit", disabled=false}) {
    return (
        <>
            {href ? (
                <Link href={href} target={target} className={className}>
                    <Button
                    disabled={disabled}
                    className={`w-full h-full flex items-center duration-200 !border-b-4 ${negative ? '!bg-red-500 hover:!bg-red-600 focus:!ring-red-400' : '!bg-neonblue hover:!bg-neonblue/90 focus:!ring-periwinkle'}`} 
                    onClick={onClick}>
                        {children}
                    </Button>
                </Link>
            ) : (
                <Button 
                disabled={disabled}
                type={type} 
                className={`${className} flex items-center duration-200 !border-b-4 ${negative ? '!bg-red-500 hover:!bg-red-600 focus:!ring-red-400' : '!bg-neonblue hover:!bg-neonblue/90 focus:!ring-periwinkle'}`} 
                onClick={onClick}
                >
                    {children}
                </Button>
            )}
        </>
    )
}