import {
  TestItemType,
  SupRowType,
  RBItemType,
} from '@src/customTypes/renderer';
import { RBConfigItem } from '@src/customTypes/main';
import { cloneDeep } from 'lodash';
import { logError } from '@/utils/logLevel';

const { ipcRenderer } = window.myApi;
const getRBConfigJson = async (testItems: string): Promise<RBConfigItem[]> => {
  try {
    let name = testItems;
    if (testItems === 'BandEdgeIC') {
      name = 'BandEdge';
    }
    const jsonFilePath = `app/rbConfig/${name}.json`;
    const addProjectRbConfig = await ipcRenderer.invoke<RBConfigItem[]>(
      'getJsonFileByFilePath',
      jsonFilePath,
    );
    return addProjectRbConfig;
  } catch (error) {
    logError(error?.toString() || `获取${testItems}RB配置文件失败`);
    return Promise.reject(`获取${testItems}RB配置文件失败`);
  }
};

const RBNameIsMatch = (origin: string, target: string) => {
  return origin === target || origin.includes(target);
};
//这是最关键的函数
//用于查找RB num和start的函数
//所有的一切操作都是为了查找这两个参数
const findRbNumAndStart = async (
  addProjectRbConfig: RBConfigItem[],
  testItems: TestItemType,
  supItem: SupRowType,
  RBItem: RBItemType,
) => {
  try {
    const { SCS, BW } = supItem;
    const { OFDM, RB, modulate } = RBItem;
    const normalFindItem = addProjectRbConfig.find((item) => {
      //RB 的名称在这里需要特殊处理一下,因为格式并统一
      const flag = item.SCS == SCS && item.BW == BW && item.OFDM == OFDM;
      const RBFlag = RBNameIsMatch(RB, item.RB);
      return flag && RBFlag;
    });
    if (normalFindItem) {
      const obj = {
        RBNum: normalFindItem.num,
        RBStart: normalFindItem.start,
        modulate,
        OFDM,
        RB,
      };
      return Promise.resolve(obj);
    } else {
      const errorMsg = `请检查RB配置表是否存在 ${testItems} ${supItem.SCS}KHz ${supItem.BW}MHz ${OFDM} ${RB}`;
      return Promise.reject(errorMsg);
    }
  } catch (error) {
    logError(error);
    return Promise.reject(error);
  }
};
//
const BandEdgeListGenerate = async (
  addProjectRbConfig: RBConfigItem[],
  testItems: TestItemType,
  supList: SupRowType[],
  RBList: RBItemType[],
) => {
  try {
    const RESULT = [];
    for (let supItem of supList) {
      let rbList = cloneDeep(RBList);
      const { level, Band } = supItem;
      if (Band === 'n48') {
        rbList = [
          {
            OFDM: 'DFT',
            modulate: 'BPSK',
            RB: 'Outer_Full',
            level: 'L',
            id: 1,
          },
          {
            OFDM: 'DFT',
            modulate: 'QPSK',
            RB: 'Outer_Full',
            level: 'L',
            id: 3,
          },
        ];
      } else {
        rbList = rbList.filter(({ level: rbLevel }) => {
          const tempLevel = rbLevel === 'L' ? 'Low' : 'High';
          return tempLevel === level;
        });
      }
      for (let subItem of rbList) {
        const findItem = await findRbNumAndStart(
          addProjectRbConfig,
          testItems,
          supItem,
          subItem,
        );
        RESULT.push({
          ...supItem,
          ...findItem,
          result: '',
        });
      }
    }
    return RESULT;
  } catch (error) {
    return Promise.reject(error);
  }
};
const normalListGenerate = async (
  addProjectRbConfig: RBConfigItem[],
  testItems: TestItemType,
  supList: SupRowType[],
  RBList: RBItemType[],
) => {
  try {
    const RESULT = [];
    for (let supItem of supList) {
      for (let subItem of RBList) {
        //RB需要做特殊处理
        const findItem = await findRbNumAndStart(
          addProjectRbConfig,
          testItems,
          supItem,
          subItem,
        );
        if (findItem) {
          RESULT.push({
            ...supItem,
            ...findItem,
            result: '',
          });
        }
      }
    }
    return RESULT;
  } catch (error) {
    logError(error);
    return Promise.reject(error);
  }
};
//子级数据生成
export default async (
  list: SupRowType[],
  RBConfigSelected: RBItemType[],
  testItems: TestItemType,
) => {
  try {
    const supList = list;
    //获取新增项目的配置文件
    const addProjectRbConfig = await getRBConfigJson(testItems);
    let RESULT = [];
    //bandedge特殊处理
    if (testItems === 'BandEdge') {
      RESULT = await BandEdgeListGenerate(
        addProjectRbConfig,
        testItems,
        supList,
        RBConfigSelected,
      );
    }
    //其他所有的
    else {
      RESULT = await normalListGenerate(
        addProjectRbConfig,
        testItems,
        supList,
        RBConfigSelected,
      );
    }
    return Promise.resolve(RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};
