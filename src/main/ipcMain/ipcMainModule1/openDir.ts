import { appConfigFilePath } from '@src/main/publicData';
import { shell } from 'electron';
import path from 'path';

export default async (payload: string) => {
  try {
    const dirpath = path.join(appConfigFilePath, payload);
    const str = await shell.openPath(dirpath);
    return Promise.resolve(str);
  } catch (error) {
    return Promise.reject(error);
  }
};
