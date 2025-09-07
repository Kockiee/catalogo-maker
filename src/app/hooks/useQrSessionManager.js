'use client'
import { useState, useEffect, useCallback, useRef } from 'react';
import { startWhatsappSession } from '@/app/actions/startWhatsappSession';
import { getCatalogWhatsappStatus } from '@/app/actions/getCatalogWhatsappStatus';
import { setCatalogWhatsapp } from '@/app/actions/setCatalogWhatsapp';

export function useQrSessionManager(catalogId, userId) {
    const [qrCode, setQrCode] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    
    const sessionToken = useRef("");
    const qrIntervalRef = useRef(null);
    const statusIntervalRef = useRef(null);

    const loadQRCode = useCallback(async () => {
        try {
            const data = await startWhatsappSession(`${catalogId}-${userId}`, sessionToken.current);
            setQrCode(data.qr);
            sessionToken.current = data.token;
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar QR Code:', err);
            setError('Erro ao gerar QR Code. Tente novamente.');
        }
    }, [catalogId, userId]);

    const checkConnectionStatus = useCallback(async () => {
        try {
            const waSession = await getCatalogWhatsappStatus(`${catalogId}-${userId}`, sessionToken.current);
            
            if (waSession.status === "CONNECTED") {
                await setCatalogWhatsapp(`${catalogId}-${userId}`, sessionToken.current, catalogId);
                setIsConnected(true);
                setQrCode(null); // Remove QR quando conectado
                return true;
            }
            
            return false;
        } catch (err) {
            console.error('Erro ao verificar status da conexão:', err);
            setError('Erro ao verificar conexão. Tente novamente.');
            return false;
        }
    }, [catalogId, userId]);

    const startSession = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsConnected(false);
        
        try {
            // Primeiro carregamento do QR code
            await loadQRCode();
            
            // Intervalo para renovar QR code a cada 30s
            qrIntervalRef.current = setInterval(loadQRCode, 30000);
            
            // Polling para verificar status de conexão
            statusIntervalRef.current = setInterval(async () => {
                const connected = await checkConnectionStatus();
                if (connected) {
                    // Para os intervalos quando conectado
                    if (qrIntervalRef.current) {
                        clearInterval(qrIntervalRef.current);
                        qrIntervalRef.current = null;
                    }
                    if (statusIntervalRef.current) {
                        clearInterval(statusIntervalRef.current);
                        statusIntervalRef.current = null;
                    }
                }
            }, 9000);
            
        } catch (err) {
            console.error('Erro ao iniciar sessão:', err);
            setError('Erro ao iniciar sessão. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [loadQRCode, checkConnectionStatus]);

    const stopSession = useCallback(() => {
        if (qrIntervalRef.current) {
            clearInterval(qrIntervalRef.current);
            qrIntervalRef.current = null;
        }
        if (statusIntervalRef.current) {
            clearInterval(statusIntervalRef.current);
            statusIntervalRef.current = null;
        }
        setQrCode(null);
        setIsConnected(false);
        setError(null);
    }, []);

    // Cleanup automático quando o componente é desmontado
    useEffect(() => {
        return () => {
            if (qrIntervalRef.current) {
                clearInterval(qrIntervalRef.current);
            }
            if (statusIntervalRef.current) {
                clearInterval(statusIntervalRef.current);
            }
        };
    }, []);

    return {
        qrCode,
        isLoading,
        isConnected,
        error,
        startSession,
        stopSession,
        refreshQR: loadQRCode
    };
}
