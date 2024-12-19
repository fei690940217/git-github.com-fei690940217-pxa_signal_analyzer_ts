export interface LineLossInterface {
  id: string;
  frequency: number | null;
  lineLoss: number | null;
}
// tableList 是 TableItem 类型的数组
export type TableList = LineLossInterface[];
export enum LineLossKey {
  Frequency = 'frequency',
  LineLoss = 'lineLoss',
}

export type ValueChangeFunction = (
  value: number | null,
  key: LineLossKey,
  id: string,
) => void;
