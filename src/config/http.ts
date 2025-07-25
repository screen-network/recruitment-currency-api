import { join, normalize, resolve } from 'path';

export function dir(path: string) {
  return resolve(normalize(join(process.cwd(), "build", path)));
}

const http = {
  http: {
    port: process.env.BACKEND_PORT ?? 9123,
  },
  system: {
    dirs: {
      controllers: [dir('./controllers')],
    },
  },
};

export default http;
