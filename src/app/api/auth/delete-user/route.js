/**
 * API Route para exclusão completa de usuário
 * 
 * Este arquivo gerencia a exclusão completa de uma conta de usuário do sistema,
 * incluindo todos os dados associados como catálogos, produtos, assinaturas do Stripe,
 * sessões do WhatsApp e arquivos de armazenamento. É uma operação irreversível
 * que remove completamente a presença do usuário na plataforma.
 */

// Importa a conexão com o banco de dados Firebase
import { db } from "../../../utils/firebase";
// Importa as funções necessárias do Firestore para manipulação de dados
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
// Importa o middleware de verificação de token JWT para autenticação
import verifyJWTToken from "../../middlewares/verifyJWTToken";
// Importa a função para deletar diretórios de armazenamento
import { deleteStorageDirectory } from "@/app/actions/deleteStorageDirectory";
// Configura o cliente do Stripe para gerenciar assinaturas
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

/**
 * Função principal para exclusão de usuário
 * Método HTTP: DELETE
 * Autenticação: Requerida (JWT Token)
 */
export async function DELETE(req) {
    // Verifica se o token JWT é válido antes de prosseguir
    return await verifyJWTToken(req, async() => {
        // Extrai os dados do corpo da requisição
        const body = await req.json();
        // Obtém o ID único do usuário a ser deletado
        const { uid } = body;

        // Verifica se o ID do usuário foi fornecido e não está vazio
        if (uid && uid !== "") {
            // Cria uma referência para o documento do usuário na coleção "accounts"
            const accountDocRef = doc(db, "accounts", uid);
            // Busca os dados do usuário no banco de dados
            const accountDocSnap = await getDoc(accountDocRef);

            // Deleta todos os arquivos de armazenamento associados ao usuário
            await deleteStorageDirectory(uid)

            // Verifica se o usuário existe no banco de dados
            if (accountDocSnap.exists()) {
                // Obtém o ID da última assinatura ativa do usuário
                const lastUserSubscription = accountDocSnap.data().last_subscription_id;
                // Se existe uma assinatura ativa, cancela ela no Stripe
                if (lastUserSubscription) await stripe.subscriptions.cancel(accountDocSnap.data().last_subscription_id);
                // Deleta o documento do usuário da coleção "accounts"
                await deleteDoc(accountDocRef);
                
                // Busca todos os catálogos pertencentes ao usuário
                const catalogsQuery = query(collection(db, "catalogs"), where("owner", "==", uid));
                const catalogsQuerySnapshot = await getDocs(catalogsQuery);

                // Se o usuário possui catálogos, processa cada um deles
                if (!catalogsQuerySnapshot.empty) {
                    // Itera sobre cada catálogo do usuário
                    for (const catalogDoc of catalogsQuerySnapshot.docs) {
                        // Obtém os dados do catálogo
                        const catalogData = catalogDoc.data();

                        // Deleta a sessão do WhatsApp associada ao catálogo
                        await deleteWhatsappSession(catalogData.whatsapp_session);
                        // Deleta o documento do catálogo
                        await deleteDoc(doc(db, "catalogs", catalogData.id));
                    }
                    // Busca todos os produtos pertencentes ao usuário
                    const productsQuery = query(collection(db, "products"), where("owner", "==", uid));
                    const productsQuerySnapshot = await getDocs(productsQuery);
                    // Se o usuário possui produtos, deleta cada um deles
                    if (!productsQuerySnapshot.empty) {
                        // Itera sobre cada produto do usuário
                        for (const productDoc of productsQuerySnapshot.docs) {
                            // Deleta o documento do produto
                            await deleteDoc(productDoc.ref);
                        }
                    }
                }                

                // Retorna sucesso se a exclusão foi concluída
                return Response.json({ "success": true }, { status: 200 });
            } else {
                // Retorna erro se o usuário não existe no banco de dados
                return Response.json({ "error": "User does not exists in accounts table." }, { status: 404 });
            }
        } else {
            // Retorna erro se os parâmetros da requisição são inválidos
            return Response.json({ "error": "Invalid requisition parameters." }, { status: 400 });
        }
    })
}