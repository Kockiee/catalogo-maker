'use server'

import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./utils/firebase";
import { deleteDoc, addDoc, collection, doc, getDocs, query, updateDoc, where, getDoc } from "firebase/firestore";

export async function createCatalog(prevState, formData, userId) {
    const uid = userId;
    const name = formData.get('identificationName');
    const store_name = formData.get('storeName');
    const store_description = formData.get('storeDescription');
    const primary_color = formData.get('primaryColor');
    const secondary_color = formData.get('secondaryColor');
    const tertiary_color = formData.get('tertiaryColor');
    const text_color = formData.get('textColor');

    if (uid && name && store_name && store_description && primary_color && secondary_color && tertiary_color && text_color) {
        const colRef = collection(db, "catalogs");
        const q = query(colRef, where("name", "==", name), where("store_name", "==", store_name), where("owner", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return {message: "catalog-already-exists"};
        }
        
        const newCatalog = await addDoc(colRef, {
            owner: uid,
            name: name,
            store_name: store_name,
            store_description: store_description,
            primary_color: primary_color,
            secondary_color: secondary_color,
            tertiary_color: tertiary_color,
            text_color: text_color,
            created_at: new Date()
        });

        if (newCatalog) {
            const bannerImage = formData.get('bannerImage')
            if (bannerImage) {
                const storageRef = ref(storage, `${uid}/catalog-banner`);
                await uploadBytes(storageRef, bannerImage);
                await getDownloadURL(storageRef).then(async(url) => {
                    const docRef = doc(db, "catalogs", newCatalog.id);
                    await updateDoc(docRef, {
                      banner_url: url
                    });
                });
            }
        }

        return {message: "catalog-created"};
    } else {
        return {message: "invalid-params"};
    }
}

export async function deleteCatalogs(catalogs) {
    for (const catalog of catalogs) {
        const q = query(collection(db, "products"), where("catalog", "==", catalog.id));
        const querySnapshot = await getDocs(q);
        for (const doc of querySnapshot.docs) {
            await deleteDoc(doc.ref);
        }
        await deleteDoc(doc(db, "catalogs", catalog.id));
    }
}

export async function updateCatalog(prevState, formData, catalogId) {
    const name = formData.get('identificationName');
    const store_name = formData.get('storeName');
    const store_description = formData.get('storeDescription');
    const primary_color = formData.get('primaryColor');
    const secondary_color = formData.get('secondaryColor');
    const tertiary_color = formData.get('tertiaryColor');
    const text_color = formData.get('textColor');

    if (name && store_name && store_description && primary_color && secondary_color && tertiary_color && text_color) {
        
        const q = query(collection(db, "catalogs"), where('name', '==', name), where('id', '!=', catalogId))
        
        const isCatalogNameNotExists = (await getDocs(q)).empty

        if (isCatalogNameNotExists) {
            const docRef = doc(db, "catalogs", catalogId);
            const catalog = (await getDoc(docRef)).data();
            await updateDoc(docRef, {
                name: name,
                store_name: store_name,
                store_description: store_description,
                primary_color: primary_color,
                secondary_color: secondary_color,
                tertiary_color: tertiary_color,
                text_color: text_color,
            });
    
            const bannerImage = formData.get('bannerImage')
            if (bannerImage) {
                const storageRef = ref(storage, `${catalog.owner}/catalog-banner`);
                await uploadBytes(storageRef, bannerImage);
                await getDownloadURL(storageRef).then(async(url) => {      
                    await updateDoc(docRef, {
                      banner_url: url
                    });
                });
            }
            return {message: "catalog-updated"};
        } else {
            return {message: "catalog-name-already-exists"};
        }
    } else {
        return {message: "invalid-params"};
    }
}

export async function createProduct(prevState, formData, catalogId, uid, variants) {
    const images = formData.getAll('images');
    const name = formData.get('name');
    const price = parseFloat(formData.get('price'));
    const description = formData.get('description');
    const soldInCatalog = formData.get('soldInCatalog');

    if (name && description && price && uid && images) {
        const colRef = collection(db, "products");
        const q = query(colRef, where("name", "==", name), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return {message: "product-already-exists"};
        }
        
        const newProduct = await addDoc(colRef, {
            owner: uid,
            name: name,
            catalog: catalogId,
            description: description,
            price: price,
            variations: variants,
            sold_in_catalog: soldInCatalog,
            created_at: new Date()
        });

        if (newProduct) {
            const productImages = [];
            for (const image of images) {
                const storageRef = ref(storage, `${uid}/products-images/${image.name}`);
                await uploadBytes(storageRef, image);
                const url = await getDownloadURL(storageRef);
                productImages.push(url);
            }

            const docRef = doc(db, "products", newProduct.id);
            await updateDoc(docRef, {
                images: productImages
            });
        }

        return {message: "product-created"};
    } else {
        return {message: "invalid-params"};
    }
}

export async function updateProduct(prevState, formData, catalogId, productId, variants) {
    const imagesToCreate = formData.getAll('imagesToCreate');
    const imagesToDelete = formData.getAll('imagesToDelete');
    const name = formData.get('name');
    const price = parseFloat(formData.get('price'));
    const description = formData.get('description');
    const soldInCatalog = formData.get('soldInCatalog') || false;

    if (name && description && price && imagesToDelete && imagesToCreate) {
        const colRef = collection(db, "products");
        const q = query(colRef, where("name", "==", name), where("id", "!=", productId), where("catalog", "==", catalogId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return {message: "product-already-exists"};
        }

        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        let productImages = docSnap.data().images

        await updateDoc(docRef, {
            name: name,
            price: price,
            description: description,
            variants: variants,
            sold_in_catalog: soldInCatalog
        });
        
        if (imagesToDelete.length > 0) {
            for (const imageUrl of imagesToDelete) {
                productImages = productImages.filter(image => image !== imageUrl);
                const fileRef = ref(storage, imageUrl);
                await deleteObject(fileRef);
            }
        }

        if (imagesToCreate.length > 0) {
            for (const image of imagesToCreate) {
                const storageRef = ref(storage, `${docSnap.owner}/products-images/${image.name}`);
                await uploadBytes(storageRef, image);
                const url = await getDownloadURL(storageRef);
                productImages.push(url);
            }
        }

        await updateDoc(docRef, {
            images: productImages
        });

        return {message: "product-updated"};
    } else {
        return {message: "invalid-params"};
    }
}

export async function deleteProducts(products) {
    for (const productId of products) {
        const docRef = doc(db, "products", productId);
        await deleteDoc(docRef);
    }
}

export async function createWhatsappSession(sessionId) {
    const session = async() => {return await fetch(`https://flashy-powder-production.up.railway.app/session/qr/${sessionId}`, {
        headers: {'Content-Type': 'application/json', 'x-api-key': process.env.WHATSAPP_API_KEY}
    }).then(response => response.json())};

    const sessionExistent = await session();

    if (sessionExistent.message === "session_not_found") {
        await fetch(`https://flashy-powder-production.up.railway.app/session/start/${sessionId}`, {
            headers: {'Content-Type': 'application/json', 'x-api-key': process.env.WHATSAPP_API_KEY}
        });

        return await session();
    } else {
        return sessionExistent;
    }
}

export async function setCatalogWhatsapp(sessionId, catalogId) {
    const docRef = doc(db, "catalogs", catalogId);
        
    await updateDoc(docRef, {
        whatsapp_session: sessionId,
    });

    return {message: "catalog-session-vinculated"};
}

export async function getCatalogWhatsapp(sessionId) {
    const response = await fetch(`https://flashy-powder-production.up.railway.app/session/status/${sessionId}`, {
        headers: {'Content-Type': 'application/json', 'x-api-key': process.env.WHATSAPP_API_KEY}
    });

    const data = await response.json();

    return data;
}

export async function createOrder(prevState, formData, catalogId, catalogName, catalogOwner, order, orderPrice) {
    const buyerPhone = formData.get('buyerPhone');
    const buyerName = formData.get('buyerName');

    if (buyerPhone && buyerName) {
        const colRef = collection(db, 'orders');
        await addDoc(colRef, {
            catalog_id: catalogId,
            catalog_name: catalogName,
            catalog_owner: catalogOwner,
            buyer_name: buyerName,
            buyer_phone: buyerPhone,
            content: order,
            price: orderPrice,
            status: 'waiting-accept',
            created_at: new Date()
        });

        return {message: 'order-created'};
    } else {
        return {message: "invalid-params"};
    }
}

export async function sendMessage(waSessionId, chatId, message) {
    const response = await fetch(`https://flashy-powder-production.up.railway.app/client/sendMessage/${waSessionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.WHATSAPP_API_KEY
        },
        body: JSON.stringify({
            "chatId": chatId,
            "contentType": "string",
            "content": message
        })
    });

    return response
}

export async function acceptOrder(order, waSessionId) {
    const response = await sendMessage(waSessionId, `${order.buyer_phone}@c.us`, 
`*Seu Pedido foi Aceito*

*Pedido:* ${order.id}
*Nome:* ${order.buyer_name}

*ENTREGA E PAGAMENTO A COMBINAR*

*PRODUTOS*
${order.content.map((item) => `✅ ${item.quantity} x ${item.name}
    ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
`).join('\n')}
*TOTAIS*
*Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
---------------------------------
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);

    if(response.status === 200 && waSessionId !== "catalog-maker") {
        const waSession = await fetch(`https://flashy-powder-production.up.railway.app/client/getClassInfo/${waSessionId}`, {
            headers: {
                'x-api-key': process.env.WHATSAPP_API_KEY
            }
        });
        const waSessionData = await waSession.json();

        const catalogOwnerChatId = waSessionData.sessionInfo.me._serialized

        await sendMessage('catalog-maker', catalogOwnerChatId, 
`*Novo Pedido*

*Pedido:* ${order.id}
*Cliente/Comprador:* ${order.buyer_name}
*Catálogo:* ${order.catalog_id}
*Número do Cliente:* ${order.buyer_phone}  

*ENTREGA E PAGAMENTO A COMBINAR COM O COMPRADOR*

*PRODUTOS*
${order.content.map((item) => `✅ ${item.quantity} x ${item.name}
    ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
`).join('\n')}
*TOTAIS*
*Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
---------------------------------
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);

        const docRef = doc(db, 'orders', order.id);
        await updateDoc(docRef, {
            status: 'accepted',
        })
    }
}


export async function refuseOrder(orderId) {
    const docRef = doc(db, "orders", orderId);
    await deleteDoc(docRef)
}

export async function cancelOrder(formdata, order, waSessionId) {
    const reason = formdata.get('reason');
    await refuseOrder(order.id)
    const response = await sendMessage(waSessionId, `${order.buyer_phone}@c.us`, `
*Pedido Cancelado*

*Pedido:* ${order.id}
*Motivo:* ${reason}

*PRODUTOS*
${order.content.map((item) => `❌ ${item.quantity} x ${item.name}
    ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
`).join('\n')}
*TOTAIS*
*Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
---------------------------------
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    `)

    if (response.status === 200 && waSessionId !== "catalog-maker") {
        await sendMessage(waSessionId, `${order.buyer_phone}@c.us`, `
*Pedido Cancelado*


*Pedido:* ${order.id}
*Cliente/Comprador:* ${order.buyer_name}
*Catálogo:* ${order.catalog_id}
*Número do Cliente:* ${order.buyer_phone}
*Motivo:* ${reason}

*PRODUTOS*
${order.content.map((item) => `❌ ${item.quantity} x ${item.name}
    ${item.variations.map((variation) => `${variation.name}: ${variation.variants}`)}
`).join('\n')}
*TOTAIS*
*Produtos*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
---------------------------------
*Total*: ${order.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    `)
    }
}