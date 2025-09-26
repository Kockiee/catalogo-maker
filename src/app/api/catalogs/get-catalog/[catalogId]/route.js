// Importação do middleware para verificar o token JWT de autenticação
import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";
// Importação da configuração do banco de dados Firebase
import { db } from "../../../../utils/firebase";
// Importação das funções do Firestore para manipulação de documentos e consultas
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

/**
 * Função handler para requisições GET na rota de obter catálogo específico
 * Esta função é executada quando alguém faz uma requisição GET para /api/catalogs/get-catalog/[catalogId]
 * @param {Request} req - O objeto de requisição HTTP
 * @param {Object} params - Os parâmetros da URL, incluindo o ID do catálogo
 * @returns {Promise<Response>} Resposta JSON com os dados do catálogo e seus produtos ou erro
 */
export async function GET(req, {params}) {
    // Extrai o ID do catálogo dos parâmetros da URL
    const catalogId = params.catalogId;

    // Cria uma referência para o documento do catálogo na coleção "catalogs"
    const docRef = doc(db, "catalogs", catalogId);
    // Busca o documento do catálogo no banco de dados
    const docSnap = await getDoc(docRef);

    // Verifica se o documento do catálogo existe
    if (docSnap.exists()) {
        // Cria uma consulta para buscar todos os produtos que pertencem a este catálogo
        const q = query(collection(db, "products"), where("catalog", "==", catalogId));
        // Executa a consulta para obter os produtos
        const querySnapshot = await getDocs(q);

        // Inicializa um array para armazenar os produtos do catálogo
        const catalogProducts = [];

        // Itera sobre todos os documentos de produtos retornados pela consulta
        for (const doc of querySnapshot.docs) {
            // Adiciona cada produto ao array com seus dados e ID
            catalogProducts.push({
                ...doc.data(), // Espalha todos os campos do documento
                id: doc.id,    // Adiciona o ID do documento como campo "id"
            });
        }

        // Retorna uma resposta JSON com os dados do catálogo e seus produtos
        return Response.json({
            id: docSnap.id,        // ID do catálogo
            ...docSnap.data(),     // Todos os campos do catálogo
            products: catalogProducts // Array com os produtos do catálogo
        }, {status: 200}) // Status 200 indica sucesso
    } else {
        // Se o catálogo não foi encontrado, retorna erro 404
        return Response.json({message: 'Catalog not found'}, {status: 404})
    }
};