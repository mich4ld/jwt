import { JWT } from "../lib";

const SECRET = "TOP_SECRET";

async function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

describe('Test JWT creation', () => {
    it ('should generate token with 3 parts', () => {
        const data = {
            id: 2138,
            username: "John Doe",
            admin: false,
        }

        const token = JWT.create(data, SECRET);
        const parts = token.split('.');

        expect(parts.length).toEqual(3);
    });
});

describe('Test JWT validation', () => {
    const data = {
        id: "202ff86b-6462-48a2-9ec8-0090bd4da643",
        name: "Mariusz",
        age: 18,
        admin: true,
        email: "mario@mail.com",
    }

    it ('decoding should be reversible', () => {
        const issuer = "issuer";
        const token = JWT.create(data, SECRET, {
            issuer,
        });

        const result = JWT.verify<typeof data>(token, SECRET);

        expect(result).toBeDefined();
        expect(result?.payload.id).toEqual(data.id);
        expect(result?.payload.iss).toEqual(issuer);
    });

    it ('should fail validation because token should be expired', async () => {
        const expireAt = Math.floor(Date.now() / 1000 + 4);
        const token = JWT.create(data, SECRET, {
            expireAt,
        });

        await sleep(5)
        const result = JWT.verify(token, SECRET);
        expect(result).toBeUndefined();
    });
});