/**
 * CONTEXTO DE AUTENTICAÇÃO
 * 
 * Este arquivo contém o contexto de autenticação do Catálogo Maker, que gerencia
 * toda a lógica de autenticação da aplicação, incluindo login, logout, cadastro,
 * recuperação de senha e integração com Firebase Auth.
 * 
 * Funcionalidades:
 * - Cadastro com email e senha
 * - Login com email e senha
 * - Login com Google (popup e redirect)
 * - Recuperação de senha
 * - Verificação de email
 * - Logout
 * - Exclusão de conta
 * - Persistência de autenticação
 * - Gerenciamento de modo mobile
 * - Sincronização com banco de dados
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { createContext, useContext, useEffect, useState, useCallback } from "react"; // Importa hooks do React
import {
  GoogleAuthProvider, // Provider para login com Google
  createUserWithEmailAndPassword, // Função para criar usuário com email e senha
  signInWithEmailAndPassword, // Função para fazer login com email e senha
  confirmPasswordReset, // Função para confirmar reset de senha
  sendPasswordResetEmail, // Função para enviar email de recuperação
  onAuthStateChanged, // Listener para mudanças no estado de autenticação
  setPersistence, // Função para definir persistência da sessão
  signOut, // Função para fazer logout
  sendEmailVerification, // Função para enviar email de verificação
  applyActionCode, // Função para aplicar código de ação (verificação)
  updateProfile, // Função para atualizar perfil do usuário
  browserLocalPersistence, // Tipo de persistência local do navegador
  deleteUser, // Função para deletar usuário
  signInWithPopup, // Função para login com popup
  signInWithRedirect, // Função para login com redirect
  getRedirectResult // Função para obter resultado do redirect
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation"; // Hooks de navegação do Next.js
import { createAccount } from "../actions/createAccount"; // Ação para criar conta no banco de dados
import { auth } from "../utils/firebase"; // Instância de autenticação do Firebase

// Função auxiliar para criar usuário no banco de dados
async function createUser(result) {
  const data = await createAccount(result.uid, result.displayName, result.email); // Cria registro no banco
  return data; // Retorna dados do usuário criado
}

// Cria o contexto de autenticação
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado de carregamento das operações de autenticação
  const [authLoading, setAuthLoading] = useState(false);
  // Usuário autenticado do Firebase
  const [user, setUser] = useState(false);
  // Usuário do banco de dados
  const [DBUser, setDBUser] = useState(false);
  // Hook de navegação
  const router = useRouter();
  // Parâmetros de busca da URL
  const searchParams = useSearchParams();
  // Estado para controlar modo mobile
  const [mobileMode, setMobileMode] = useState(false);

  // Função wrapper para ações que requerem loading
  const handleAction = useCallback(async (action) => {
    try {
      setAuthLoading(true); // Ativa loading
      await action(); // Executa a ação
    } finally {
      setAuthLoading(false); // Desativa loading sempre
    }
  }, []);

  // Função wrapper para ações de autenticação que requerem persistência
  const handleAuthentication = useCallback(async (authAction) => {
    await setPersistence(auth, browserLocalPersistence); // Define persistência local
    await authAction(); // Executa a ação de autenticação
  }, [searchParams]); // Inclui searchParams para evitar mudanças inesperadas  

  // Efeito para configurar modo mobile baseado em localStorage e parâmetros de URL
  useEffect(() => {
    if (typeof window !== "undefined") {  // Garante que é no cliente
      const modeSearchParams = searchParams.get("mobileMode") === "True" ? true : false; // Verifica parâmetro de URL
      const mode = JSON.parse(localStorage.getItem("mobileMode")); // Obtém modo do localStorage
      if(mode === null || mode === undefined) { // Se não há valor no localStorage
        localStorage.setItem("mobileMode", 
          JSON.stringify(modeSearchParams) // Salva valor dos parâmetros
        );
        setMobileMode(modeSearchParams); // Define o estado
      } else {
        setMobileMode(mode) // Usa valor do localStorage
      }
    }
  }, []);

  // Efeito para monitorar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) { // Se há usuário autenticado
        const token = await currentUser.getIdToken(); // Obtém token do usuário
        const response = await fetch(`/api/auth/get-user/${currentUser.uid}`, {
          headers: {
            'authorization': token, // Envia token no header
          },
        });
        const data = await response.json(); // Obtém dados da resposta
        if (response.status === 200) { // Se usuário existe no banco
          setDBUser(data); // Define dados do banco
        } else if (response.status === 404) { // Se usuário não existe no banco
          const createdUser = await createUser(currentUser); // Cria usuário no banco
          setDBUser(createdUser); // Define dados do usuário criado
        }
        setUser(currentUser); // Define usuário do Firebase
      } else { // Se não há usuário autenticado
        setUser(null); // Limpa usuário do Firebase
        setDBUser(null); // Limpa usuário do banco
      }
    });
  
    return () => unsubscribe(); // Limpa listener ao desmontar
  }, [createUser]); // Adiciona a dependência corretamente  

  // Efeito para lidar com resultado de redirect de autenticação
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth); // Obtém resultado do redirect
        if (result?.user) {
        // Usuário autenticado — estado será atualizado pelo onAuthStateChanged
        }
      } catch (error) {
        console.error("Erro ao processar redirecionamento do login:", error);
      }
    };
    handleRedirectResult(); // Executa ao montar
  }, []);
  
  // Função para cadastro com email e senha
  const signUpWithEmailAndPassword = useCallback(async (username, email, password) => {
    await handleAction(async () => {
      await createUserWithEmailAndPassword(auth, email, password); // Cria usuário no Firebase
      await updateProfile(auth.currentUser, {
        displayName: username, // Define nome de exibição
      });
    });
  }, [handleAction]);

  // Função para enviar email de verificação
  const signUpEmailVerification = useCallback(async () => {
    await handleAction(async () => {
      await sendEmailVerification(auth.currentUser); // Envia email de verificação
    });
  }, [handleAction]);

  // Função para login com email e senha
  const loginWithEmailAndPassword = useCallback(async (email, password) => {
    await handleAuthentication(async () => {
      await handleAction(async () => {
        await signInWithEmailAndPassword(auth, email, password); // Faz login no Firebase
      });
    });
  }, [handleAction, handleAuthentication]);

  // Função para login com Google
  const signInWithGoogle = useCallback(async () => {
    await handleAuthentication(async () => {
      await handleAction(async () => {
        const provider = new GoogleAuthProvider(); // Cria provider do Google
        const mode = JSON.parse(localStorage.getItem("mobileMode")); // Verifica modo mobile
        if (mode) {
          await signInWithRedirect(auth, provider); // para WebView/mobile usa redirect
        } else {
          await signInWithPopup(auth, provider); // para desktop usa popup
        }
      });
    });
  }, [handleAction, handleAuthentication]);

  // Função para enviar email de recuperação de senha
  const sendForgotPasswordEmail = useCallback(async (email) => {
    await handleAction(async () => {
      await sendPasswordResetEmail(auth, email); // Envia email de recuperação
    });
  }, [handleAction]);

  // Função para verificar email
  const verifyEmail = useCallback(async (oobCode) => {
    await handleAction(async () => {
      const code = typeof oobCode === 'string' ? decodeURIComponent(oobCode) : String(oobCode);
      try {
        // Verifica previamente o código de ação para mensagens mais claras
        const { operation } = await import('firebase/auth').then(m => m.checkActionCode(auth, code));
        // Apenas por segurança: esperamos operação VERIFY_EMAIL
        if (operation) {
          await applyActionCode(auth, code);
        } else {
          await applyActionCode(auth, code);
        }
      } catch (error) {
        // Se o código já foi usado, tentamos tratar como sucesso se o usuário já estiver verificado
        if (error && error.code === 'auth/invalid-action-code') {
          try {
            if (auth.currentUser) {
              await auth.currentUser.reload();
              if (auth.currentUser.emailVerified) {
                setUser(auth.currentUser);
                return; // Considera sucesso
              }
            }
          } catch {}
        }
        throw error; // Propaga para tratamento da UI
      }
      // Atualiza o usuário atual (se estiver logado) para refletir a verificação
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setUser(auth.currentUser);
      }
    });
  }, [handleAction]);

  // Função para resetar senha
  const resetPassword = useCallback(async (oobCode, newPassword) => {
    await handleAction(async () => {
      await confirmPasswordReset(auth, oobCode, newPassword); // Confirma nova senha
      router.push("/auth/signin"); // Redireciona para login
    });
  }, [handleAction, router]);

  // Função para fazer logout
  const logout = useCallback(async () => {
    await handleAction(async () => {
      await signOut(auth) // Faz logout no Firebase
      setUser(null); // Limpa estado do usuário
    });
  }, [handleAction]);

  // Função para deletar conta
  const deleteAccount = useCallback(async () => {
    await handleAction(async () => {
      await fetch('/api/auth/delete-user', { // Deleta dados do banco
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': await auth.currentUser.getIdToken() // Envia token
        },
        body: JSON.stringify({
          uid: auth.currentUser.uid // Envia UID
        }),
      });
      await deleteUser(auth.currentUser); // Deleta usuário do Firebase
      setUser(null) // Limpa estado
    });
  }, [handleAction]);

  // Função para recarregar o estado do usuário atual e retornar o usuário atualizado
  const refreshCurrentUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
      return auth.currentUser;
    }
    return null;
  }, []);

  // Objeto com todos os valores e funções do contexto
  const context = {
    user, // Usuário do Firebase
    DBUser, // Usuário do banco de dados
    authLoading, // Estado de carregamento
    mobileMode, // Modo mobile
    signUpWithEmailAndPassword, // Função de cadastro
    signUpEmailVerification, // Função de verificação de email
    loginWithEmailAndPassword, // Função de login
    signInWithGoogle, // Função de login com Google
    sendForgotPasswordEmail, // Função de recuperação de senha
    resetPassword, // Função de reset de senha
    logout, // Função de logout
    deleteAccount, // Função de deletar conta
    verifyEmail, // Função de verificar email
    refreshCurrentUser, // Função para recarregar usuário atual
  };

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext); // Retorna o contexto
};
