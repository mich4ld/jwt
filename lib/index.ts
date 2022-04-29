import { decodeBase64, encodeBase64 } from "./base64";
import { defaultJwtOptions } from "./constants";
import { JwtHeader, JwtOptions, JwtPayload, JwtToken } from "./interfaces";
import { createSignature, verifyExpiration, verifySignature } from "./validation";

export class JWT {
    private static createHeader(): JwtHeader {
        return {
            alg: "HS256",
            typ: "JWT",
        }
    }

    private static createPayload(data: any, options: JwtOptions): JwtPayload {
        return {
            exp: options.expireAt,
            iat: Math.floor(Date.now() / 1000),
            iss: options.issuer,
            ...data,
        }
    }
 
    static create<T>(data: T, secret: string, options: JwtOptions = defaultJwtOptions) {
        options = {
            ...defaultJwtOptions,
            ...options,
        }

        const header = encodeBase64(this.createHeader());
        const payload = encodeBase64(this.createPayload(data, options));

        const token = `${header}.${payload}`;
        const signature = createSignature(token, secret);

        return `${token}.${signature}`;
    }

    static verify<T>(token: string, secret: string): JwtToken<T>|undefined {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            return;
        }

        const [
            base64header,
            base64payload,
            signature
        ] = tokenParts;

        const input = `${base64header}.${base64payload}`;
        const isValid = verifySignature(input, signature, secret);

        if (!isValid) {
            return;
        }

        const header = decodeBase64(base64header) as JwtHeader;
        const payload = decodeBase64(base64payload) as JwtPayload & T;

        const isExpired = verifyExpiration(payload.exp);
        if (isExpired) {
            return;
        }

        const jwt: JwtToken<T> = {
            header,
            payload,
        }

        return jwt;
    }

    static decode<T>(token: string): JwtToken<T>|undefined {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            return;
        }

        const [
            base64header,
            base64payload,
        ] = tokenParts;

        const header = decodeBase64(base64header) as JwtHeader;
        const payload = decodeBase64(base64payload) as JwtPayload & T;

        const jwt: JwtToken<T> = {
            header,
            payload,
        }

        return jwt;
    }
}