// Diretiva 'use server' indica que esta função é executada no servidor
'use server'

// Importação das funções de armazenamento do Firebase Storage
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// Importação da configuração do banco de dados e armazenamento do Firebase
import { db, storage } from "../utils/firebase";
// Importação das funções do Firestore para manipulação de documentos
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

/**
 * Função assíncrona para criar um novo catálogo no banco de dados
 * Esta função é executada no servidor e processa os dados do formulário para criar um catálogo
 * @param {Object} prevState - Estado anterior (usado em formulários com Server Actions)
 * @param {FormData} formData - Dados do formulário contendo as informações do catálogo
 * @param {string} userId - ID do usuário que está criando o catálogo
 * @returns {Promise<Object>} Objeto com o ID do catálogo criado ou mensagem de erro
 */
export async function createCatalog(prevState, formData, userId) {
    // Extrai o ID do usuário para usar como proprietário do catálogo
    const uid = userId;
    // Extrai os dados do formulário usando o método get()
    const name = formData.get('identificationName');          // Nome de identificação do catálogo
    const store_name = formData.get('storeName');             // Nome da loja
    const store_description = formData.get('storeDescription'); // Descrição da loja
    const primary_color = formData.get('primaryColor');       // Cor primária do catálogo
    const secondary_color = formData.get('secondaryColor');   // Cor secundária do catálogo
    const tertiary_color = formData.get('tertiaryColor');     // Cor terciária do catálogo
    const text_color = formData.get('textColor');             // Cor do texto do catálogo

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (uid && name && store_name && store_description && primary_color && secondary_color && tertiary_color && text_color) {
        // Cria uma referência para a coleção "catalogs" no Firestore
        const colRef = collection(db, "catalogs");
        // Cria uma consulta para verificar se já existe um catálogo com mesmo nome, loja e proprietário
        const q = query(colRef, where("name", "==", name), where("store_name", "==", store_name), where("owner", "==", uid));
        // Executa a consulta para buscar catálogos existentes
        const querySnapshot = await getDocs(q);

        // Verifica se já existe um catálogo com essas características
        if (!querySnapshot.empty) {
            // Se existe, retorna mensagem indicando que o catálogo já existe
            return {message: "catalog-already-exists"};
        }

        // Cria um novo documento na coleção "catalogs" com os dados fornecidos
        const newCatalog = await addDoc(colRef, {
            owner: uid,                    // ID do proprietário do catálogo
            name: name,                    // Nome de identificação do catálogo
            store_name: store_name,        // Nome da loja
            store_description: store_description, // Descrição da loja
            primary_color: primary_color,  // Cor primária
            secondary_color: secondary_color, // Cor secundária
            tertiary_color: tertiary_color, // Cor terciária
            text_color: text_color,        // Cor do texto
            created_at: new Date()         // Data de criação
        });

        // Verifica se o catálogo foi criado com sucesso
        // Se o catálogo foi criado com sucesso, pode adicionar mais lógica aqui (ex: imagens)
        if (newCatalog) {
            // Obtém a imagem do banner do formulário
            const bannerImage = formData.get('bannerImage');
            // Cria uma referência de armazenamento para a imagem do banner
            const storageRef = ref(storage, `${uid}/${newCatalog.id}/catalog-banner`);
            // Faz upload da imagem para o Firebase Storage
            await uploadBytes(storageRef, bannerImage);
            // Obtém a URL de download da imagem após o upload
            await getDownloadURL(storageRef).then(async(url) => {
                // Cria uma referência para o documento do catálogo recém-criado
                const docRef = doc(db, "catalogs", newCatalog.id);
                // Atualiza o documento com a URL da imagem do banner
                await updateDoc(docRef, {
                  banner_url: url // URL da imagem do banner
                });
            });
        }

        // Retorna sucesso com o ID do catálogo criado
        return { catalogId: newCatalog.id, message: "catalog-created"};
    } else {
        // Se algum parâmetro obrigatório estiver faltando, retorna erro
        return {message: "invalid-params"};
    }
}