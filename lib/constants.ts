import { JwtOptions } from "./interfaces";

export const DEFAULT_EXP_TIME = Math.floor(Date.now() + 2 * 60 * 60 * 60 * 1000);

export const defaultJwtOptions: JwtOptions = {
    expireAt: DEFAULT_EXP_TIME, 
}