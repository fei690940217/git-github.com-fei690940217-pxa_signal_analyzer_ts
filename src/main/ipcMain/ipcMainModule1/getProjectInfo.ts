import { logError } from '@src/main/logger/logLevel';
import path from 'path';
import { readJson } from 'fs-extra';
import { appConfigFilePath } from '@src/main/publicData';
type getProjectInfoType = {
  dirName: string;
  subProjectName: string;
};
export default async (params: getProjectInfoType) => {
  try {
    const { dirName, subProjectName } = params;
    const filePath = path.join(
      appConfigFilePath,
      'user',
      'project',
      dirName,
      subProjectName,
      'projectInfo.json',
    );
    const resultList = await readJson(filePath);
    return Promise.resolve(resultList);
  } catch (error) {
    const msg = `getProjectInfo 128 error: ${error?.toString()}`;
    logError(msg);
    return Promise.reject(msg);
  }
};
