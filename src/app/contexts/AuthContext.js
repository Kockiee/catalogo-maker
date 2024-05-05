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
  signInWithRedirect,
  getRedirectResult,
  deleteUser,
} from "firebase/auth";
import { auth } from "@/app/utils/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { createAccount } from "../actions/createAccount";

async function createUser(result) {
  const data = await createAccount(result.user.uid, result.user.displayName, result.user.email);
  return data;
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(false);
  const [DBUser, setDBUser] = useState(false);
  const router = useRouter();

  const handleAction = useCallback(async (action) => {
    try {
      setAuthLoading(true);
      await action();
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const handleAuthentication = useCallback(async(authAction) => {
    await setPersistence(auth, browserLocalPersistence);
    await authAction();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
      if (currentUser) {
        const response = await fetch(`/api/auth/get-user/${currentUser.uid}`, {
          headers: {
            'authorization': await currentUser.getIdToken()
          }
        });
        const data = await response.json();
        if(response.status === 200) setDBUser(data);
        setUser(currentUser);
      } else {
        setUser(currentUser);
      }
    });

    getRedirectResult(auth).then(async(result) => {
      if (result) {
        const data = await createUser(result)
        setDBUser(data.createdUser);
      }
    })

    return () => unsubscribe();
  }, []);
  
  const signUpWithEmailAndPassword = useCallback(async (username, email, password) => {
    await handleAction(async () => {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: username,
      });

      await createUser(result)
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
        await signInWithRedirect(auth, provider);
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