import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

export async function POST(req) {
    const body = await req.json();
    const { uid, username, email } = body;

    if (uid && username && email && uid !== "" && username !== "" && email !== "") {  
        const docRef = doc(db, "accounts", uid)
        const docSnap = await getDoc(docRef)
        
        if (!docSnap.exists()) {
            await setDoc(doc(db, "accounts", uid), {
                uid: uid,
                email: email,
                username: username,
                premium: false
            })
            const createdUser = (await getDoc(docRef)).data()
            return Response.json({ "success": true, "createdUser": createdUser }, { status: 201 });
        } else {
            return Response.json({ "success": true, "createdUser": docSnap.data() }, { status: 200 });
        }
    } else {
        return Response.json({ "error": "Invalid requisition parameters." }, { status: 400 });
    }
};