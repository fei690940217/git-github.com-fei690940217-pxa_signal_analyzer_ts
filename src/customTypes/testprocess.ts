import { ResultItemType } from './renderer';

export type TestParamsType = {
  parentProjectName: string;
  subProjectName: string;
  currentSelectedItem: ResultItemType;
};

export interface LineLossInterface {
  id: string;
  frequency: number | null;
  lineLoss: number | null;
}
// tableList 是 TableItem 类型的数组
export type LineLossTableList = LineLossInterface[];

export enum LineLossKey {
  Frequency = 'frequency',
  LineLoss = 'lineLoss',
}

export type ValueChangeFunction = (
  value: number | null,
  key: LineLossKey,
  id: string,
) => void;
