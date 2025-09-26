// Diretiva 'use server' indica que esta função é executada no servidor
'use server'

// Importação das funções de armazenamento do Firebase Storage
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// Importação da configuração do banco de dados e armazenamento do Firebase
import { db, storage } from "../utils/firebase";
// Importação das funções do Firestore para manipulação de documentos
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

/**
 * Função assíncrona para criar um novo produto no banco de dados
 * Esta função processa os dados do formulário e faz upload das imagens para criar um produto
 * @param {Object} prevState - Estado anterior (usado em formulários com Server Actions)
 * @param {FormData} formData - Dados do formulário contendo as informações do produto
 * @param {string} catalogId - ID do catálogo ao qual o produto pertence
 * @param {string} uid - ID do usuário que está criando o produto
 * @param {Array} variants - Array com as variações do produto (cores, tamanhos, etc.)
 * @returns {Promise<Object>} Objeto com mensagem de sucesso ou erro
 */
export async function createProduct(prevState, formData, catalogId, uid, variants) {
    // Extrai os dados do formulário
    const images = formData.getAll('images');        // Array com todas as imagens do produto
    const name = formData.get('name');               // Nome do produto
    const price = parseFloat(formData.get('price')); // Preço do produto (convertido para float)
    const description = formData.get('description'); // Descrição do produto
    const soldInCatalog = formData.get('soldInCatalog'); // Flag se o produto é vendido no catálogo

    // Log de debug para acompanhar a execução da função
    console.log("createProduct called with name:", name, "description:", description, "price:", price, "uid:", uid, "images:", images, "variants:", variants);

    // Validação dos parâmetros obrigatórios
    if (name && description && price && uid && images) {
        // Cria uma referência para a coleção "products" no Firestore
        const colRef = collection(db, "products");
        // Cria uma consulta para verificar se já existe um produto com mesmo nome no catálogo
        const q = query(colRef, where("name", "==", name), where("catalog", "==", catalogId));
        // Executa a consulta para buscar produtos existentes
        const querySnapshot = await getDocs(q);

        // Verifica se já existe um produto com esse nome no catálogo
        if (!querySnapshot.empty) {
            // Se existe, retorna mensagem indicando que o produto já existe
            return {message: "product-already-exists"};
        }

        // Cria um novo documento na coleção "products" com os dados fornecidos
        const newProduct = await addDoc(colRef, {
            owner: uid,              // ID do proprietário do produto
            name: name,              // Nome do produto
            catalog: catalogId,      // ID do catálogo ao qual pertence
            description: description, // Descrição do produto
            price: price,            // Preço do produto
            variations: variants,    // Variações do produto (cores, tamanhos, etc.)
            sold_in_catalog: soldInCatalog, // Flag se é vendido no catálogo
            created_at: new Date()   // Data de criação
        });

        // Verifica se o produto foi criado com sucesso
        if (newProduct) {
            // Inicializa array para armazenar as URLs das imagens
            const productImages = [];
            // Itera sobre cada imagem enviada
            for (const image of images) {
                // Cria uma referência de armazenamento para cada imagem
                const storageRef = ref(storage, `${uid}/${catalogId}/products/${newProduct.id}/${image.name}`);
                // Faz upload da imagem para o Firebase Storage
                await uploadBytes(storageRef, image);
                // Obtém a URL de download da imagem após o upload
                const url = await getDownloadURL(storageRef);
                // Adiciona a URL ao array de imagens do produto
                productImages.push(url);
            }

            // Cria uma referência para o documento do produto recém-criado
            const docRef = doc(db, "products", newProduct.id);
            // Atualiza o documento com as URLs das imagens
            await updateDoc(docRef, {
                images: productImages // Array com URLs das imagens
            });
        }

        // Retorna mensagem de sucesso
        return {message: "product-created"};
    } else {
        // Se algum parâmetro obrigatório estiver faltando, retorna erro
        return {message: "invalid-params"};
    }
}