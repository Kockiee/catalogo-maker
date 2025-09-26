// Este arquivo define a função que atualiza os dados de um produto existente.
// Permite alterar informações como nome, preço, descrição, imagens e variações do produto.

'use server'

// Importa funções para manipular arquivos no Firebase Storage
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
// Importa banco de dados e armazenamento do Firebase
import { db, storage } from "../utils/firebase";
// Importa funções para manipular documentos no Firestore
import { collection, doc, getDocs, query, updateDoc, where, getDoc } from "firebase/firestore";

/**
 * Atualiza os dados de um produto
 * @param {Object} prevState - Estado anterior do formulário
 * @param {FormData} formData - Dados do formulário
 * @param {string} catalogId - ID do catálogo ao qual o produto pertence
 * @param {string} productId - ID do produto a ser atualizado
 * @param {Array} variants - Variações do produto
 */
export async function updateProduct(prevState, formData, catalogId, productId, variants) {
    // Extrai os dados do formulário
    const imagesToCreate = formData.getAll('imagesToCreate'); // Novas imagens para adicionar
    const imagesToDelete = formData.getAll('imagesToDelete'); // Imagens para remover
    const name = formData.get('name'); // Nome do produto
    const price = parseFloat(formData.get('price')); // Preço do produto
    const description = formData.get('description'); // Descrição do produto
    const soldInCatalog = formData.get('soldInCatalog') || false; // Flag se o produto é vendido no catálogo

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (name && description && price && imagesToDelete && imagesToCreate) {
        // Consulta se já existe outro produto com o mesmo nome no catálogo (evita duplicidade)
        const colRef = collection(db, "products");
        const q = query(colRef, where("name", "==", name), where("id", "!=", productId), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q);

        // Se já existe outro produto com o mesmo nome, retorna erro
        if (!querySnapshot.empty) {
            return {message: "product-already-exists"};
        }

        // Busca os dados atuais do produto
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        var productImages = docSnap.data().images; // Imagens atuais do produto

        // Atualiza os campos principais do produto
        await updateDoc(docRef, {
            name: name,
            price: price,
            description: description,
            variants: variants,
            sold_in_catalog: soldInCatalog
        });

        // Remove imagens do produto se necessário
        if (imagesToDelete.length > 0) {
            for (const imageUrl of imagesToDelete) {
                productImages = productImages.filter(image => image !== imageUrl);
                const fileRef = ref(storage, imageUrl);
                await deleteObject(fileRef);
            }
        }

        if (imagesToCreate.length > 0) {
            for (const image of imagesToCreate) {
                const storageRef = ref(storage, `${docSnap.owner}/products-images/${image.name}`);
                await uploadBytes(storageRef, image);
                const url = await getDownloadURL(storageRef);
                productImages.push(url);
            }
        }

        await updateDoc(docRef, {
            images: productImages
        });

        return {message: "product-updated"};
    } else {
        return {message: "invalid-params"};
    }
}