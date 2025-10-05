/**
 * AÇÃO DE CRIAR PRODUTO
 * 
 * Este arquivo contém a ação server-side para criar um novo produto no
 * banco de dados Firestore. A função valida os dados, verifica duplicatas,
 * cria o documento e faz upload das imagens para o Storage.
 * 
 * Funcionalidades:
 * - Criar novo produto no Firestore
 * - Validar dados obrigatórios
 * - Verificar produtos duplicados
 * - Upload de múltiplas imagens
 * - Armazenar variações do produto
 * - Retornar status da operação
 */

'use server' // Diretiva para indicar que esta função roda no servidor

import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Importa funções do Storage
import { db, storage } from "../utils/firebase"; // Importa instâncias do banco e storage
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"; // Importa funções do Firestore

export async function createProduct(prevState, formData, catalogId, uid, variants) {
    const images = formData.getAll('images'); // Obtém todas as imagens do formulário
    const name = formData.get('name'); // Nome do produto
    const price = parseFloat(formData.get('price')); // Preço do produto (convertido para número)
    const description = formData.get('description'); // Descrição do produto
    const soldInCatalog = formData.get('soldInCatalog'); // Se o produto é vendido no catálogo

    console.log("createProduct called with name:", name, "description:", description, "price:", price, "uid:", uid, "images:", images, "variants:", variants);

    // Valida se todos os campos obrigatórios estão presentes
    if (name && description && price && uid && images) {
        const colRef = collection(db, "products"); // Cria referência à coleção de produtos
        // Query para verificar se já existe produto com mesmo nome no catálogo
        const q = query(colRef, where("name", "==", name), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q); // Executa query

        if (!querySnapshot.empty) { // Se encontrou produto duplicado
            return {message: "product-already-exists"}; // Retorna erro
        }
        
        // Cria novo documento de produto
        const newProduct = await addDoc(colRef, {
            owner: uid, // Proprietário do produto
            name: name, // Nome do produto
            catalog: catalogId, // ID do catálogo ao qual pertence
            description: description, // Descrição do produto
            price: price, // Preço do produto
            variations: variants, // Variações do produto (ex: tamanho, cor)
            sold_in_catalog: soldInCatalog, // Se é vendido no catálogo
            created_at: new Date() // Data de criação
        });

        if (newProduct) { // Se produto foi criado com sucesso
            const productImages = []; // Array para armazenar URLs das imagens
            for (const image of images) { // Itera sobre cada imagem
                const storageRef = ref(storage, `${uid}/${catalogId}/products/${newProduct.id}/${image.name}`); // Cria referência no Storage
                await uploadBytes(storageRef, image); // Faz upload da imagem
                const url = await getDownloadURL(storageRef); // Obtém URL da imagem
                productImages.push(url); // Adiciona URL ao array
            }

            const docRef = doc(db, "products", newProduct.id); // Cria referência ao documento
            await updateDoc(docRef, { // Atualiza documento com URLs das imagens
                images: productImages
            });
        }

        return {message: "product-created"}; // Retorna mensagem de sucesso
    } else {
        return {message: "invalid-params"}; // Retorna erro de parâmetros inválidos
    }
}
