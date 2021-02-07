"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathValues = exports.getPathKeys = exports.parseBody = exports.normalizePath = void 0;
const normalizePath = (path) => path.replace(/\/+$/, "");
exports.normalizePath = normalizePath;
function parseBody(body) {
    try {
        return JSON.parse(body);
    }
    catch (e) {
        return body;
    }
}
exports.parseBody = parseBody;
function getPathKeys(routePath) {
    const normalizeRoutePath = routePath.replace(/:[\w.]+/g, ":([\\w]+)");
    const regexp = new RegExp(`^${normalizeRoutePath}$`);
    const names = regexp.exec(routePath);
    return names ? names.slice(1) : null;
}
exports.getPathKeys = getPathKeys;
function getPathValues(routePath, path) {
    const normalizeRoutePath = routePath.replace(/:[\w]+/g, "([^/]+)");
    const regexp = new RegExp(`^${normalizeRoutePath}$`);
    const values = regexp.exec(path);
    return values ? values.slice(1) : null;
}
exports.getPathValues = getPathValues;
