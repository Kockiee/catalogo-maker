import jwt from "jsonwebtoken";
import { headers } from 'next/headers'

async function getFirebasePublicKeys() {
  const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  const json = await response.json();
  return json;
}

async function verifyFirebaseIdToken(token) {
  try {
    const publicKeys = await getFirebasePublicKeys();
    const decodedToken = jwt.decode(token, { complete: true });
    const publicKey = publicKeys[decodedToken.header.kid];
    if (!publicKey) {
      console.error('Public key not found for token:', decodedToken.header.kid);
      throw new Error('Public key not found');
    }

    const verifiedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return verifiedToken;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    throw error;
  }
}

export default async function verifyJWTToken(req, next) {
    const headersList = headers();
    const token = headersList.get('authorization');

    if (!token) {
      return Response.json({ message: 'Unable to find authorization Token' }, {status: 401});
    }

    try {
        await verifyFirebaseIdToken(token);
        return await next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      return Response.json({ message: 'Unauthorized access' }, {status: 401});
    }
}