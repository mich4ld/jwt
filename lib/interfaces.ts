export interface JwtPayload {
    exp: number;
    iat: number;
    iss?: string;
}

export interface JwtHeader {
    alg: string;
    typ: string;
}

export interface JwtToken<T> {
    header: JwtHeader;
    payload: JwtPayload&T;
}

export interface JwtOptions {
    expireAt?: number,
    issuer?: string;
}