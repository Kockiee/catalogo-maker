'use client'
import { Button, Label, Radio } from "flowbite-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ScanQrCode from "./ScanQrCode";
import { setCatalogWhatsapp } from "../actions/setCatalogWhatsapp";
import { useTool } from "../contexts/ToolContext";


export default function PhoneVerification({catalogId}) {
    const [orderForm, setOrderForm] = useState(1);
    const { user } = useAuth()
    const { updateCatalogs } = useTool()

    return (
        <div className="bg-white !border-4 !border-lightcyan p-4 rounded flex flex-wrap">
            <div className="w-full space-y-2">
                <h1 className="text-lg font-bold mb-2">Opa, falta só mais uma informação!</h1>
                <Label
                className="text-lg"
                htmlFor="ordering-form"
                value="Como deseja receber pedidos neste catálogo?"
                />
                <fieldset className="flex flex-col gap-4">
                    <div className="inline-flex items-center space-x-2">
                        <Radio 
                        defaultChecked={orderForm === 1}
                        className="text-neonblue max-sm:w-8 max-sm:h-8 focus:ring-cornflowerblue" 
                        id="receive-cm-notification" 
                        name="forms" 
                        value={1} 
                        onClick={(e) => {if (e.target.checked) setOrderForm(1)}} 
                        /> 
                        <Label htmlFor="receive-cm-notification" value="Receber notificação da Catálogo Maker no WhatsApp"/>
                    </div>
                    <div className="inline-flex items-center space-x-2">
                        <Radio 
                        defaultChecked={orderForm === 2}
                        className="text-neonblue max-sm:w-8 max-sm:h-8 focus:ring-cornflowerblue" 
                        id="use-own-whatsapp" 
                        name="forms" 
                        value={2} 
                        onClick={(e) => {if (e.target.checked) setOrderForm(2)}} 
                        /> 
                        <Label htmlFor="use-own-whatsapp" value="Usar meu próprio WhatsApp" />
                    </div>
                </fieldset>
                {orderForm === 2 && (
                    <ScanQrCode catalogId={catalogId} userId={user.uid} />
                )}
                <Button onClick={async() => {
                    await setCatalogWhatsapp(process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION, process.env.NEXT_PUBLIC_WHATSAPP_API_DEFAULT_SESSION_TOKEN, catalogId)
                    updateCatalogs()
                }} disabled={orderForm === 2} size="md" className="duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full">Continuar</Button>
            </div>
        </div>
    )
}