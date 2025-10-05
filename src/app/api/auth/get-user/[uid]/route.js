/**
 * API Route para busca de dados de usuário
 * 
 * Este arquivo gerencia a busca e retorno dos dados de um usuário específico
 * através do seu ID único (UID). É usado para obter informações do perfil
 * do usuário, como nome, email, status de assinatura e outras configurações
 * armazenadas no banco de dados.
 */

// Importa o middleware de verificação de token JWT para autenticação
import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";
// Importa a conexão com o banco de dados Firebase
import { db } from "../../../../utils/firebase";
// Importa as funções necessárias do Firestore para busca de dados
import { doc, getDoc } from "firebase/firestore";

/**
 * Função principal para busca de usuário
 * Método HTTP: GET
 * Autenticação: Requerida (JWT Token)
 * Parâmetros: uid (ID único do usuário na URL)
 */
export async function GET(req, {params}) {
    // Verifica se o token JWT é válido antes de prosseguir
    return await verifyJWTToken(req, async() => {
        // Extrai o ID do usuário dos parâmetros da URL
        const uid = params.uid;
        // Cria uma referência para o documento do usuário na coleção "accounts"
        const docRef = doc(db, "accounts", uid);
        // Busca os dados do usuário no banco de dados
        const docSnap = await getDoc(docRef);

        // Tenta processar a resposta
        try {
            // Verifica se o usuário existe no banco de dados
            if (docSnap.exists()) {
                // Retorna os dados do usuário em formato JSON
                return Response.json(docSnap.data());
            } else {
                // Retorna null se o usuário não foi encontrado
                return Response.json(null, {status: 404});
            }
        } catch (error) {
            // Retorna erro interno do servidor em caso de falha
            return Response.json({message: error.message}, {status: 500});
        }
    });
}