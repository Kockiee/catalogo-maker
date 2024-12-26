import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";
import { db } from "../../../../utils/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export async function GET(req, {params}) {
    const catalogId = params.catalogId;
    
    const docRef = doc(db, "catalogs", catalogId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const q = query(collection(db, "products"), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q);
    
        const catalogProducts = [];
    
        for (const doc of querySnapshot.docs) {
            catalogProducts.push({
                ...doc.data(),
                id: doc.id,
            });
        }
    
        return Response.json({
            id: docSnap.id,
            ...docSnap.data(),
            products: catalogProducts
        }, {status: 200})
    } else {
        return Response.json({message: 'Catalog not found'}, {status: 404})
    }
};