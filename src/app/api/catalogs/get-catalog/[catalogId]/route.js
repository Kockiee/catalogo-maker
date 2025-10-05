/**
 * API Route para busca de catálogo específico
 * 
 * Este arquivo gerencia a busca e retorno de um catálogo específico junto
 * com todos os seus produtos associados. É usado tanto para visualização
 * pública do catálogo quanto para edição no painel administrativo.
 * Retorna informações completas do catálogo e lista de produtos.
 */

// Importa o middleware de verificação de token JWT para autenticação
import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";
// Importa a conexão com o banco de dados Firebase
import { db } from "../../../../utils/firebase";
// Importa as funções necessárias do Firestore para busca de dados
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

/**
 * Função principal para busca de catálogo
 * Método HTTP: GET
 * Autenticação: Não requerida (acesso público)
 * Parâmetros: catalogId (ID único do catálogo na URL)
 */
export async function GET(req, {params}) {
    // Extrai o ID do catálogo dos parâmetros da URL
    const catalogId = params.catalogId;
    
    // Cria uma referência para o documento do catálogo na coleção "catalogs"
    const docRef = doc(db, "catalogs", catalogId);
    // Busca os dados do catálogo no banco de dados
    const docSnap = await getDoc(docRef);

    // Verifica se o catálogo existe no banco de dados
    if (docSnap.exists()) {
        // Cria uma consulta para buscar todos os produtos deste catálogo
        const q = query(collection(db, "products"), where("catalog", "==", catalogId));
        // Executa a consulta e obtém os resultados
        const querySnapshot = await getDocs(q);
    
        // Array para armazenar os produtos do catálogo
        const catalogProducts = [];
    
        // Itera sobre cada produto encontrado
        for (const doc of querySnapshot.docs) {
            // Adiciona o produto ao array com seus dados e ID
            catalogProducts.push({
                ...doc.data(), // Espalha todos os dados do produto
                id: doc.id,    // Adiciona o ID do documento
            });
        }
    
        // Retorna o catálogo completo com seus produtos
        return Response.json({
            id: docSnap.id,           // ID do catálogo
            ...docSnap.data(),       // Todos os dados do catálogo
            products: catalogProducts // Lista de produtos
        }, {status: 200})
    } else {
        // Retorna erro se o catálogo não foi encontrado
        return Response.json({message: 'Catalog not found'}, {status: 404})
    }
};