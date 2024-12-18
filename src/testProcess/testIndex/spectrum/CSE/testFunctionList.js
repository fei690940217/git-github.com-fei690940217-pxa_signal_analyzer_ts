/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\testIndex\spectrum\CSE\testFunctionList.js
 * @Author: xxx
 * @Date: 2023-05-08 13:27:31
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 17:40:35
 * @Descripttion: 测试函数集合
 */
const { delayTime } = require("../../../utils");
const SharedParameters = require('../../../globals')
const { v4: uuidv4 } = require("uuid");
const { orderBy } = require("lodash");
const {
  publicWriteFn,
  publicQueryFn,
  CABLE_LOSS: public_cable_loss,
} = require("../testFunctionList");

//第一段处理逻辑
const firstParagraph = (BW, FH) => {
  return new Promise(async (resolve, reject) => {
    try {
      //标记1点
      await publicWriteFn(`标记1点`, `:CALCulate:MARKer1:MAXimum`);
      //标记2点  标完2点,读取2点X轴的值，直到查询到的标记的点X轴的值超过频段的范围后的第一个点指令停止
      while (true) {
        //标记2点
        await publicWriteFn("标记2点", `:CALCulate:MARKer2:MAXimum:NEXT`);
        //查询2点X轴结果
        const rst = await publicQueryFn(
          `获取MARKer2 X`,
          `:CALCulate:MARKer2:X?`
        );
        //rst>limit limit= FH + BW + 5M 结束函数
        const limit = FH + BW + 5;
        const tempRst = Number(rst) / 1000000;
        if (tempRst > limit) {
          resolve();
          return;
        } else {
          await delayTime(10);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
//第二段处理逻辑
const secondParagraph = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //标记1点
      await publicWriteFn(`标记1点`, `:CALCulate:MARKer1:MAXimum`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
//标点逻辑
exports.MARKER_POINTS = async (subItem) => {
  const { BW, FH, segmentNumber } = subItem;
  try {
    if (segmentNumber === 2) {
      await secondParagraph();
    } else {
      await firstParagraph(BW, FH);
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

//OBW频谱结果转换
//频谱返回格式   2.090237516E+01,4.536940000E+01
//需转换为MHz  1MHz = 1000000 Hz
exports.resultNumHandle = (rstX, rstY) => {
  try {
    if (rstX && rstY) {
      const x = (Number(rstX) / 1000000).toFixed(2);
      const y = Number(rstY).toFixed(2);
      if (isNaN(x) && isNaN(y)) {
        return "";
      } else {
        return `${x},${y}`;
      }
    } else {
      return "";
    }
  } catch (error) {
    return "";
  }
};
const dutyCycleCompute = (lineLoss, dutyCycle) => {
  const num = 10 * Math.log10(100 / dutyCycle) + lineLoss;
  return num;
};
//频谱线损
exports.CABLE_LOSS = async (DLFreq, isFDD) => {
  if (isFDD) {
    return public_cable_loss(DLFreq);
  } else {
    let num = "";
    const spectrumLineLoss = SharedParameters.get("spectrumLineLoss");
    //占空比
    const { dutyCycle } = SharedParameters.get("spectrumConfig");
    const filterSpectrumLineLoss = spectrumLineLoss.filter((item) => {
      return item.frequency !== DLFreq;
    });
    const id = uuidv4();
    const self = {
      id,
      frequency: DLFreq,
      lineLoss: "",
    };
    filterSpectrumLineLoss.push(self);
    //排序
    const orderSpectrumLineLoss = orderBy(
      filterSpectrumLineLoss,
      ["frequency"],
      ["asc"]
    );
    const findIndex = orderSpectrumLineLoss.findIndex((item) => {
      return item.id === id;
    });
    const prevItem = orderSpectrumLineLoss[findIndex - 1];
    const nextItem = orderSpectrumLineLoss[findIndex + 1];
    //公式(DLFreq-prevItem.frequency)/(nextItem.frequency-prevItem.frequency)*(nextItem.lineLoss-prevItem.lineLoss)+prevItem.lineLoss
    if (prevItem?.id && nextItem?.id) {
      //如果占空比有值
      if (dutyCycle) {
        const a = DLFreq - prevItem.frequency;
        const b = nextItem.frequency - prevItem.frequency;
        const c =
          dutyCycleCompute(nextItem.lineLoss, dutyCycle) -
          dutyCycleCompute(prevItem.lineLoss, dutyCycle);
        const d = dutyCycleCompute(prevItem.lineLoss, dutyCycle);
        const value = (a / b) * c + d;
        num = value.toFixed(2);
      }
      //如果 用户没有设置占空比
      else {
        const a = DLFreq - prevItem.frequency;
        const b = nextItem.frequency - prevItem.frequency;
        const c = nextItem.lineLoss - prevItem.lineLoss;
        const d = prevItem.lineLoss;
        const value = (a / b) * c + d;
        num = value.toFixed(2);
      }
    } else {
      num = 5;
    }
    const instructValue = `DISPlay:WINDow:TRACe:Y:SCALe:RLEVel:offset ${num}`;
    return await publicWriteFn("设置频谱线损", instructValue);
  }
};
//
exports.SWE_POINT = (subItem) => {
  const { Band, BW, DLFreq, id, limit, rangeStart, rangeStop } = subItem;
  let num = ((rangeStop - rangeStart) * 2) / 1 + 1;
  return new Promise(async (resolve, reject) => {
    try {
      //标记1点
      await publicWriteFn(`SWEep_POINts`, `:SENSe:SWEep:POINts ${num}`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
