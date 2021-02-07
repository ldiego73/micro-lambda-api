// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deepCopy = (obj: any): any => JSON.parse(JSON.stringify(obj));
