'use server'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export async function createAccount(uid, username, email) {
    const docRef = doc(db, "accounts", uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
        await setDoc(doc(db, "accounts", uid), {
            uid: uid,
            email: email,
            username: username,
            premium: false
        });
        const createdUser = (await getDoc(docRef)).data();
        return { "success": true, "createdUser": createdUser }
    } else {
        return { "success": true, "createdUser": docSnap.data() }
    }
};