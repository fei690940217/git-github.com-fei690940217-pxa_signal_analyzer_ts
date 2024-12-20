import {
  AddFormValueType,
  ResultItemType,
  TestItemType,
  SupRowType,
} from '@src/customTypes/renderer';

const { ipcRenderer } = window.myApi;

const edgeBand = [
  'n77(3650-3700MHz)',
  'n78(3650-3700MHz)',
  'n78(3450-3550MHz)',
  'n77(3450-3550MHz)',
  'n13',
  'n14',
  'n26(814-824MHz)',
  'n30',
  'n78(3700-3800MHz)',
  'n40(2305-2315MHz)',
  'n40(2350-2360MHz)',
];
// 获取项目配置
const fetchProjectConfig = async () => {
  return await ipcRenderer.invoke(
    'getJsonFileByFilePath',
    'app/addProjectConfig.json',
  );
};
//sup排序
//计算排序的数字
const computeSortNum = (a: SupRowType, b: SupRowType) => {
  const { LTE_Band: LTE_Band_A, Band: Band_A } = a;
  const { LTE_Band: LTE_Band_B, Band: Band_B } = b;
  if (Array.isArray(LTE_Band_A) || Array.isArray(LTE_Band_B)) {
    return 0;
  }
  const LTE_Band_A_Num = Number(LTE_Band_A?.substring(1));
  const Band_A_Num = Number(Band_A.split('(')[0].substring(1));
  const LTE_Band_B_Num = Number(LTE_Band_B?.substring(1));
  const Band_B_Num = Number(Band_B.split('(')[0].substring(1));
  const LTE_NUM = LTE_Band_A_Num - LTE_Band_B_Num;
  const Band_NUM = Band_A_Num - Band_B_Num;
  if (Band_NUM > 0) {
    return 1;
  } else if (Band_NUM === 0) {
    return LTE_NUM;
  } else {
    return -1;
  }
};
export const resultSortHandle = (list: SupRowType[]) => {
  return list.sort((a: SupRowType, b: SupRowType) => {
    return computeSortNum(a, b);
  });
};

//生成一二级数据 包含, PAR n41 30KHz 100MHz  623334
const supResultGenerate = async (
  formValue: AddFormValueType,
): Promise<SupRowType[]> => {
  try {
    const { testItems, networkMode, Band } = formValue;
    const testItem = testItems;
    //获取新增项目的配置文件
    const addProjectConfig = await fetchProjectConfig();
    const supList = [];
    for (let BandObj of Band) {
      const { Band, LTE_Band, SCS, BW, ARFCN, FH, FL, CSE_Limit, duplexMode } =
        BandObj;

      for (let scs of SCS) {
        for (let bw of BW) {
          let bwArr = [];
          try {
            let tempBand = Band;
            if (testItem.includes('BandEdge') && edgeBand.includes(Band)) {
              tempBand = `${Band}edge`;
            }
            bwArr = addProjectConfig['FCC'][scs][tempBand][bw];
            if (!bwArr?.length) {
              return Promise.reject(
                `请检查项目配置表FCC ${scs}KHz ${Band} ${bw}MHz 是否存在`,
              );
            }
          } catch (error) {
            return Promise.reject(
              `请检查项目配置表FCC ${scs}KHz ${Band} ${bw}MHz 是否存在`,
            );
          }
          for (let ARFCN_INDEX of ARFCN) {
            //BandEdge/BandEdgeIC 中间信道跳过
            if (ARFCN_INDEX === 1) {
              if (testItem === 'BandEdge') {
                if (Band !== 'n48') {
                  continue;
                }
              } else if (testItem === 'BandEdgeIC') {
                continue;
              }
            }
            const level = ['Low', 'Mid', 'High'][ARFCN_INDEX];
            const [ARFCN, DLFreq] = bwArr[ARFCN_INDEX];
            const flag = ARFCN && DLFreq && ARFCN !== '/' && DLFreq !== '/';
            //跳过
            if (!flag) continue;
            const tempObj = {
              networkMode,
              testItem,
              Band,
              LTE_Band,
              SCS: scs,
              BW: bw,
              ARFCN,
              DLFreq,
              level,
              FH,
              FL,
              CSE_Limit,
              duplexMode,
            };
            supList.push(tempObj);
          }
        }
      }
    }
    return Promise.resolve(supList);
  } catch (error) {
    return Promise.reject(error);
  }
};
//生成一二级数据 NSA版本,需要考虑let_band
const nsaSupResultGenerate = async (
  formValue: AddFormValueType,
): Promise<SupRowType[]> => {
  try {
    const tempSupList = await supResultGenerate(formValue);
    //对LTE_Band进行裂变
    const list = tempSupList.flatMap((supItem) => {
      const { LTE_Band } = supItem;
      if (Array.isArray(LTE_Band) && LTE_Band?.length) {
        const tempSupList: SupRowType[] = LTE_Band.map((let_band) => {
          return Object.assign({}, supItem, { LTE_Band: let_band });
        });
        return tempSupList;
      } else {
        return [supItem];
      }
    });
    //排序
    const SORT_RESULT = resultSortHandle(list);
    return Promise.resolve(SORT_RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default async (formValue: AddFormValueType) => {
  const { networkMode } = formValue;
  const isNSA = networkMode === 'NSA';
  return isNSA ? nsaSupResultGenerate(formValue) : supResultGenerate(formValue);
};
