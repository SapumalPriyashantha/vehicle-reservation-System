import { environment } from "src/environments/environment";

const HOST = environment.host;
const PORT = environment.port;

export const SECURE = true;
export const NON_SECURE = false;

export const getEndpoint = (isHttps: boolean) => {
  return `${isHttps ? 'https' : 'http'}://${HOST}:${PORT}/api/v1`;
};



