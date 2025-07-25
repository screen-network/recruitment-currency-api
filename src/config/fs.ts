import { join, normalize, resolve } from 'path';

export function dir(path: string) {
  return resolve(normalize(join(process.cwd(), path)));
}
const fs = {
  fs: {
    defaultProvider: 'fs-local',
    providers: [
      {
        service: 'fsNative',
        name: 'fs-local',
        basePath: dir('./data/files'),
      },

      {
        service: 'fsNative',
        name: 'fs-temp',
        basePath: dir('./data/files/temp'),
      },
    ],
  },
};

export default fs;
