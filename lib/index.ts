import { decodeBase64, encodeBase64 } from "./base64";
import { defaultJwtOptions } from "./constants";
import { JwtHeader, JwtOptions, JwtPayload, JwtToken } from "./interfaces";
import { createSignature, verifyExpiration, verifySignature } from "./validation";

class JWT {
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
        const header = encodeBase64(this.createHeader());
        const payload = encodeBase64(this.createPayload(data, options));

        const token = `${header}.${payload}`;
        const signature = createSignature(token, secret);

        return `${token}.${signature}`;
    }

    static verify<T>(token: string, secret: string): JwtToken<T>|undefined {
        const [
            base64header,
            base64payload,
            signature
        ] = token.split('.');

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
}


interface UserPayload {
    id: number,
    username: string,
}

const secret = "topsecret";
const user: UserPayload = {
    id: 2137,
    username: "Mariusz T."
}

const token = JWT.create(user, secret, {
    expireAt: Math.floor((Date.now() / 1000) + 5),
    issuer: "Miszq"
});
console.log(token);

const jwt = JWT.verify(token, secret);
console.log('JWT should be valid:', jwt);

setTimeout(() => {
    const jwt = JWT.verify(token, secret);
    console.log('JWT should be INVALID:', jwt);
}, 7 * 1000);