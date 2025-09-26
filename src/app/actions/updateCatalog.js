// Este arquivo define a função que atualiza os dados de um catálogo existente.
// Permite alterar informações como nome, descrição, cores e imagem do banner do catálogo.

'use server'

// Importa funções para manipular arquivos no Firebase Storage
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// Importa banco de dados e armazenamento do Firebase
import { db, storage } from "../utils/firebase";
// Importa funções para manipular documentos no Firestore
import { collection, doc, getDocs, query, updateDoc, where, getDoc } from "firebase/firestore";

/**
 * Atualiza os dados de um catálogo
 * @param {Object} prevState - Estado anterior do formulário
 * @param {FormData} formData - Dados do formulário
 * @param {string} catalogId - ID do catálogo a ser atualizado
 */
export async function updateCatalog(prevState, formData, catalogId) {
    // Extrai os dados do formulário
    const name = formData.get('identificationName');
    const store_name = formData.get('storeName');
    const store_description = formData.get('storeDescription');
    const primary_color = formData.get('primaryColor');
    const secondary_color = formData.get('secondaryColor');
    const tertiary_color = formData.get('tertiaryColor');
    const text_color = formData.get('textColor');

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (name && store_name && store_description && primary_color && secondary_color && tertiary_color && text_color) {
        // Consulta se já existe outro catálogo com o mesmo nome (evita duplicidade)
        const q = query(collection(db, "catalogs"), where('name', '==', name), where('id', '!=', catalogId));
        const isCatalogNameNotExists = (await getDocs(q)).empty;

        // Se não existe outro catálogo com o mesmo nome, atualiza os dados
        if (isCatalogNameNotExists) {
            const docRef = doc(db, "catalogs", catalogId);
            // Busca os dados atuais do catálogo
            const catalog = (await getDoc(docRef)).data();
            // Atualiza os campos principais do catálogo
            await updateDoc(docRef, {
                name: name,
                store_name: store_name,
                store_description: store_description,
                primary_color: primary_color,
                secondary_color: secondary_color,
                tertiary_color: tertiary_color,
                text_color: text_color,
            });

            // Se foi enviada uma nova imagem de banner, faz upload e atualiza o link
            const bannerImage = formData.get('bannerImage');
            if (bannerImage) {
                const storageRef = ref(storage, `${catalog.owner}/${catalogId}/catalog-banner`);
                await uploadBytes(storageRef, bannerImage);
                await getDownloadURL(storageRef).then(async(url) => {
                    await updateDoc(docRef, {
                      banner_url: url
                    });
                });
            }
            return {message: "catalog-updated"};
        } else {
            return {message: "catalog-name-already-exists"};
        }
    } else {
        return {message: "invalid-params"};
    }
}