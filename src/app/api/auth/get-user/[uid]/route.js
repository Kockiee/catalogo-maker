import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";
import { db } from "../../../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req, {params}) {
    return await verifyJWTToken(req, async() => {
        const uid = params.uid
        const docRef = doc(db, "accounts", uid)
        const docSnap = await getDoc(docRef)
    
        if (docSnap.exists()) {
            return Response.json(docSnap.data())
        } else {
            return Response.json(null, {status: 404})
        }
    });
}