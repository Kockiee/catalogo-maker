// Importação da biblioteca jsonwebtoken para verificar tokens JWT
import jwt from "jsonwebtoken";
// Importação da função headers do Next.js para acessar os cabeçalhos da requisição
import { headers } from 'next/headers';

/**
 * Função assíncrona para obter as chaves públicas do Firebase
 * Essas chaves são necessárias para verificar a autenticidade dos tokens JWT
 * @returns {Promise<Object>} Objeto contendo as chaves públicas do Firebase
 */
async function getFirebasePublicKeys() {
  // Faz uma requisição para a API do Google para obter as chaves públicas do Firebase
  const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  // Converte a resposta para JSON
  const json = await response.json();
  // Retorna o objeto com as chaves públicas
  return json;
}

/**
 * Função assíncrona para verificar um token de ID do Firebase
 * @param {string} token - O token JWT a ser verificado
 * @returns {Promise<Object>} O token decodificado e verificado
 * @throws {Error} Se a verificação do token falhar
 */
async function verifyFirebaseIdToken(token) {
  try {
    // Obtém as chaves públicas do Firebase
    const publicKeys = await getFirebasePublicKeys();
    // Decodifica o token JWT para obter o cabeçalho (sem verificar assinatura)
    const decodedToken = jwt.decode(token, { complete: true });
    // Obtém a chave pública específica para este token usando o ID da chave (kid)
    const publicKey = publicKeys[decodedToken.header.kid];
    // Verifica se a chave pública foi encontrada
    if (!publicKey) {
      // Loga um erro se a chave não foi encontrada
      console.error('Public key not found for token:', decodedToken.header.kid);
      // Lança um erro indicando que a chave não foi encontrada
      throw new Error('Public key not found');
    }

    // Verifica a assinatura do token usando a chave pública e algoritmo RS256
    const verifiedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    // Retorna o token verificado
    return verifiedToken;
  } catch (error) {
    // Loga o erro de verificação
    console.error('Error verifying Firebase ID token:', error);
    // Relança o erro para ser tratado pelo chamador
    throw error;
  }
}

/**
 * Middleware para verificar o token JWT em requisições de API
 * @param {Request} req - O objeto de requisição HTTP
 * @param {Function} next - A função callback a ser executada se o token for válido
 * @returns {Promise<Response>} Resposta de sucesso (executando next()) ou erro de autorização
 */
export default async function verifyJWTToken(req, next) {
    // Obtém a lista de cabeçalhos da requisição
    const headersList = headers();
    // Extrai o token de autorização do cabeçalho
    const token = headersList.get('authorization');

    // Verifica se o token foi fornecido
    if (!token) {
      // Retorna erro 401 se não houver token
      return Response.json({ message: 'Unable to find authorization Token' }, {status: 401});
    }

    try {
        // Tenta verificar o token usando a função de verificação
        await verifyFirebaseIdToken(token);
        // Se a verificação for bem-sucedida, executa a função next()
        return await next();
    } catch (error) {
      // Loga o erro de verificação do JWT
      console.error('JWT verification failed:', error);
      // Retorna erro 401 se a verificação falhar
      return Response.json({ message: 'Unauthorized access' }, {status: 401});
    }
}