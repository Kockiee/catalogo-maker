'use server'

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../utils/firebase";
import { collection, doc, getDocs, query, updateDoc, where, getDoc } from "firebase/firestore";

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