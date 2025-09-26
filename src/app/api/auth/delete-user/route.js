// Este arquivo define a rota de API responsável por excluir um usuário do sistema Catálogo Maker.
// Remove o usuário do banco de dados, apaga seus catálogos, produtos, arquivos e cancela a assinatura no Stripe.
// Utiliza autenticação JWT para garantir que apenas usuários autorizados possam realizar a exclusão.

import { db } from "../../../utils/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import verifyJWTToken from "../../middlewares/verifyJWTToken";
import { deleteStorageDirectory } from "@/app/actions/deleteStorageDirectory";
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

// Função que trata requisições HTTP DELETE para excluir um usuário
export async function DELETE(req) {
    // Verifica o token JWT para garantir que o usuário está autenticado
    return await verifyJWTToken(req, async() => {
        // Lê o corpo da requisição (JSON)
        const body = await req.json();
        // Extrai o UID do usuário a ser excluído
        const { uid } = body;

        // Verifica se o UID foi informado corretamente
        if (uid && uid !== "") {
            // Cria referência ao documento do usuário na coleção 'accounts'
            const accountDocRef = doc(db, "accounts", uid);
            // Busca os dados do usuário no banco de dados
            const accountDocSnap = await getDoc(accountDocRef);

            // Exclui todos os arquivos do usuário no armazenamento
            await deleteStorageDirectory(uid)

            // Se o usuário existe no banco de dados
            if (accountDocSnap.exists()) {
                // Cancela a assinatura do usuário no Stripe, se existir
                const lastUserSubscription = accountDocSnap.data().last_subscription_id;
                if (lastUserSubscription) await stripe.subscriptions.cancel(accountDocSnap.data().last_subscription_id);
                // Exclui o documento do usuário na coleção 'accounts'
                await deleteDoc(accountDocRef);
                
                // Busca todos os catálogos do usuário
                const catalogsQuery = query(collection(db, "catalogs"), where("owner", "==", uid));
                const catalogsQuerySnapshot = await getDocs(catalogsQuery);

                // Se o usuário possui catálogos
                if (!catalogsQuerySnapshot.empty) {
                    // Para cada catálogo, exclui sessão do WhatsApp e o próprio catálogo
                    for (const catalogDoc of catalogsQuerySnapshot.docs) {
                        const catalogData = catalogDoc.data();

                        // Exclui a sessão do WhatsApp vinculada ao catálogo
                        await deleteWhatsappSession(catalogData.whatsapp_session);
                        // Exclui o documento do catálogo
                        await deleteDoc(doc(db, "catalogs", catalogData.id));
                    }
                    // Busca todos os produtos do usuário
                    const productsQuery = query(collection(db, "products"), where("owner", "==", uid));
                    const productsQuerySnapshot = await getDocs(productsQuery);
                    // Exclui cada produto encontrado
                    if (!productsQuerySnapshot.empty) {
                        for (const productDoc of productsQuerySnapshot.docs) {
                            await deleteDoc(productDoc.ref);
                        }
                    }
                }                

                // Retorna resposta de sucesso
                return Response.json({ "success": true }, { status: 200 });
            } else {
                // Se o usuário não existe, retorna erro
                return Response.json({ "error": "User does not exists in accounts table." }, { status: 404 });
            }
        } else {
            // Se o UID não foi informado corretamente, retorna erro
            return Response.json({ "error": "Invalid requisition parameters." }, { status: 400 });
        }
    })
}