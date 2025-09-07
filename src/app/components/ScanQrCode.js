'use client'
import { useEffect, useState, useRef } from "react";
import QRCodeComponent from "./QrCodeComponent";
import { createWhatsappSession } from "../actions/createWhatsappSession";
import { getCatalogWhatsappStatus } from "../actions/getCatalogWhatsappStatus";
import { setCatalogWhatsapp } from "../actions/setCatalogWhatsapp";
import { Spinner } from "flowbite-react";
import { CiMenuKebab } from "react-icons/ci";
import { useTool } from "../contexts/ToolContext";

export default function ScanQrCode({ catalogId, userId }) {
    const [QR, setQR] = useState(null);
    const { updateCatalogs } = useTool();

    const sessionToken = useRef("");

    useEffect(() => {
        let statusIntervalId;
        let qrIntervalId;

        const loadQRCode = async () => {
            const data = await createWhatsappSession(`${catalogId}-${userId}`, sessionToken.current);
            setQR(data.qr);
            sessionToken.current = data.token;
        };

        const init = async () => {
            // Primeiro carregamento imediato do QR code
            await loadQRCode();

            // Intervalo para renovar QR code a cada 30s
            qrIntervalId = setInterval(loadQRCode, 30000);

            // Polling apenas para status de conexão
            statusIntervalId = setInterval(async () => {
                const waSession = await getCatalogWhatsappStatus(`${catalogId}-${userId}`, sessionToken.current);
                if (waSession.status === "CONNECTED") {
                    await setCatalogWhatsapp(`${catalogId}-${userId}`, sessionToken.current, catalogId);
                    await updateCatalogs();
                }
            }, 9000);
        };

        init();

        return () => {
            if (qrIntervalId) clearInterval(qrIntervalId);
            if (statusIntervalId) clearInterval(statusIntervalId);
        };
    }, [catalogId, userId, updateCatalogs]);

    return (
        <div className="flex flex-wrap">
            {QR ? (
                <QRCodeComponent data={QR} />
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
            </div>
        </div>
    );
}