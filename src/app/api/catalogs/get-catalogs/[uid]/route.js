/**
 * API Route para busca de todos os catálogos de um usuário
 * 
 * Este arquivo gerencia a busca e retorno de todos os catálogos pertencentes
 * a um usuário específico, incluindo todos os produtos de cada catálogo.
 * É usado no painel administrativo para exibir a lista completa de catálogos
 * do usuário logado com suas respectivas informações e produtos.
 */

// Importa o middleware de verificação de token JWT para autenticação
import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";
// Importa a conexão com o banco de dados Firebase
import { db } from "../../../../utils/firebase";
// Importa as funções necessárias do Firestore para busca de dados
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Função principal para busca de catálogos do usuário
 * Método HTTP: GET
 * Autenticação: Requerida (JWT Token)
 * Parâmetros: uid (ID único do usuário na URL)
 */
export async function GET(req, {params}) {
    // Verifica se o token JWT é válido antes de prosseguir
    return await verifyJWTToken(req, async() => {
        // Extrai o ID do usuário dos parâmetros da URL
        const uid = params.uid;
    
        // Cria uma referência para a coleção de catálogos
        const catalogsColRef = collection(db, "catalogs");
        // Cria uma consulta para buscar catálogos do usuário específico
        const catalogsQuery = query(catalogsColRef, where("owner", "==", uid));
        // Executa a consulta e obtém os catálogos do usuário
        const catalogsDocsSnap = await getDocs(catalogsQuery);
    
        // Cria uma referência para a coleção de produtos
        const productsColRef = collection(db, "products")
        // Cria uma consulta para buscar produtos do usuário específico
        const productsQuery = query(productsColRef, where("owner", "==", uid));
        // Executa a consulta e obtém os produtos do usuário
        const productsDocsSnap = await getDocs(productsQuery);
    
        // Array para armazenar os catálogos com seus produtos
        const catalogs = [];
    
        // Itera sobre cada catálogo do usuário
        for (const doc of catalogsDocsSnap.docs) {
            // Obtém os dados do catálogo
            const docData = doc.data();
            // Array para armazenar os produtos deste catálogo
            const productsArray = [];
            
            // Itera sobre todos os produtos do usuário
            for (const productDoc of productsDocsSnap.docs) {
                // Verifica se o produto pertence a este catálogo
                if (productDoc.data().catalog === doc.id) {
                    // Adiciona o produto ao array do catálogo
                    productsArray.push({
                        id: productDoc.id,        // ID do produto
                        ...productDoc.data()     // Dados do produto
                    });
                }
            }
            // Adiciona o ID do catálogo aos seus dados
            docData.id = doc.id;
            // Adiciona a lista de produtos ao catálogo
            docData.products = productsArray;
            // Adiciona o catálogo completo ao array de catálogos
            catalogs.push(docData);
        }
    
        // Verifica se foram encontrados catálogos
        if (catalogs.length > 0) { 
            // Retorna a lista de catálogos com sucesso
            return Response.json(catalogs, {status: 200});
        } else {
            // Retorna null se nenhum catálogo foi encontrado
            return Response.json(null, {status: 200});
        };
    });
};