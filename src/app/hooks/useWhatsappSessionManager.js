'use client' 
// Indica que este hook será executado no cliente (React/Next.js App Router)

// Importa hooks do React e funções auxiliares para gerenciar sessões do WhatsApp
import { useState, useCallback } from 'react';
import { getCatalogWhatsappStatus } from '@/app/actions/getCatalogWhatsappStatus';
import { startWhatsappSession } from '@/app/actions/startWhatsappSession';
import { setCatalogWhatsapp } from '@/app/actions/setCatalogWhatsapp';

// Hook customizado responsável por gerenciar a sessão do WhatsApp
export function useWhatsappSessionManager() {
    // Estado que indica se uma operação de conexão está em andamento
    const [isProcessing, setIsProcessing] = useState(false);

    // Estado que guarda o status atual da sessão (CONNECTED, CLOSED, ERROR, etc.)
    const [status, setStatus] = useState(null);

    // Função que realiza polling para verificar o status da sessão do WhatsApp periodicamente
    const pollSessionStatus = useCallback(async (sessionId, sessionToken, maxAttempts = 30, interval = 2000) => {
        let attempts = 0;
        
        return new Promise((resolve, reject) => {
            // Função interna chamada a cada tentativa
            const poll = async () => {
                try {
                    attempts++; // Incrementa o número de tentativas
                    const statusResponse = await getCatalogWhatsappStatus(sessionId, sessionToken); // Consulta status
                    const currentStatus = statusResponse.status;
                    
                    setStatus(currentStatus); // Atualiza estado com o status mais recente
                    
                    if (currentStatus === 'CONNECTED') {
                        // Caso esteja conectado, resolve a Promise com sucesso
                        resolve({ status: 'CONNECTED', response: statusResponse });
                        return;
                    }
                    
                    if (currentStatus === 'QRCODE') {
                        // Caso seja necessário escanear QR Code, rejeita a Promise
                        reject({ status: 'QRCODE', message: 'Sessão requer QR Code' });
                        return;
                    }
                    
                    if (attempts >= maxAttempts) {
                        // Caso ultrapasse o limite de tentativas, rejeita com timeout
                        reject({ status: 'TIMEOUT', message: 'Timeout aguardando conexão' });
                        return;
                    }
                    
                    // Caso contrário, agenda nova verificação após o intervalo definido
                    setTimeout(poll, interval);
                } catch (error) {
                    // Qualquer erro na chamada é tratado aqui
                    reject({ status: 'ERROR', message: 'Erro ao verificar status da sessão', error });
                }
            };
            
            poll(); // Inicia a primeira tentativa
        });
    }, []);

    // Função principal que gerencia a conexão de uma sessão WhatsApp
    const connectWhatsappSession = useCallback(async (sessionId, sessionToken, catalogId, onSuccess, onError) => {
        setIsProcessing(true); // Indica que processo começou
        setStatus(null); // Reseta status anterior
        
        try {
            // Primeiro, obtém o status atual da sessão
            const initialStatus = await getCatalogWhatsappStatus(sessionId, sessionToken);
            
            if (initialStatus.status === 'CONNECTED') {
                // Se já estiver conectado, associa diretamente ao catálogo
                await setCatalogWhatsapp(sessionId, sessionToken, catalogId);
                setStatus('CONNECTED');
                onSuccess?.('WhatsApp conectado com sucesso!');
                return;
            }
            
            if (initialStatus.status === 'CLOSED') {
                // Caso esteja fechado, inicia a sessão do WhatsApp
                onSuccess?.('Iniciando conexão do WhatsApp. Aguarde...');
                
                try {
                    await startWhatsappSession(sessionId, sessionToken); // Cria sessão no servidor
                    
                    // Inicia polling até que status seja atualizado
                    const result = await pollSessionStatus(sessionId, sessionToken);
                    
                    if (result.status === 'CONNECTED') {
                        // Após conectar, associa o WhatsApp ao catálogo
                        await setCatalogWhatsapp(sessionId, sessionToken, catalogId);
                        setStatus('CONNECTED');
                        onSuccess?.('WhatsApp conectado com sucesso!');
                    }
                } catch (pollError) {
                    // Tratamento de erros de polling (QR Code, Timeout, etc.)
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
                // Caso status inicial seja outro não suportado (QRCODE, ERROR, etc.)
                onError?.('Houve um erro ao conectar o WhatsApp. Tente novamente mais tarde.');
                setStatus('ERROR');
            }
        } catch (error) {
            // Captura erros gerais no processo de conexão
            console.error('Erro ao conectar sessão WhatsApp:', error);
            onError?.('Erro inesperado ao conectar o WhatsApp.');
            setStatus('ERROR');
        } finally {
            // Ao fim, encerra estado de processamento
            setIsProcessing(false);
        }
    }, [pollSessionStatus]);

    // Retorna as funções e estados do hook para uso em componentes
    return {
        connectWhatsappSession, // Função para iniciar a conexão
        isProcessing, // Estado para exibir loaders ou bloquear botões
        status // Status atual da sessão
    };
}