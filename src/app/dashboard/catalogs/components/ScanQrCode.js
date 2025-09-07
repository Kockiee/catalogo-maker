'use client'
import { useEffect } from "react";
import QRCodeComponent from "@/app/components/QrCodeComponent";
import { Spinner } from "flowbite-react";
import { CiMenuKebab } from "react-icons/ci";
import { useTool } from "@/app/contexts/ToolContext";
import { useQrSessionManager } from "@/app/hooks/useQrSessionManager";
import { useNotifications } from "@/app/hooks/useNotifications";

export default function ScanQrCode({ catalogId, userId }) {
    const { updateCatalogs } = useTool();
    const { notify } = useNotifications();
    const { 
        qrCode, 
        isLoading, 
        isConnected, 
        error, 
        startSession 
    } = useQrSessionManager(catalogId, userId);

    useEffect(() => {
        startSession();
    }, [startSession]);

    useEffect(() => {
        if (isConnected) {
            notify.success("WhatsApp conectado com sucesso!");
            updateCatalogs();
        }
    }, [isConnected, notify, updateCatalogs]);

    useEffect(() => {
        if (error) {
            notify.error(error);
        }
    }, [error, notify]);

    if (isConnected) {
        return (
            <div className="flex flex-wrap">
                <div className="flex justify-center items-center w-[225px] h-[225px] bg-green-100 rounded-lg">
                    <div className="text-center">
                        <div className="text-green-600 text-4xl mb-2">✓</div>
                        <p className="text-green-600 font-semibold">Conectado!</p>
                    </div>
                </div>
                <div className="p-4 pl-6 text-sm">
                    <p className="text-green-600 font-semibold">WhatsApp conectado com sucesso!</p>
                    <p className="text-gray-600">Agora você pode receber pedidos diretamente no seu WhatsApp.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap">
            {qrCode ? (
                <QRCodeComponent data={qrCode} />
            ) : (
                <div className="flex justify-center items-center w-[225px] h-[225px]">
                    <Spinner className="text-lightcyan" size={'xl'} />
                </div>
            )}
            <div className="p-4 pl-6 text-sm">
                <ul className="list-decimal">
                    <li>Abra a página deste catálogo no computador</li>
                    <li>Abra seu WhatsApp no celular</li>
                    <li>Toque em <CiMenuKebab className="inline-flex" /> no campo superior direito</li>
                    <li>Toque em "Dispositivos conectados"</li>
                    <li>Toque em "Conectar dispositivo"</li>
                    <li>Escaneie o código</li>
                </ul>
                {error && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}