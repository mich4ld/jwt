export interface JwtPayload {
    sub: number;
    iat: number;
}

export interface JwtHeader {
    alg: string;
    typ: string;
}

export interface JwtToken<T> {
    header: JwtHeader;
    payload: JwtPayload&T;
}