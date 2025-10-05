/**
 * AÇÃO DE CRIAR CATÁLOGO
 * 
 * Este arquivo contém a ação server-side para criar um novo catálogo no
 * banco de dados Firestore. A função valida os dados, verifica duplicatas,
 * cria o documento e faz upload do banner para o Storage.
 * 
 * Funcionalidades:
 * - Criar novo catálogo no Firestore
 * - Validar dados obrigatórios
 * - Verificar catálogos duplicados
 * - Upload de imagem de banner
 * - Armazenar cores personalizadas
 * - Retornar ID do catálogo criado
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Importa funções do Storage
import { db, storage } from "../utils/firebase"; // Importa instâncias do banco e storage
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"; // Importa funções do Firestore

export async function createCatalog(prevState, formData, userId) {
    const uid = userId; // ID do usuário proprietário
    const name = formData.get('identificationName'); // Nome de identificação do catálogo
    const store_name = formData.get('storeName'); // Nome da loja
    const store_description = formData.get('storeDescription'); // Descrição da loja
    const primary_color = formData.get('primaryColor'); // Cor principal
    const secondary_color = formData.get('secondaryColor'); // Cor secundária
    const tertiary_color = formData.get('tertiaryColor'); // Cor terciária
    const text_color = formData.get('textColor'); // Cor do texto

    // Valida se todos os campos obrigatórios estão presentes
    if (uid && name && store_name && store_description && primary_color && secondary_color && tertiary_color && text_color) {
        const colRef = collection(db, "catalogs"); // Cria referência à coleção de catálogos
        // Query para verificar se já existe catálogo com mesmo nome e dono
        const q = query(colRef, where("name", "==", name), where("store_name", "==", store_name), where("owner", "==", uid));
        const querySnapshot = await getDocs(q); // Executa query

        if (!querySnapshot.empty) { // Se encontrou catálogo duplicado
            return {message: "catalog-already-exists"}; // Retorna erro
        }
        
        // Cria novo documento de catálogo
        const newCatalog = await addDoc(colRef, {
            owner: uid, // Proprietário do catálogo
            name: name, // Nome de identificação
            store_name: store_name, // Nome da loja
            store_description: store_description, // Descrição da loja
            primary_color: primary_color, // Cor principal
            secondary_color: secondary_color, // Cor secundária
            tertiary_color: tertiary_color, // Cor terciária
            text_color: text_color, // Cor do texto
            created_at: new Date() // Data de criação
        });

        if (newCatalog) { // Se catálogo foi criado com sucesso
            const bannerImage = formData.get('bannerImage'); // Obtém imagem do banner
            const storageRef = ref(storage, `${uid}/${newCatalog.id}/catalog-banner`); // Cria referência no Storage
            await uploadBytes(storageRef, bannerImage); // Faz upload da imagem
            await getDownloadURL(storageRef).then(async(url) => { // Obtém URL da imagem
                const docRef = doc(db, "catalogs", newCatalog.id); // Cria referência ao documento
                await updateDoc(docRef, { // Atualiza documento com URL do banner
                  banner_url: url
                });
            });
        }

        return { catalogId: newCatalog.id, message: "catalog-created"}; // Retorna sucesso com ID do catálogo
    } else {
        return {message: "invalid-params"}; // Retorna erro de parâmetros inválidos
    }
}
