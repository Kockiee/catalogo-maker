// Importação do middleware para verificar o token JWT de autenticação
import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";
// Importação da configuração do banco de dados Firebase
import { db } from "../../../../utils/firebase";
// Importação das funções do Firestore para manipulação de documentos
import { doc, getDoc } from "firebase/firestore";

/**
 * Função handler para requisições GET na rota de obter usuário
 * Esta função é executada quando alguém faz uma requisição GET para /api/auth/get-user/[uid]
 * @param {Request} req - O objeto de requisição HTTP
 * @param {Object} params - Os parâmetros da URL, incluindo o UID do usuário
 * @returns {Promise<Response>} Resposta JSON com os dados do usuário ou erro
 */
export async function GET(req, {params}) {
    // Verifica se o usuário está autenticado usando o middleware JWT
    // Se autenticado, executa a função callback para obter os dados do usuário
    return await verifyJWTToken(req, async() => {
        // Extrai o UID (User ID) dos parâmetros da URL
        const uid = params.uid;
        // Cria uma referência para o documento do usuário na coleção "accounts"
        const docRef = doc(db, "accounts", uid);
        // Busca o documento do usuário no banco de dados
        const docSnap = await getDoc(docRef);

        try {
            // Verifica se o documento existe
            if (docSnap.exists()) {
                // Se existe, retorna os dados do usuário em formato JSON
                return Response.json(docSnap.data());
            } else {
                // Se não existe, retorna null com status 404 (não encontrado)
                return Response.json(null, {status: 404});
            }
        } catch (error) {
            // Em caso de erro, retorna a mensagem de erro com status 500 (erro interno)
            return Response.json({message: error.message}, {status: 500});
        }
    });
}