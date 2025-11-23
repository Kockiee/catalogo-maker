/**
 * Hook para gerenciar sessões do WhatsApp sem QR Code
 * 
 * Este arquivo contém um hook personalizado que gerencia a conexão do WhatsApp
 * através de métodos alternativos ao QR Code. Ele é usado quando o usuário já
 * possui uma sessão ativa ou quando é necessário conectar sem interface visual.
 * 
 * Funcionalidades principais:
 * - Verificação de status de sessões existentes
 * - Inicialização de novas sessões
 * - Polling para aguardar conexão
 * - Vinculação de sessões a catálogos
 * - Tratamento de diferentes estados de conexão
 */

'use client'
// Importa hooks do React para gerenciamento de estado
import { useState, useCallback } from 'react';
// Importa as ações necessárias para gerenciar sessões do WhatsApp
import { getCatalogWhatsappStatus } from '@/app/actions/getCatalogWhatsappStatus';
import { startWhatsappSession } from '@/app/actions/startWhatsappSession';
import { setCatalogWhatsapp } from '@/app/actions/setCatalogWhatsapp';

// Hook principal que gerencia sessões do WhatsApp sem QR Code
export function useWhatsappSessionManager() {
    // Estado que indica se está processando uma operação (conectando, verificando, etc.)
    const [isProcessing, setIsProcessing] = useState(false);
    // Estado que armazena o status atual da sessão (CONNECTED, CLOSED, QRCODE, etc.)
    const [status, setStatus] = useState(null);

    // Função que verifica periodicamente o status de uma sessão até ela conectar ou dar timeout
    const pollSessionStatus = useCallback(async (sessionId, sessionToken, maxAttempts = 30, interval = 2000) => {
        let attempts = 0; // Contador de tentativas para evitar loop infinito
        
        // Retorna uma Promise que resolve quando conecta ou rejeita em caso de erro/timeout
        return new Promise((resolve, reject) => {
            const poll = async () => {
                try {
                    attempts++; // Incrementa o contador de tentativas
                    // Consulta o status atual da sessão
                    const statusResponse = await getCatalogWhatsappStatus(sessionId, sessionToken);
                    const currentStatus = statusResponse.status;
                    
                    // Atualiza o status no estado do componente
                    setStatus(currentStatus);
                    
                    // Se a sessão está conectada, resolve a Promise com sucesso
                    if (currentStatus === 'CONNECTED') {
                        resolve({ status: 'CONNECTED', response: statusResponse });
                        return;
                    }
                    
                    // Se requer QR Code, rejeita a Promise
                    if (currentStatus === 'QRCODE') {
                        reject({ status: 'QRCODE', message: 'Sessão requer QR Code' });
                        return;
                    }
                    
                    // Se atingiu o número máximo de tentativas, rejeita por timeout
                    if (attempts >= maxAttempts) {
                        reject({ status: 'TIMEOUT', message: 'Timeout aguardando conexão' });
                        return;
                    }
                    
                    // Continua polling se status for CLOSED ou outro status intermediário
                    setTimeout(poll, interval); // Agenda próxima verificação
                } catch (error) {
                    // Se houver erro na verificação, rejeita a Promise
                    reject({ status: 'ERROR', message: 'Erro ao verificar status da sessão', error });
                }
            };
            
            poll(); // Inicia o polling
        });
    }, []); // Sem dependências - função estável

    // Função principal que conecta uma sessão do WhatsApp a um catálogo
    const connectWhatsappSession = useCallback(async (sessionId, sessionToken, catalogId, onSuccess, onError) => {
        setIsProcessing(true); // Marca como processando
        setStatus(null); // Limpa status anterior
        
        try {
            // Primeiro, verifica o status atual da sessão
            const initialStatus = await getCatalogWhatsappStatus(sessionId, sessionToken);
            
            // Se já está conectado, vincula diretamente ao catálogo
            if (initialStatus.status === 'CONNECTED') {
                await setCatalogWhatsapp(sessionId, sessionToken, catalogId);
                setStatus('CONNECTED');
                onSuccess?.('WhatsApp conectado com sucesso!');
                return;
            }
            
            // Se a sessão está fechada, tenta iniciar uma nova
            if (initialStatus.status === 'CLOSED') {
                onSuccess?.('Iniciando conexão do WhatsApp. Aguarde...');
                
                try {
                    // Inicia uma nova sessão do WhatsApp
                    await startWhatsappSession(sessionId, sessionToken);
                    
                    // Aguarda a mudança de status com polling
                    const result = await pollSessionStatus(sessionId, sessionToken);
                    
                    // Se conseguiu conectar, vincula ao catálogo
                    if (result.status === 'CONNECTED') {
                        await setCatalogWhatsapp(sessionId, sessionToken, catalogId);
                        setStatus('CONNECTED');
                        onSuccess?.('WhatsApp conectado com sucesso!');
                    }
                } catch (pollError) {
                    // Trata diferentes tipos de erro do polling
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
            // Se houver erro geral, registra e notifica
            console.error('Erro ao conectar sessão WhatsApp:', error);
            onError?.('Erro inesperado ao conectar o WhatsApp.');
            setStatus('ERROR');
        } finally {
            setIsProcessing(false); // Sempre para o processamento
        }
    }, [pollSessionStatus]); // Dependência: recria quando pollSessionStatus muda

    // Retorna todas as funcionalidades e estados do hook
    return {
        connectWhatsappSession, // Função principal para conectar sessão
        isProcessing, // Estado que indica se está processando
        status // Status atual da sessão
    };
}
