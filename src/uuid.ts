import crypto from "crypto";

function rng(): Uint8Array {
  const rnds8Pool = new Uint8Array(256);
  let poolPtr = rnds8Pool.length;

  /* istanbul ignore next */
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, (poolPtr += 16));
}

function stringify(arr: Uint8Array, offset = 0) {
  const byteToHex: any[] = [];

  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substr(1));
  }

  const uuid = `${
    byteToHex[arr[offset + 0]] +
    byteToHex[arr[offset + 1]] +
    byteToHex[arr[offset + 2]] +
    byteToHex[arr[offset + 3]]
  }-${byteToHex[arr[offset + 4]]}${byteToHex[arr[offset + 5]]}-${
    byteToHex[arr[offset + 6]]
  }${byteToHex[arr[offset + 7]]}-${byteToHex[arr[offset + 8]]}${
    byteToHex[arr[offset + 9]]
  }-${byteToHex[arr[offset + 10]]}${byteToHex[arr[offset + 11]]}${
    byteToHex[arr[offset + 12]]
  }${byteToHex[arr[offset + 13]]}${byteToHex[arr[offset + 14]]}${
    byteToHex[arr[offset + 15]]
  }`.toLowerCase();

  /* istanbul ignore next */
  if (!validate(uuid)) {
    throw TypeError("UUID is invalid");
  }

  return uuid;
}

export function validate(uuid: string): boolean {
  return (
    typeof uuid === "string" &&
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i.test(
      uuid
    )
  );
}

export function uuidv4(): string {
  const rnds = rng();

  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  return stringify(rnds);
}
