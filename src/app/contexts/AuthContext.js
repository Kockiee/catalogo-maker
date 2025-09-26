'use client' // Diretiva para indicar que este é um componente do lado do cliente

// Importação de hooks do React necessários para gerenciar estado e efeitos
import { createContext, useContext, useEffect, useState, useCallback } from "react";
// Importação de funções de autenticação do Firebase
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  confirmPasswordReset,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  signOut,
  sendEmailVerification,
  applyActionCode,
  updateProfile,
  browserLocalPersistence,
  deleteUser,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  reload
} from "firebase/auth";
// Importação de hooks de navegação do Next.js
import { useRouter, useSearchParams } from "next/navigation";
// Importação da função de criação de conta do servidor
import { createAccount } from "../actions/createAccount";
// Importação da instância de autenticação do Firebase
import { auth } from "../utils/firebase";

// Função auxiliar para criar um usuário no banco de dados após autenticação
async function createUser(result) {
  // Chama a função do servidor para criar o usuário no banco de dados
  const data = await createAccount(result.uid, result.displayName, result.email);
  return data;
}

// Criação do contexto de autenticação
const AuthContext = createContext();

// Provedor de autenticação que envolve a aplicação
export const AuthProvider = ({ children }) => {
  // Estado para controlar o carregamento durante operações de autenticação
  const [authLoading, setAuthLoading] = useState(false);
  // Estado para armazenar o usuário autenticado do Firebase
  const [user, setUser] = useState(false);
  // Estado para armazenar os dados do usuário do banco de dados
  const [DBUser, setDBUser] = useState(false);
  // Hook de navegação do Next.js
  const router = useRouter();
  // Hook para acessar parâmetros de busca da URL
  const searchParams = useSearchParams();
  // Estado para controlar o modo móvel
  const [mobileMode, setMobileMode] = useState(false);

  // Função para lidar com ações de autenticação e gerenciar o estado de carregamento
  const handleAction = useCallback(async (action) => {
    try {
      // Define o estado de carregamento como verdadeiro antes da ação
      setAuthLoading(true);
      // Executa a ação passada como parâmetro
      await action();
    } finally {
      // Define o estado de carregamento como falso após a ação, independentemente do resultado
      setAuthLoading(false);
    }
  }, []);

  // Função para lidar com a autenticação e definir a persistência
  const handleAuthentication = useCallback(async (authAction) => {
    // Define a persistência como local para manter o usuário logado mesmo após fechar o navegador
    await setPersistence(auth, browserLocalPersistence);
    // Executa a ação de autenticação passada como parâmetro
    await authAction();
  }, [searchParams]); // Inclui searchParams para evitar mudanças inesperadas  

  // Efeito para verificar e definir o modo móvel ao carregar a página
  useEffect(() => {
    if (typeof window !== "undefined") {  // Garante que o código está sendo executado no cliente
      // Verifica se o parâmetro mobileMode está presente na URL
      const modeSearchParams = searchParams.get("mobileMode") === "True" ? true : false;
      // Obtém o modo móvel do armazenamento local
      const mode = JSON.parse(localStorage.getItem("mobileMode"));
      // Se não houver modo definido no armazenamento local, usa o valor da URL
      if(mode === null || mode === undefined) {
        localStorage.setItem("mobileMode", 
          JSON.stringify(modeSearchParams)
        );
        setMobileMode(modeSearchParams);
      } else {
        // Caso contrário, usa o valor do armazenamento local
        setMobileMode(mode)
      }
    }
  }, []);

  // Efeito para observar mudanças no estado de autenticação
  useEffect(() => {
    // Inscreve-se para receber atualizações do estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Se houver um usuário autenticado, obtém o token de ID
        const token = await currentUser.getIdToken();
        // Faz uma requisição para obter os dados do usuário do banco de dados
        const response = await fetch(`/api/auth/get-user/${currentUser.uid}`, {
          headers: {
            'authorization': token,
          },
        });
        const data = await response.json();
        // Se o usuário existir no banco de dados, define o estado DBUser
        if (response.status === 200) {
          setDBUser(data);
        } else if (response.status === 404) {
          // Se o usuário não existir no banco de dados, cria um novo
          const createdUser = await createUser(currentUser);
          setDBUser(createdUser);
        }
        // Define o estado do usuário do Firebase
        setUser(currentUser);
      } else {
        // Se não houver usuário autenticado, limpa os estados
        setUser(null);
        setDBUser(null);
      }
    });
  
    // Função de limpeza para cancelar a inscrição quando o componente for desmontado
    return () => unsubscribe();
  }, []); // Removida a dependência createUser que não é necessária

  // Efeito para lidar com o resultado do redirecionamento de autenticação
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        // Obtém o resultado do redirecionamento de autenticação
        const result = await getRedirectResult(auth);
        if (result?.user) {
        // Usuário autenticado — estado será atualizado pelo onAuthStateChanged
        }
      } catch (error) {
        console.error("Erro ao processar redirecionamento do login:", error);
      }
    };
    handleRedirectResult();
  }, []);
  
  const signUpWithEmailAndPassword = useCallback(async (username, email, password) => {
    await handleAction(async () => {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
    });
  }, [handleAction]);

  const signUpEmailVerification = useCallback(async () => {
    await handleAction(async () => {
      await sendEmailVerification(auth.currentUser);
    });
  }, [handleAction]);

  const loginWithEmailAndPassword = useCallback(async (email, password) => {
    await handleAuthentication(async () => {
      await handleAction(async () => {
        await signInWithEmailAndPassword(auth, email, password);
      });
    });
  }, [handleAction, handleAuthentication]);

  const signInWithGoogle = useCallback(async () => {
    await handleAuthentication(async () => {
      await handleAction(async () => {
        const provider = new GoogleAuthProvider();
        const mode = JSON.parse(localStorage.getItem("mobileMode"));
        if (mode) {
          await signInWithRedirect(auth, provider); // para WebView/mobile
        } else {
          await signInWithPopup(auth, provider); // para desktop
        }
      });
    });
  }, [handleAction, handleAuthentication]);

  const sendForgotPasswordEmail = useCallback(async (email) => {
    await handleAction(async () => {
      await sendPasswordResetEmail(auth, email);
    });
  }, [handleAction]);

  const verifyEmail = useCallback(async (oobCode) => {
    await handleAction(async () => {
      await applyActionCode(auth, oobCode);
      if (auth.currentUser) {
        await reload(auth.currentUser);
      }
      router.push("/auth/signin");
    });
  }, [handleAction, router]);

  const resetPassword = useCallback(async (oobCode, newPassword) => {
    await handleAction(async () => {
      await confirmPasswordReset(auth, oobCode, newPassword);
      router.push("/auth/signin");
    });
  }, [handleAction, router]);

  const logout = useCallback(async () => {
    await handleAction(async () => {
      await signOut(auth)
      setUser(null);
    });
  }, [handleAction]);

  const deleteAccount = useCallback(async () => {
    await handleAction(async () => {
      await fetch('/api/auth/delete-user', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': await auth.currentUser.getIdToken()
        },
        body: JSON.stringify({
          uid: auth.currentUser.uid
        }),
      });
      await deleteUser(auth.currentUser);
      setUser(null)
    });
  }, [handleAction]);

  const context = {
    user,
    DBUser,
    authLoading,
    mobileMode,
    signUpWithEmailAndPassword,
    signUpEmailVerification,
    loginWithEmailAndPassword,
    signInWithGoogle,
    sendForgotPasswordEmail,
    resetPassword,
    logout,
    deleteAccount,
    verifyEmail,
  };

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};