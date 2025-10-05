/**
 * AÇÃO DE CRIAÇÃO DE CONTA
 * 
 * Este arquivo contém a ação server-side para criar uma conta de usuário
 * no banco de dados Firestore. A função verifica se a conta já existe
 * e cria uma nova se necessário.
 * 
 * Funcionalidades:
 * - Criar nova conta no Firestore
 * - Verificar se conta já existe
 * - Retornar dados do usuário criado ou existente
 * - Definir status premium inicial como false
 */

'use server' // Diretiva para indicar que esta função roda no servidor
import { doc, getDoc, setDoc } from "firebase/firestore"; // Importa funções do Firestore
import { db } from "../utils/firebase"; // Importa instância do banco de dados

export async function createAccount(uid, username, email) {
    const docRef = doc(db, "accounts", uid); // Cria referência ao documento da conta
    const docSnap = await getDoc(docRef); // Busca o documento
    
    if (!docSnap.exists()) { // Se a conta não existe
        await setDoc(doc(db, "accounts", uid), { // Cria novo documento
            uid: uid, // ID do usuário
            email: email, // Email do usuário
            username: username, // Nome de usuário
            premium: false // Define premium como false inicialmente
        });
        const createdUser = (await getDoc(docRef)).data(); // Busca dados do usuário criado
        return { "success": true, ...createdUser } // Retorna sucesso e dados do usuário
    } else { // Se a conta já existe
        return { "success": true, ...docSnap.data() } // Retorna sucesso e dados existentes
    }
};
