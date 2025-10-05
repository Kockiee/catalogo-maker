/**
 * AÇÃO DE DELETAR DIRETÓRIO DO STORAGE
 * 
 * Este arquivo contém a ação server-side para deletar recursivamente um
 * diretório completo do Firebase Storage, incluindo todos os arquivos
 * e subdiretórios dentro dele.
 * 
 * Funcionalidades:
 * - Deletar diretório recursivamente
 * - Remover todos os arquivos do diretório
 * - Remover todos os subdiretórios
 * - Limpeza completa de recursos do Storage
 */

'use server' // Diretiva para indicar que esta função roda no servidor
import { deleteObject, ref, listAll, getMetadata } from "firebase/storage"; // Importa funções do Storage
import { storage } from "../utils/firebase"; // Importa instância do storage

export async function deleteStorageDirectory(directoryPath) {
    const directoryRef = ref(storage, directoryPath); // Cria referência ao diretório

    const result = await listAll(directoryRef); // Lista todos os itens do diretório
    
    // Cria array de promises para deletar todos os arquivos
    const deleteFilesPromises = result.items.map((itemRef) => {
        return deleteObject(itemRef); // Deleta cada arquivo
    });
    
    // Cria array de promises para deletar todos os subdiretórios recursivamente
    const deleteDirectoriesPromises = result.prefixes.map(async (subdirectoryRef) => {
        return deleteStorageDirectory(subdirectoryRef.fullPath); // Chama função recursivamente
    });

    await Promise.all(deleteDirectoriesPromises); // Aguarda deleção de todos os subdiretórios

    await Promise.all(deleteFilesPromises); // Aguarda deleção de todos os arquivos
}
