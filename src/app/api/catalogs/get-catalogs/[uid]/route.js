import verifyJWTToken from "@/app/api/middlewares/verifyJWTToken";
import { db } from "@/app/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(req, {params}) {
    return await verifyJWTToken(req, async() => {
        const uid = params.uid;
    
        const catalogsColRef = collection(db, "catalogs");
        const catalogsQuery = query(catalogsColRef, where("owner", "==", uid));
        const catalogsDocsSnap = await getDocs(catalogsQuery);
    
        const productsColRef = collection(db, "products")
        const productsQuery = query(productsColRef, where("owner", "==", uid));
        const productsDocsSnap = await getDocs(productsQuery);
    
        const catalogs = [];
    
        for (const doc of catalogsDocsSnap.docs) {
            const docData = doc.data();
            const productsArray = [];
            for (const productDoc of productsDocsSnap.docs) {
                if (productDoc.data().catalog === doc.id) {
                    productsArray.push({
                        id: productDoc.id,
                        ...productDoc.data()
                    });
                }
            }
            docData.id = doc.id;
            docData.products = productsArray;
            catalogs.push(docData);
        }
    
        if (catalogs.length > 0) { 
            return Response.json(catalogs, {status: 200});
        } else {
            return Response.json(null, {status: 200});
        };
    });
};