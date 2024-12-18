import { loopFn } from "./formData";
import { logError } from '@/utils/logLevel.js'
const { ipcRenderer, appConfigFilePath } = window.myApi;

const findItemHandle = (findItem, subItem) => {
  const {
    start: startList,
    stop: stopList,
    RBW: RBW_LIST,
    VBW: VBW_LIST,
    no,
    limit,
    sweepTime,
    sweepPoint,
  } = findItem;
  return {
    start: loopFn(startList, subItem),
    stop: loopFn(stopList, subItem),
    RBW: loopFn(RBW_LIST, subItem),
    VBW: loopFn(VBW_LIST, subItem),
    no,
    limit,
    sweepTime,
    sweepPoint,
  };
};

const findEmissionRow = async (emissionList, BW, RB, level, Band) => {
  try {
    const tempLevel = level[0]; //L,M,H   Low[0] = L
    const tempBW = String(BW);
    const findItem = emissionList.find((emissionItem) => {
      const BW_FLAG =
        emissionItem.BW === "all" ||
        emissionItem.BW == tempBW ||
        `${emissionItem.BW}`.includes(tempBW);
      const RBFlag = emissionItem.RB == RB;
      const levelFlag = emissionItem.level === tempLevel;
      return RBFlag && BW_FLAG && levelFlag;
    });
    if (findItem) {
      return Promise.resolve(findItem);
    } else {
      return Promise.reject(
        `请检查emissionLimitIC配置表 ${Band} RB<${RB}> BW<${BW}> level<${level}> 是否存在 `
      );
    }
  } catch (error) {
    logError(`请检查emissionLimitIC配置表 ${Band} RB<${RB}> BW<${BW}> level<${level}> 是否存在 `)
    return Promise.reject(
      `请检查emissionLimitIC配置表 ${Band} RB<${RB}> BW<${BW}> level<${level}> 是否存在 `
    );
  }
};
export default async (supList) => {
  try {
    const emissionLimit = await ipcRenderer.invoke(
      "getJsonFileByFilePath",
      "app/emissionLimitIC.json"
    );
    const RESULT = [];
    for (const supItem of supList) {
      const { list: subList, Band } = supItem;
      const emissionList = emissionLimit[Band];
      const tempSubList = [];
      for (const subItem of subList) {
        //通过一下四个参数,找到匹配的emissionLimit配置
        const { BW, RB, level } = subItem;
        //获取Band对应的emissionList
        const findItem = await findEmissionRow(
          emissionList,
          BW,
          RB,
          level,
          Band
        );
        const TEMP_OBJ = findItemHandle(findItem, subItem);
        //对findItem进行处理 公式计算
        const tempSubItem = {
          ...subItem,
          ...TEMP_OBJ,
          isGate: false,
        };
        tempSubList.push(tempSubItem);
      }
      RESULT.push({ ...supItem, list: tempSubList });
    }
    return Promise.resolve(RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};
