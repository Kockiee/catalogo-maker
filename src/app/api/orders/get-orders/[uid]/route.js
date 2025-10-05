/**
 * API Route para busca de pedidos de um usuário
 * 
 * Este arquivo gerencia a busca e retorno de todos os pedidos recebidos
 * por um usuário específico. É usado no painel administrativo para exibir
 * a lista de pedidos que foram feitos nos catálogos do usuário, permitindo
 * o acompanhamento e gerenciamento das vendas.
 */

// Importa o middleware de verificação de token JWT para autenticação
import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";
// Importa a conexão com o banco de dados Firebase
import { db } from "../../../../utils/firebase";
// Importa as funções necessárias do Firestore para busca de dados
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Função principal para busca de pedidos do usuário
 * Método HTTP: GET
 * Autenticação: Requerida (JWT Token)
 * Parâmetros: uid (ID único do usuário na URL)
 */
export async function GET(req, {params}) {
    // Verifica se o token JWT é válido antes de prosseguir
    return await verifyJWTToken(req, async() => {
        // Extrai o ID do usuário dos parâmetros da URL
        const uid = params.uid;
    
        // Cria uma referência para a coleção de pedidos
        const ordersColRef = collection(db, "orders");
        // Cria uma consulta para buscar pedidos onde o usuário é o dono do catálogo
        const ordersQuery = query(ordersColRef, where("catalog_owner", "==", uid));
        // Executa a consulta e obtém os pedidos do usuário
        const ordersDocsSnap = await getDocs(ordersQuery);
    
        // Array para armazenar os pedidos formatados
        const orders = [];
    
        // Itera sobre cada pedido encontrado
        for (const order of ordersDocsSnap.docs) {
            // Adiciona o pedido ao array com ID e dados
            orders.push({
                id: order.id,           // ID do pedido
                ...order.data()         // Dados do pedido
            });  
        }
    
        // Verifica se foram encontrados pedidos
        if (orders.length > 0) { 
            // Retorna a lista de pedidos com sucesso
            return Response.json(orders, {status: 200});
        } else {
            // Retorna null se nenhum pedido foi encontrado
            return Response.json(null, {status: 200});
        };
    });
};