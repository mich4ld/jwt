import { JwtOptions } from "./interfaces";

export const DEFAULT_EXP_TIME = Math.floor(Date.now() / 1000 + 2 * 60 * 60);

export const defaultJwtOptions: JwtOptions = {
    expireAt: DEFAULT_EXP_TIME, 
}