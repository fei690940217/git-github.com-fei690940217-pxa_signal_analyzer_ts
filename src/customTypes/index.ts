import { ProjectItemType, ResultItemType } from './renderer';

export type OFDMType = 'DFT' | 'CP';
export type AddDirType = {
  id: string;
  dirName: string;
  description: string;
  createdAt: string;
};

export type OpenTheProjectWindowPayload = {
  dirName: string;
  subProjectName?: string;
};
export type IpcRendererInvokeResType = {
  code: number;
  msg: string;
};

export type CreateProjectPayload = {
  dirName: string;
  subProjectName: string;
  isAdd: boolean;
  projectInfo: ProjectItemType;
  result: ResultItemType[];
};
export type ApiResponseType<T = unknown> = {
  code: number;
  msg?: string;
  data?: T;
};
//广播的消息格式
export type BroadcastChannelParams = {
  action: string;
  payload: any;
};
//归档项目的格式
export type ArchiveProjectPayload = {
  dirName: string;
  subProjectNameList: string[];
};
