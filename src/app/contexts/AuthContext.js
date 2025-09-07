'use client'
import { createContext, useContext, useEffect, useState, useCallback } from "react";
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
  getRedirectResult
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { createAccount } from "../actions/createAccount";
import { auth } from "../utils/firebase";

async function createUser(result) {
  const data = await createAccount(result.uid, result.displayName, result.email);
  return data;
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(false);
  const [DBUser, setDBUser] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileMode, setMobileMode] = useState(false);

  const handleAction = useCallback(async (action) => {
    try {
      setAuthLoading(true);
      await action();
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleAuthentication = useCallback(async (authAction) => {
    await setPersistence(auth, browserLocalPersistence);
    await authAction();
  }, [searchParams]); // Inclua searchParams para evitar mudanças inesperadas  

  useEffect(() => {
    if (typeof window !== "undefined") {  // Garante que é no cliente
      const modeSearchParams = searchParams.get("mobileMode") === "True" ? true : false;
      const mode = JSON.parse(localStorage.getItem("mobileMode"));
      if(mode === null || mode === undefined) {
        localStorage.setItem("mobileMode", 
          JSON.stringify(modeSearchParams)
        );
        setMobileMode(modeSearchParams);
      } else {
        setMobileMode(mode)
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const response = await fetch(`/api/auth/get-user/${currentUser.uid}`, {
          headers: {
            'authorization': token,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          setDBUser(data);
        } else if (response.status === 404) {
          const createdUser = await createUser(currentUser);
          setDBUser(createdUser);
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setDBUser(null);
      }
    });
  
    return () => unsubscribe();
  }, [createUser]); // Adiciona a dependência corretamente  

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
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