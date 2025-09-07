'use client'
import { useState, useCallback } from 'react';
import { getCatalogWhatsappStatus } from '@/app/actions/getCatalogWhatsappStatus';
import { startWhatsappSession } from '@/app/actions/startWhatsappSession';
import { setCatalogWhatsapp } from '@/app/actions/setCatalogWhatsapp';

export function useWhatsappSessionManager() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState(null);

    const pollSessionStatus = useCallback(async (sessionId, sessionToken, maxAttempts = 30, interval = 2000) => {
        let attempts = 0;
        
        return new Promise((resolve, reject) => {
            const poll = async () => {
                try {
                    attempts++;
                    const statusResponse = await getCatalogWhatsappStatus(sessionId, sessionToken);
                    const currentStatus = statusResponse.status;
                    
                    setStatus(currentStatus);
                    
                    if (currentStatus === 'CONNECTED') {
                        resolve({ status: 'CONNECTED', response: statusResponse });
                        return;
                    }
                    
                    if (currentStatus === 'QRCODE') {
                        reject({ status: 'QRCODE', message: 'Sessão requer QR Code' });
                        return;
                    }
                    
                    if (attempts >= maxAttempts) {
                        reject({ status: 'TIMEOUT', message: 'Timeout aguardando conexão' });
                        return;
                    }
                    
                    // Continua polling se status for CLOSED ou outro status intermediário
                    setTimeout(poll, interval);
                } catch (error) {
                    reject({ status: 'ERROR', message: 'Erro ao verificar status da sessão', error });
                }
            };
            
            poll();
        });
    }, []);

    const connectWhatsappSession = useCallback(async (sessionId, sessionToken, catalogId, onSuccess, onError) => {
        setIsProcessing(true);
        setStatus(null);
        
        try {
            // Primeiro, verifica o status atual
            const initialStatus = await getCatalogWhatsappStatus(sessionId, sessionToken);
            
            if (initialStatus.status === 'CONNECTED') {
                // Já conectado, vincula diretamente
                await setCatalogWhatsapp(sessionId, sessionToken, catalogId);
                setStatus('CONNECTED');
                onSuccess?.('WhatsApp conectado com sucesso!');
                return;
            }
            
            if (initialStatus.status === 'CLOSED') {
                // Inicia a sessão e aguarda o resultado
                onSuccess?.('Iniciando conexão do WhatsApp. Aguarde...');
                
                try {
                    await startWhatsappSession(sessionId, sessionToken);
                    
                    // Aguarda a mudança de status com polling
                    const result = await pollSessionStatus(sessionId, sessionToken);
                    
                    if (result.status === 'CONNECTED') {
                        await setCatalogWhatsapp(sessionId, sessionToken, catalogId);
                        setStatus('CONNECTED');
                        onSuccess?.('WhatsApp conectado com sucesso!');
                    }
                } catch (pollError) {
                    if (pollError.status === 'QRCODE') {
                        onError?.('Houve um erro ao conectar o WhatsApp. Tente novamente mais tarde.');
                    } else if (pollError.status === 'TIMEOUT') {
                        onError?.('Timeout ao conectar o WhatsApp. Tente novamente.');
                    } else {
                        onError?.('Erro inesperado ao conectar o WhatsApp.');
                    }
                    setStatus('ERROR');
                }
            } else {
                // Status não suportado (QRCODE, ERROR, etc.)
                onError?.('Houve um erro ao conectar o WhatsApp. Tente novamente mais tarde.');
                setStatus('ERROR');
            }
        } catch (error) {
            console.error('Erro ao conectar sessão WhatsApp:', error);
            onError?.('Erro inesperado ao conectar o WhatsApp.');
            setStatus('ERROR');
        } finally {
            setIsProcessing(false);
        }
    }, [pollSessionStatus]);

    return {
        connectWhatsappSession,
        isProcessing,
        status
    };
}
