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
    const isSessionActive = useRef(false);

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
            // Se já está conectado ou sessão não está ativa, não faz nada
            if (isConnected || !isSessionActive.current) {
                return true;
            }
            
            const waSession = await getCatalogWhatsappStatus(`${catalogId}-${userId}`, sessionToken.current);
            
            if (waSession.status === "CONNECTED") {
                // Marca sessão como inativa
                isSessionActive.current = false;
                
                // Limpa os intervalos imediatamente quando conectado
                if (qrIntervalRef.current) {
                    clearInterval(qrIntervalRef.current);
                    qrIntervalRef.current = null;
                }
                if (statusIntervalRef.current) {
                    clearInterval(statusIntervalRef.current);
                    statusIntervalRef.current = null;
                }
                
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
    }, [catalogId, userId, isConnected]);

    const startSession = useCallback(async () => {
        // Limpa intervalos existentes antes de iniciar nova sessão
        if (qrIntervalRef.current) {
            clearInterval(qrIntervalRef.current);
            qrIntervalRef.current = null;
        }
        if (statusIntervalRef.current) {
            clearInterval(statusIntervalRef.current);
            statusIntervalRef.current = null;
        }

        setIsLoading(true);
        setError(null);
        setIsConnected(false);
        isSessionActive.current = true; // Marca sessão como ativa
        
        try {
            // Primeiro carregamento do QR code
            await loadQRCode();
            
            // Intervalo para renovar QR code a cada 30s
            qrIntervalRef.current = setInterval(() => {
                if (isSessionActive.current) {
                    loadQRCode();
                }
            }, 30000);
            
            // Polling para verificar status de conexão
            statusIntervalRef.current = setInterval(async () => {
                try {
                    // Verifica se a sessão ainda está ativa
                    if (isSessionActive.current && statusIntervalRef.current) {
                        await checkConnectionStatus();
                    }
                } catch (err) {
                    console.error('Erro no polling de status:', err);
                }
            }, 9000);
            
        } catch (err) {
            console.error('Erro ao iniciar sessão:', err);
            setError('Erro ao iniciar sessão. Tente novamente.');
            isSessionActive.current = false;
        } finally {
            setIsLoading(false);
        }
    }, [loadQRCode, checkConnectionStatus]);

    const stopSession = useCallback(() => {
        isSessionActive.current = false; // Marca sessão como inativa
        
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

    // Cleanup automático quando o componente é desmontado ou dependências mudam
    useEffect(() => {
        return () => {
            isSessionActive.current = false; // Marca sessão como inativa
            if (qrIntervalRef.current) {
                clearInterval(qrIntervalRef.current);
                qrIntervalRef.current = null;
            }
            if (statusIntervalRef.current) {
                clearInterval(statusIntervalRef.current);
                statusIntervalRef.current = null;
            }
        };
    }, [catalogId, userId]);

    // Para a sessão quando isConnected for true
    useEffect(() => {
        if (isConnected) {
            stopSession();
        }
    }, [isConnected, stopSession]);

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
