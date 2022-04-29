import crypto from 'crypto';

export function createSignature(input: string, secret: string) {
    const hmac = crypto.createHmac('sha256', secret);
    const signature = hmac
        .update(input)
        .digest('base64url');

    return signature;
}