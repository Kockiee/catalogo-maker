// Este arquivo define a função que cria uma conta de usuário no sistema.
// Se o usuário ainda não existe, ele é cadastrado no banco de dados.
// Se já existe, retorna os dados do usuário existente.

'use server'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export async function createAccount(uid, username, email) {
    // Cria uma referência para o documento do usuário na coleção 'accounts'
    const docRef = doc(db, "accounts", uid);
    // Busca o documento do usuário no banco de dados
    const docSnap = await getDoc(docRef);
    
    // Se o usuário não existe, cria um novo documento com os dados fornecidos
    if (!docSnap.exists()) {
        await setDoc(doc(db, "accounts", uid), {
            uid: uid,
            email: email,
            username: username,
            premium: false
        });
        // Busca os dados do usuário recém-criado
        const createdUser = (await getDoc(docRef)).data();
        // Retorna sucesso e os dados do usuário criado
        return { "success": true, ...createdUser }
    } else {
        // Se o usuário já existe, retorna sucesso e os dados existentes
        return { "success": true, ...docSnap.data() }
    }
};