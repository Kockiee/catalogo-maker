import { db } from "@/app/utils/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import verifyJWTToken from "../../middlewares/verifyJWTToken";
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

export async function DELETE (req) {
    return await verifyJWTToken(req, async() => {
        const body = await req.json();
        const { uid } = body;

        if (uid && uid !== "") {
            const docRef = doc(db, "accounts", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const lastUserSubscription = docSnap.data().last_subscription_id;
                if (lastUserSubscription) await stripe.subscriptions.cancel(docSnap.data().last_subscription_id);
                await deleteDoc(docRef);
                return Response.json({ "success": true }, { status: 200 });
            } else {
                return Response.json({ "error": "User does not exists in accounts table." }, { status: 404 });
            }
        } else {
            return Response.json({ "error": "Invalid requisition parameters." }, { status: 400 });
        }
    }
}