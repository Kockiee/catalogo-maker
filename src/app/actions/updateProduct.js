/**
 * AÇÃO DE ATUALIZAR PRODUTO
 * 
 * Este arquivo contém a ação server-side para atualizar um produto existente
 * no banco de dados Firestore. A função valida os dados, verifica duplicatas,
 * atualiza o documento e gerencia imagens (adiciona novas e remove antigas).
 * 
 * Funcionalidades:
 * - Atualizar dados do produto no Firestore
 * - Validar dados obrigatórios
 * - Verificar nome duplicado (exceto o próprio)
 * - Deletar imagens removidas do Storage
 * - Upload de novas imagens
 * - Atualizar variações do produto
 * - Retornar status da operação
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Importa funções do Storage
import { db, storage } from "../utils/firebase"; // Importa instâncias do banco e storage
import { collection, doc, getDocs, query, updateDoc, where, getDoc } from "firebase/firestore"; // Importa funções do Firestore

export async function updateProduct(prevState, formData, catalogId, productId, variants) {
    const imagesToCreate = formData.getAll('imagesToCreate'); // Obtém novas imagens a serem adicionadas
    const imagesToDelete = formData.getAll('imagesToDelete'); // Obtém URLs de imagens a serem removidas
    const name = formData.get('name'); // Nome do produto
    const price = parseFloat(formData.get('price')); // Preço do produto (convertido para número)
    const description = formData.get('description'); // Descrição do produto
    const soldInCatalog = formData.get('soldInCatalog') || false; // Se o produto é vendido no catálogo

    // Valida se todos os campos obrigatórios estão presentes
    if (name && description && price && imagesToDelete && imagesToCreate) {
        const colRef = collection(db, "products"); // Cria referência à coleção de produtos
        // Query para verificar se já existe outro produto com o mesmo nome no catálogo
        const q = query(colRef, where("name", "==", name), where("id", "!=", productId), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q); // Executa query

        if (!querySnapshot.empty) { // Se encontrou produto duplicado
            return {message: "product-already-exists"}; // Retorna erro
        }

        const docRef = doc(db, "products", productId); // Cria referência ao documento
        const docSnap = await getDoc(docRef); // Obtém dados atuais do produto

        var productImages = docSnap.data().images // Obtém array de URLs das imagens atuais

        // Atualiza dados básicos do produto
        await updateDoc(docRef, {
            name: name, // Atualiza nome
            price: price, // Atualiza preço
            description: description, // Atualiza descrição
            variants: variants, // Atualiza variações
            sold_in_catalog: soldInCatalog // Atualiza status de venda
        });
        
        // Processa imagens a serem deletadas
        if (imagesToDelete.length > 0) { // Se há imagens para deletar
            for (const imageUrl of imagesToDelete) { // Itera sobre cada URL
                productImages = productImages.filter(image => image !== imageUrl); // Remove URL do array
                const fileRef = ref(storage, imageUrl); // Cria referência ao arquivo
                await deleteObject(fileRef); // Deleta arquivo do Storage
            }
        }

        // Processa novas imagens a serem adicionadas
        if (imagesToCreate.length > 0) { // Se há novas imagens
            for (const image of imagesToCreate) { // Itera sobre cada imagem
                const storageRef = ref(storage, `${docSnap.owner}/products-images/${image.name}`); // Cria referência no Storage
                await uploadBytes(storageRef, image); // Faz upload da imagem
                const url = await getDownloadURL(storageRef); // Obtém URL da imagem
                productImages.push(url); // Adiciona URL ao array
            }
        }

        // Atualiza documento com novo array de imagens
        await updateDoc(docRef, {
            images: productImages
        });

        return {message: "product-updated"}; // Retorna mensagem de sucesso
    } else {
        return {message: "invalid-params"}; // Retorna erro de parâmetros inválidos
    }
}
