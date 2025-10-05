/**
 * Middleware de Verificação de Token JWT
 * 
 * Este arquivo implementa um middleware de autenticação que verifica a validade
 * de tokens JWT do Firebase Authentication. É usado para proteger rotas da API
 * que requerem autenticação, garantindo que apenas usuários autenticados possam
 * acessar recursos protegidos. Utiliza as chaves públicas do Firebase para
 * verificar a assinatura dos tokens.
 */

// Importa a biblioteca para manipulação de tokens JWT
import jwt from "jsonwebtoken";
// Importa a função para acessar headers da requisição
import { headers } from 'next/headers'

/**
 * Função para obter as chaves públicas do Firebase
 * Busca as chaves públicas necessárias para verificar a assinatura dos tokens
 */
async function getFirebasePublicKeys() {
  // Faz uma requisição para o endpoint oficial do Google que fornece as chaves públicas
  const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  // Converte a resposta para formato JSON
  const json = await response.json();
  // Retorna as chaves públicas
  return json;
}

/**
 * Função para verificar a validade de um token JWT do Firebase
 * @param {string} token - O token JWT a ser verificado
 * @returns {object} - Os dados decodificados do token se válido
 */
async function verifyFirebaseIdToken(token) {
  try {
    // Obtém as chaves públicas do Firebase
    const publicKeys = await getFirebasePublicKeys();
    // Decodifica o token para obter o header e identificar qual chave usar
    const decodedToken = jwt.decode(token, { complete: true });
    // Busca a chave pública específica para este token
    const publicKey = publicKeys[decodedToken.header.kid];
    
    // Verifica se a chave pública foi encontrada
    if (!publicKey) {
      console.error('Public key not found for token:', decodedToken.header.kid);
      throw new Error('Public key not found');
    }

    // Verifica a assinatura do token usando a chave pública
    const verifiedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    // Retorna os dados do token se a verificação for bem-sucedida
    return verifiedToken;
  } catch (error) {
    // Registra o erro no console para debugging
    console.error('Error verifying Firebase ID token:', error);
    // Re-lança o erro para ser tratado pelo middleware
    throw error;
  }
}

/**
 * Middleware principal de verificação de token JWT
 * @param {object} req - Objeto da requisição HTTP
 * @param {function} next - Função a ser executada se a autenticação for bem-sucedida
 * @returns {Response} - Resposta HTTP com sucesso ou erro de autenticação
 */
export default async function verifyJWTToken(req, next) {
    // Obtém os headers da requisição
    const headersList = headers();
    // Extrai o token de autorização do header 'authorization'
    const token = headersList.get('authorization');

    // Verifica se o token foi fornecido
    if (!token) {
      // Retorna erro 401 (Não autorizado) se o token não foi encontrado
      return Response.json({ message: 'Unable to find authorization Token' }, {status: 401});
    }

    try {
        // Verifica se o token é válido usando as chaves públicas do Firebase
        await verifyFirebaseIdToken(token);
        // Se a verificação for bem-sucedida, executa a função next (rota protegida)
        return await next();
    } catch (error) {
      // Registra o erro de verificação no console
      console.error('JWT verification failed:', error);
      // Retorna erro 401 (Não autorizado) se a verificação falhar
      return Response.json({ message: 'Unauthorized access' }, {status: 401});
    }
}