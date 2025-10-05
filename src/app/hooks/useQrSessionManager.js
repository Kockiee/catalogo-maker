/**
 * Hook para gerenciar sessões de QR Code do WhatsApp
 * 
 * Este arquivo contém um hook personalizado que gerencia todo o processo de conexão
 * do WhatsApp através de QR Code. Ele controla a geração, renovação e verificação
 * do status da conexão, além de gerenciar os intervalos de polling para manter
 * a sessão ativa e verificar quando a conexão é estabelecida.
 * 
 * Funcionalidades principais:
 * - Geração e renovação automática de QR Code
 * - Verificação periódica do status da conexão
 * - Gerenciamento de intervalos e cleanup automático
 * - Controle de estado da sessão (ativa/inativa)
 * - Tratamento de erros e estados de loading
 */

'use client'
// Importa hooks do React para gerenciamento de estado e efeitos
import { useState, useEffect, useCallback, useRef } from 'react';
// Importa as ações necessárias para gerenciar a sessão do WhatsApp
import { startWhatsappSession } from '@/app/actions/startWhatsappSession';
import { getCatalogWhatsappStatus } from '@/app/actions/getCatalogWhatsappStatus';
import { setCatalogWhatsapp } from '@/app/actions/setCatalogWhatsapp';

// Hook principal que gerencia a sessão de QR Code do WhatsApp
export function useQrSessionManager(catalogId, userId) {
    // Estado que armazena o QR Code atual para exibição
    const [qrCode, setQrCode] = useState(null);
    // Estado que indica se está carregando (gerando QR ou verificando status)
    const [isLoading, setIsLoading] = useState(true);
    // Estado que indica se o WhatsApp está conectado
    const [isConnected, setIsConnected] = useState(false);
    // Estado que armazena mensagens de erro
    const [error, setError] = useState(null);
    
    // Referência para armazenar o token da sessão atual
    const sessionToken = useRef("");
    // Referência para o intervalo que renova o QR Code
    const qrIntervalRef = useRef(null);
    // Referência para o intervalo que verifica o status da conexão
    const statusIntervalRef = useRef(null);
    // Referência que controla se a sessão está ativa (evita operações desnecessárias)
    const isSessionActive = useRef(false);

    // Função que carrega/gera um novo QR Code para a sessão do WhatsApp
    const loadQRCode = useCallback(async () => {
        try {
            // Chama a API para iniciar uma nova sessão do WhatsApp
            const data = await startWhatsappSession(`${catalogId}-${userId}`, sessionToken.current);
            // Atualiza o QR Code no estado para exibição
            setQrCode(data.qr);
            // Armazena o token da sessão para uso posterior
            sessionToken.current = data.token;
            // Limpa qualquer erro anterior
            setError(null);
        } catch (err) {
            // Registra o erro no console para debug
            console.error('Erro ao carregar QR Code:', err);
            // Define uma mensagem de erro amigável para o usuário
            setError('Erro ao gerar QR Code. Tente novamente.');
        }
    }, [catalogId, userId]); // Dependências: recria a função quando catalogId ou userId mudam

    // Função que verifica se o WhatsApp foi conectado através do QR Code
    const checkConnectionStatus = useCallback(async () => {
        try {
            // Se já está conectado ou sessão não está ativa, não faz nada
            if (isConnected || !isSessionActive.current) {
                return true; // Retorna true para indicar que não precisa verificar
            }
            
            // Consulta o status atual da sessão do WhatsApp
            const waSession = await getCatalogWhatsappStatus(`${catalogId}-${userId}`, sessionToken.current);
            
            // Se o status indica que está conectado
            if (waSession.status === "CONNECTED") {
                // Marca sessão como inativa para parar os intervalos
                isSessionActive.current = false;
                
                // Limpa os intervalos imediatamente quando conectado
                if (qrIntervalRef.current) {
                    clearInterval(qrIntervalRef.current); // Para a renovação do QR Code
                    qrIntervalRef.current = null;
                }
                if (statusIntervalRef.current) {
                    clearInterval(statusIntervalRef.current); // Para a verificação de status
                    statusIntervalRef.current = null;
                }
                
                // Vincula a sessão do WhatsApp ao catálogo
                await setCatalogWhatsapp(`${catalogId}-${userId}`, sessionToken.current, catalogId);
                // Atualiza o estado para indicar que está conectado
                setIsConnected(true);
                setQrCode(null); // Remove QR quando conectado (não é mais necessário)
                return true; // Indica que a conexão foi estabelecida
            }
            
            return false; // Ainda não conectado
        } catch (err) {
            // Registra o erro no console para debug
            console.error('Erro ao verificar status da conexão:', err);
            // Define uma mensagem de erro amigável para o usuário
            setError('Erro ao verificar conexão. Tente novamente.');
            return false; // Indica que houve erro na verificação
        }
    }, [catalogId, userId, isConnected]); // Dependências: recria quando catalogId, userId ou isConnected mudam

    // Função principal que inicia uma nova sessão de QR Code
    const startSession = useCallback(async () => {
        // Limpa intervalos existentes antes de iniciar nova sessão
        if (qrIntervalRef.current) {
            clearInterval(qrIntervalRef.current); // Para qualquer renovação de QR anterior
            qrIntervalRef.current = null;
        }
        if (statusIntervalRef.current) {
            clearInterval(statusIntervalRef.current); // Para qualquer verificação de status anterior
            statusIntervalRef.current = null;
        }

        // Define estados iniciais para a nova sessão
        setIsLoading(true); // Indica que está iniciando
        setError(null); // Limpa erros anteriores
        setIsConnected(false); // Garante que não está conectado
        isSessionActive.current = true; // Marca sessão como ativa
        
        try {
            // Primeiro carregamento do QR code
            await loadQRCode();
            
            // Intervalo para renovar QR code a cada 30s (QR codes expiram)
            qrIntervalRef.current = setInterval(() => {
                if (isSessionActive.current) { // Só renova se a sessão ainda estiver ativa
                    loadQRCode();
                }
            }, 30000); // 30 segundos
            
            // Polling para verificar status de conexão a cada 9 segundos
            statusIntervalRef.current = setInterval(async () => {
                try {
                    // Verifica se a sessão ainda está ativa
                    if (isSessionActive.current && statusIntervalRef.current) {
                        await checkConnectionStatus();
                    }
                } catch (err) {
                    // Registra erro no polling mas não interrompe o processo
                    console.error('Erro no polling de status:', err);
                }
            }, 9000); // 9 segundos
            
        } catch (err) {
            // Se houver erro ao iniciar, registra e define mensagem de erro
            console.error('Erro ao iniciar sessão:', err);
            setError('Erro ao iniciar sessão. Tente novamente.');
            isSessionActive.current = false; // Marca sessão como inativa
        } finally {
            // Sempre para o loading, independente de sucesso ou erro
            setIsLoading(false);
        }
    }, [loadQRCode, checkConnectionStatus]); // Dependências: recria quando as funções mudam

    // Função que para a sessão e limpa todos os recursos
    const stopSession = useCallback(() => {
        isSessionActive.current = false; // Marca sessão como inativa
        
        // Para o intervalo de renovação do QR Code
        if (qrIntervalRef.current) {
            clearInterval(qrIntervalRef.current);
            qrIntervalRef.current = null;
        }
        // Para o intervalo de verificação de status
        if (statusIntervalRef.current) {
            clearInterval(statusIntervalRef.current);
            statusIntervalRef.current = null;
        }
        // Limpa o QR Code da tela
        setQrCode(null);
        // Marca como desconectado
        setIsConnected(false);
        // Limpa mensagens de erro
        setError(null);
    }, []); // Sem dependências - função estável

    // Cleanup automático quando o componente é desmontado ou dependências mudam
    useEffect(() => {
        return () => {
            isSessionActive.current = false; // Marca sessão como inativa
            // Limpa o intervalo de QR Code se existir
            if (qrIntervalRef.current) {
                clearInterval(qrIntervalRef.current);
                qrIntervalRef.current = null;
            }
            // Limpa o intervalo de status se existir
            if (statusIntervalRef.current) {
                clearInterval(statusIntervalRef.current);
                statusIntervalRef.current = null;
            }
        };
    }, [catalogId, userId]); // Executa quando catalogId ou userId mudam

    // Para a sessão automaticamente quando a conexão for estabelecida
    useEffect(() => {
        if (isConnected) {
            stopSession(); // Para todos os intervalos quando conectado
        }
    }, [isConnected, stopSession]); // Executa quando isConnected ou stopSession mudam

    // Retorna todas as funcionalidades e estados do hook
    return {
        qrCode, // QR Code atual para exibição
        isLoading, // Estado de carregamento
        isConnected, // Estado de conexão
        error, // Mensagem de erro se houver
        startSession, // Função para iniciar a sessão
        stopSession, // Função para parar a sessão
        refreshQR: loadQRCode // Função para renovar o QR Code manualmente
    };
}
