/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\testIndex\spectrum\BandEdge\testFunctionList.js
 * @Author: xxx
 * @Date: 2023-05-08 13:27:31
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 17:39:27
 * @Descripttion: 测试函数集合
 */
const SharedParameters = require('../../../globals')
const { v4: uuidv4 } = require("uuid");
const { orderBy } = require("lodash");
const { publicWriteFn, CABLE_LOSS: public_cable_loss } = require("../testFunctionList");
const { logInfo, logError } = require('../../../utils/logLevel')

//OBW频谱结果转换
//频谱返回格式   3.000000000E+00,1000000000E+00,1.000000000E+00, 2.553466667E+09, 1.903601837E+01,3.000000000E+01,1.000000000E+00,2.000000000E+00,3.000000000E+00,2.573406667E+09,3.000000000E+00,3.000000000E+00,1.000000000E+0,1.000000000E+0,1.000000000E+0,1.000000000E+0,1.000000000E+0,1.000000000E+0,0.000000000E+0
//需转换为MHz  1MHz = 1000000 Hz
exports.resultNumHandle = (rst) => {
  try {
    if (rst) {
      const tempRst = rst.split(",").map((item) => Number(item));
      return tempRst;
    } else {
      return [];
    }
  } catch (error) {
    logError(error.toString())
    return [];
  }
};
const dutyCycleCompute = (lineLoss, dutyCycle) => {
  const num = 10 * Math.log10(100 / dutyCycle) + lineLoss;
  return num;
};
//频谱线损
exports.CABLE_LOSS = async (DLFreq, isFDD) => {
  if (isFDD) {
    return public_cable_loss(DLFreq)
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

exports.getRepeatString = (str, no) => {
  return new Promise(async (resolve, reject) => {
    try {
      let strList = [];
      for (let i = 0; i < no; i++) {
        strList.push(str);
      }
      const resultString = strList.join(",");
      resolve(resultString);
    } catch (error) {
      reject(error);
    }
  });
};
