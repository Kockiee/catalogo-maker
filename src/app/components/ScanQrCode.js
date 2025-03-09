'use client'
import { useEffect, useState } from "react";
import QRCodeComponent from "./QrCodeComponent";
import { createWhatsappSession } from "../actions/createWhatsappSession";
import { getCatalogWhatsapp } from "../actions/getCatalogWhatsapp";
import { setCatalogWhatsapp } from "../actions/setCatalogWhatsapp";
import { Spinner } from "flowbite-react";
import { CiMenuKebab } from "react-icons/ci";
import { useTool } from "../contexts/ToolContext";

export default function ScanQrCode({catalogId, userId}) {
    const [QR, setQR] = useState(null);
    const { updateCatalogs } = useTool();

    useEffect(() => {
        const loadQRCode = async() => {
            const data = await createWhatsappSession(`${catalogId}-${userId}`);
            setQR(data.qr);
        }

        const generateQRIntervalId = setInterval(loadQRCode, 50000);
        const verifyQRCodeScan = setInterval(async () => {
            const waSession = await getCatalogWhatsapp(`${catalogId}-${userId}`);
            if (waSession.state === "CONNECTED") {
                await setCatalogWhatsapp(`${catalogId}-${userId}`, catalogId);
                await updateCatalogs();
            }
        }, 5000);
        
        loadQRCode();
        
        return () => {
            clearInterval(generateQRIntervalId);
            clearInterval(verifyQRCodeScan);
        }
    }, [catalogId, userId, updateCatalogs]);

    return (
        <div className="flex flex-wrap">
            {QR ? (
                <QRCodeComponent data={QR} />
            ) : (
                <div className="flex justify-center items-center w-[225px] h-[225px]">
                    <Spinner className="text-lightcyan" size={'xl'}/>
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
            </div>
        </div>
    )
}