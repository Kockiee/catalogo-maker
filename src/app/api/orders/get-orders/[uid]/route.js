// Importa o middleware que valida o token JWT para garantir que apenas usuários autenticados acessem a rota
import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";

// Importa a instância do banco de dados Firebase configurada no projeto
import { db } from "../../../../utils/firebase";

// Importa funções do Firestore para manipular coleções e realizar consultas
import { collection, getDocs, query, where } from "firebase/firestore";

// Função que trata requisições GET para esta rota
export async function GET(req, {params}) {
    // Executa o middleware verifyJWTToken para validar o token da requisição.
    // Caso o token seja válido, a função callback assíncrona será executada.
    return await verifyJWTToken(req, async() => {
        // Extrai o parâmetro "uid" da rota (o identificador do dono do catálogo)
        const uid = params.uid;
    
        // Cria uma referência à coleção "orders" no Firestore
        const ordersColRef = collection(db, "orders");

        // Cria uma query para buscar documentos na coleção "orders"
        // onde o campo "catalog_owner" seja igual ao uid recebido na rota
        const ordersQuery = query(ordersColRef, where("catalog_owner", "==", uid));

        // Executa a query e retorna um snapshot contendo os documentos encontrados
        const ordersDocsSnap = await getDocs(ordersQuery);
    
        // Cria um array para armazenar os pedidos formatados
        const orders = [];
    
        // Itera sobre todos os documentos retornados pela query
        for (const order of ordersDocsSnap.docs) {
            // Adiciona ao array um objeto contendo o ID do documento
            // e todos os campos armazenados no Firestore
            orders.push({
                id: order.id,
                ...order.data()
            });  
        }
    
        // Se houver pedidos encontrados, retorna-os como JSON com status 200
        if (orders.length > 0) { 
            return Response.json(orders, {status: 200});
        } else {
            // Caso contrário, retorna null também com status 200
            return Response.json(null, {status: 200});
        };
    });
};