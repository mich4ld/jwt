export function encodeBase64(data: any) {
    const dataJson = JSON.stringify(data);
    const buff = Buffer.from(dataJson);

    return buff.toString('base64url');
}

export function decodeBase64(base64data: string): object {
    const buff = Buffer.from(base64data, 'base64url');
    const dataJson = buff.toString('utf-8');
    const data = JSON.parse(dataJson);

    return data;
}