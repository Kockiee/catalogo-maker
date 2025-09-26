// Este arquivo define a função que exclui todos os arquivos e subpastas de um diretório no armazenamento do Firebase.
// Serve para apagar todos os dados de um catálogo ou produto de forma recursiva.

'use server'

// Importa funções para manipular arquivos no Firebase Storage
import { deleteObject, ref, listAll, getMetadata } from "firebase/storage";
import { storage } from "../utils/firebase";

/**
 * Exclui todos os arquivos e subdiretórios de um diretório no armazenamento
 * @param {string} directoryPath - Caminho do diretório a ser excluído
 */
export async function deleteStorageDirectory(directoryPath) {
    // Cria referência ao diretório no armazenamento
    const directoryRef = ref(storage, directoryPath);

    // Lista todos os arquivos e subdiretórios dentro do diretório
    const result = await listAll(directoryRef);

    // Cria uma lista de promessas para excluir todos os arquivos encontrados
    const deleteFilesPromises = result.items.map((itemRef) => {
        return deleteObject(itemRef); // Exclui o arquivo
    });

    // Cria uma lista de promessas para excluir todos os subdiretórios encontrados (recursivamente)
    const deleteDirectoriesPromises = result.prefixes.map(async (subdirectoryRef) => {
        return deleteStorageDirectory(subdirectoryRef.fullPath); // Chama a função novamente para subdiretório
    });

    // Aguarda a exclusão de todos os subdiretórios
    await Promise.all(deleteDirectoriesPromises);

    // Aguarda a exclusão de todos os arquivos
    await Promise.all(deleteFilesPromises);
}
