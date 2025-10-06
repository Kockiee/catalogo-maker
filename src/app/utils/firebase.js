/**
 * CONFIGURAÇÃO DO FIREBASE - SERVIÇOS DE BACKEND
 * 
 * Este arquivo configura e inicializa os serviços do Firebase para a aplicação
 * Catálogo Maker. O Firebase fornece autenticação, banco de dados e armazenamento
 * de arquivos para a plataforma.
 * 
 * Funcionalidades:
 * - Configuração da conexão com Firebase
 * - Inicialização dos serviços de autenticação
 * - Configuração do banco de dados Firestore
 * - Configuração do armazenamento de arquivos
 * - Gerenciamento de instâncias do Firebase
 */

// Importa funções para gerenciar aplicações Firebase
import { getApp, getApps, initializeApp } from "firebase/app";
// Importa função para autenticação
import { getAuth } from "firebase/auth";
// Importa função para banco de dados Firestore
import { getFirestore } from "firebase/firestore";
// Importa função para armazenamento de arquivos
import { getStorage } from "firebase/storage";

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY, // Chave da API do Firebase
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN, // Domínio para autenticação
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID, // ID do projeto Firebase
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET, // Bucket de armazenamento
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID, // ID do remetente de mensagens
  appId: process.env.NEXT_PUBLIC_APP_ID, // ID da aplicação
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID, // ID para analytics
};

// Inicializa o Firebase apenas se não houver uma instância existente
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta instância de autenticação do Firebase
export const auth = getAuth(app);

// Exporta instância do banco de dados Firestore
export const db = getFirestore(app);

// Exporta instância do armazenamento de arquivos
export const storage = getStorage(app);