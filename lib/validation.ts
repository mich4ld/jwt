import crypto from 'crypto';

export function createSignature(input: string, secret: string) {
    const hmac = crypto.createHmac('sha256', secret);
    const signature = hmac
        .update(input)
        .digest('base64url');

    return signature;
}

export function verifySignature(input: string, signatureToVerify: string, secret: string) {
    const validSignature = createSignature(input, secret);
    
    return validSignature === signatureToVerify;
}

export function verifyExpiration(exp: number) {
    const now = Date.now() / 1000;

    return now > exp;
}