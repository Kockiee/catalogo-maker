import { db } from "@/app/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(req, {params}) {
    const uid = params.uid;

    const ordersColRef = collection(db, "orders");
    const ordersQuery = query(ordersColRef, where("catalog_owner", "==", uid));
    const ordersDocsSnap = await getDocs(ordersQuery);

    const orders = [];

    for (const order of ordersDocsSnap.docs) {
        orders.push({
            id: order.id,
            ...order.data()
        });  
    }

    if (orders.length > 0) { 
        return Response.json(orders, {status: 200});
    } else {
        return Response.json(null, {status: 404});
    };
};