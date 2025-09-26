// Importação dos módulos necessários do Firebase
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Configuração do Firebase usando variáveis de ambiente
 * Estas variáveis são definidas no arquivo .env.local e são públicas (NEXT_PUBLIC_*)
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,              // Chave da API do Firebase
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,      // Domínio de autenticação
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,        // ID do projeto no Firebase
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET, // Bucket de armazenamento
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID, // ID do remetente de mensagens
  appId: process.env.NEXT_PUBLIC_APP_ID,                // ID da aplicação
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID, // ID de medição (Analytics)
};

/**
 * Inicialização da aplicação Firebase
 * Verifica se já existe uma instância da aplicação para evitar duplicação
 * Em desenvolvimento, o hot reload pode criar múltiplas instâncias
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Exportação das instâncias dos serviços Firebase
 * Estas instâncias são usadas em toda a aplicação para interagir com o Firebase
 */
export const auth = getAuth(app);      // Instância de autenticação
export const db = getFirestore(app);   // Instância do banco de dados Firestore
export const storage = getStorage(app); // Instância do armazenamento de arquivos