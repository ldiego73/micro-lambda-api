/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const normalizePath = (path: string): string => path.replace(/\/+$/, "");
export function parseBody(body: any): any {
  try {
    return JSON.parse(body);
  } catch (e) {
    return body;
  }
}
export function getPathKeys(routePath: string): string[] | null {
  const normalizeRoutePath = routePath.replace(/:[\w.]+/g, ":([\\w]+)");
  // eslint-disable-next-line security-node/non-literal-reg-expr
  const regexp = new RegExp(`^${normalizeRoutePath}$`);
  const names = regexp.exec(routePath);

  return names ? names.slice(1) : null;
}
export function getPathValues(
  routePath: string,
  path: string
): string[] | null {
  const normalizeRoutePath = routePath.replace(/:[\w]+/g, "([^/]+)");
  // eslint-disable-next-line security-node/non-literal-reg-expr
  const regexp = new RegExp(`^${normalizeRoutePath}$`);
  const values = regexp.exec(path);

  return values ? values.slice(1) : null;
}
