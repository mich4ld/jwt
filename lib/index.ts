import { encodeBase64 } from "./base64";
import { JwtHeader, JwtPayload, JwtToken } from "./interfaces";
import { createSignature } from "./validation";

class JWT {
    private static createHeader(): JwtHeader {
        return {
            alg: "HS256",
            typ: "JWT",
        }
    }

    private static createPayload(data: any): JwtPayload {
        return {
            iat: Date.now(),
            sub: Date.now(),
            ...data,
        }
    }
 
    static create<T>(data: T, secret: string) {
        const header = encodeBase64(this.createHeader());
        const payload = encodeBase64(this.createPayload(data));

        const token = `${header}.${payload}`;
        const signature = createSignature(token, secret);

        return `${token}.${signature}`;
    }

    static verify<T>(token: string, secret: string): JwtToken<T> {
        return {} as JwtToken<T>;
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

const token = JWT.create(user, secret);
console.log(token);