/**
 * AÇÃO DE ATUALIZAR CATÁLOGO
 * 
 * Este arquivo contém a ação server-side para atualizar um catálogo existente
 * no banco de dados Firestore. A função valida os dados, verifica duplicatas,
 * atualiza o documento e, opcionalmente, atualiza o banner.
 * 
 * Funcionalidades:
 * - Atualizar dados do catálogo no Firestore
 * - Validar dados obrigatórios
 * - Verificar nome duplicado (exceto o próprio)
 * - Upload opcional de novo banner
 * - Atualizar cores personalizadas
 * - Retornar status da operação
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Importa funções do Storage
import { db, storage } from "../utils/firebase"; // Importa instâncias do banco e storage
import { collection, doc, getDocs, query, updateDoc, where, getDoc } from "firebase/firestore"; // Importa funções do Firestore

export async function updateCatalog(prevState, formData, catalogId) {
    const name = formData.get('identificationName'); // Nome de identificação do catálogo
    const store_name = formData.get('storeName'); // Nome da loja
    const store_description = formData.get('storeDescription'); // Descrição da loja
    const primary_color = formData.get('primaryColor'); // Cor principal
    const secondary_color = formData.get('secondaryColor'); // Cor secundária
    const tertiary_color = formData.get('tertiaryColor'); // Cor terciária
    const text_color = formData.get('textColor'); // Cor do texto

    // Valida se todos os campos obrigatórios estão presentes
    if (name && store_name && store_description && primary_color && secondary_color && tertiary_color && text_color) {
        
        // Query para verificar se já existe outro catálogo com o mesmo nome
        const q = query(collection(db, "catalogs"), where('name', '==', name), where('id', '!=', catalogId))
        
        const isCatalogNameNotExists = (await getDocs(q)).empty // Verifica se nome está disponível

        if (isCatalogNameNotExists) { // Se nome não está em uso por outro catálogo
            const docRef = doc(db, "catalogs", catalogId); // Cria referência ao documento
            const catalog = (await getDoc(docRef)).data(); // Obtém dados atuais do catálogo
            await updateDoc(docRef, { // Atualiza documento
                name: name, // Atualiza nome de identificação
                store_name: store_name, // Atualiza nome da loja
                store_description: store_description, // Atualiza descrição
                primary_color: primary_color, // Atualiza cor principal
                secondary_color: secondary_color, // Atualiza cor secundária
                tertiary_color: tertiary_color, // Atualiza cor terciária
                text_color: text_color, // Atualiza cor do texto
            });
    
            const bannerImage = formData.get('bannerImage') // Obtém nova imagem de banner (se fornecida)
            if (bannerImage) { // Se há nova imagem de banner
                const storageRef = ref(storage, `${catalog.owner}/${catalogId}/catalog-banner`); // Cria referência no Storage
                await uploadBytes(storageRef, bannerImage); // Faz upload da nova imagem
                await getDownloadURL(storageRef).then(async(url) => { // Obtém URL da imagem
                    await updateDoc(docRef, { // Atualiza documento com nova URL
                      banner_url: url
                    });
                });
            }
            return {message: "catalog-updated"}; // Retorna mensagem de sucesso
        } else {
            return {message: "catalog-name-already-exists"}; // Retorna erro de nome duplicado
        }
    } else {
        return {message: "invalid-params"}; // Retorna erro de parâmetros inválidos
    }
}
