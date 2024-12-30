import {
  AddFormValueType,
  ResultItemType,
  TestItemType,
  SupRowType,
  RBItemType,
} from '@src/customTypes/renderer';
import { RBConfigItem } from '@src/customTypes/main';
import { cloneDeep } from 'lodash';
import { logError } from '@/utils/logLevel';
import { type Key } from 'react';
import RBTableObj from './RBTableObj';

const { ipcRenderer } = window.myApi;
const getRBConfigJson = async (testItems: string): Promise<RBConfigItem[]> => {
  try {
    let name = testItems;
    if (testItems === 'BandEdgeIC') {
      name = 'BandEdge';
    }
    const jsonFilePath = `app/rbConfig/${name}.json`;
    const addProjectRbConfig = await ipcRenderer.invoke(
      'getJsonFileByFilePath',
      jsonFilePath,
    );
    return addProjectRbConfig;
  } catch (error) {
    logError(error?.toString() || `获取${testItems}RB配置文件失败`);
    return Promise.reject(`获取${testItems}RB配置文件失败`);
  }
};

//根据RBSelectedRowKeys 与addProjectRbConfig 生成RB列表  参数为测试用例 例如 PAR
//BandEdgeIC配置项的RB名称比较特殊，需要单独处理,但是实际上以下两项都从Outer_Full中读取数据
//  'Outer_Full_Left',
//   'Outer_Full_Right',
const RBListGenerate = (RBConfigSelected: Key[], testItem: TestItemType) => {
  try {
    const RB_LIST = RBTableObj[testItem];
    const rbList = RB_LIST.filter((rbItem) => {
      return RBConfigSelected.includes(rbItem.id);
    });

    if (testItem === 'BandEdgeIC') {
      return rbList.map((item) => {
        if (item.RB?.includes('Full')) {
          item.RB = 'Outer_Full';
        }
        return item;
      });
    }
    return rbList;
  } catch (error) {
    logError(error);
    return [];
  }
};
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
      const flag =
        item.SCS == SCS && item.BW == BW && item.OFDM == OFDM && item.RB == RB;
      return flag;
    });
    //满RB
    const fullFindItem = addProjectRbConfig.find((item) => {
      const flag =
        item.SCS == SCS &&
        item.BW == BW &&
        item.OFDM == OFDM &&
        item.RB == 'Outer_Full';
      return flag;
    });
    if (normalFindItem && fullFindItem) {
      const obj = {
        RBNum: normalFindItem.num,
        RBStart: normalFindItem.start,
        fullRBNum: fullFindItem.num,
        fullRBStart: fullFindItem.start,
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
  RBConfigSelected: Key[],
  testItems: TestItemType,
) => {
  try {
    const RBList = RBListGenerate(RBConfigSelected, testItems);
    const supList = list;
    //获取新增项目的配置文件
    const addProjectRbConfig = await getRBConfigJson(testItems);
    let RESULT = [];
    if (testItems === 'BandEdge') {
      RESULT = await BandEdgeListGenerate(
        addProjectRbConfig,
        testItems,
        supList,
        RBList,
      );
    } else {
      RESULT = await normalListGenerate(
        addProjectRbConfig,
        testItems,
        supList,
        RBList,
      );
    }
    return Promise.resolve(RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};
