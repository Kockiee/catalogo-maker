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
                    className={`w-full h-full flex items-center duration-200 !border-b-4 ${negative ? '!bg-error hover:!bg-error/90 focus:!ring-error/50' : '!bg-primary-400 hover:!bg-primary-500 focus:!ring-primary-200'}`} 
                    onClick={onClick}>
                        {children}
                    </Button>
                </Link>
            ) : (
                <Button 
                disabled={disabled}
                type={type} 
                className={`${className} flex items-center duration-200 !border-b-4 ${negative ? '!bg-error hover:!bg-error/90 focus:!ring-error/50' : '!bg-primary-400 hover:!bg-primary-500 focus:!ring-primary-200'}`} 
                onClick={onClick}
                >
                    {children}
                </Button>
            )}
        </>
    )
}