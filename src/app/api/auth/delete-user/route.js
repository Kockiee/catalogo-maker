import { db } from "../../../utils/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import verifyJWTToken from "../../middlewares/verifyJWTToken";
import { deleteStorageDirectory } from "@/app/actions/deleteStorageDirectory";
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

export async function DELETE(req) {
    return await verifyJWTToken(req, async() => {
        const body = await req.json();
        const { uid } = body;

        if (uid && uid !== "") {
            const accountDocRef = doc(db, "accounts", uid);
            const accountDocSnap = await getDoc(accountDocRef);

            await deleteStorageDirectory(uid)

            if (accountDocSnap.exists()) {
                const lastUserSubscription = accountDocSnap.data().last_subscription_id;
                if (lastUserSubscription) await stripe.subscriptions.cancel(accountDocSnap.data().last_subscription_id);
                await deleteDoc(accountDocRef);
                
                const catalogsQuery = query(collection(db, "catalogs"), where("owner", "==", uid));
                const catalogsQuerySnapshot = await getDocs(catalogsQuery);

                if (!catalogsQuerySnapshot.empty) {
                    for (const catalogDoc of catalogsQuerySnapshot.docs) {
                        const catalogData = catalogDoc.data();

                        await deleteWhatsappSession(catalogData.whatsapp_session);
                        await deleteDoc(doc(db, "catalogs", catalogData.id));
                    }
                    const productsQuery = query(collection(db, "products"), where("owner", "==", uid));
                    const productsQuerySnapshot = await getDocs(productsQuery);
                    if (!productsQuerySnapshot.empty) {
                        for (const productDoc of productsQuerySnapshot.docs) {
                            await deleteDoc(productDoc.ref);
                        }
                    }
                }                

                return Response.json({ "success": true }, { status: 200 });
            } else {
                return Response.json({ "error": "User does not exists in accounts table." }, { status: 404 });
            }
        } else {
            return Response.json({ "error": "Invalid requisition parameters." }, { status: 400 });
        }
    })
}