'use server'
import { deleteObject, ref, listAll, getMetadata } from "firebase/storage";
import { storage } from "../utils/firebase";

export async function deleteStorageDirectory(directoryPath) {
    const directoryRef = ref(storage, directoryPath);

    const result = await listAll(directoryRef);
    
    const deleteFilesPromises = result.items.map((itemRef) => {
        return deleteObject(itemRef);
    });
    
    const deleteDirectoriesPromises = result.prefixes.map(async (subdirectoryRef) => {
        return deleteStorageDirectory(subdirectoryRef.fullPath);
    });

    await Promise.all(deleteDirectoriesPromises);

    await Promise.all(deleteFilesPromises);
}
