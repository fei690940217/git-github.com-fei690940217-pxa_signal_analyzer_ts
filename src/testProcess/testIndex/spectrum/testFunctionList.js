/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\testIndex\spectrum\testFunctionList.js
 * @Author: xxx
 * @Date: 2023-05-08 13:27:31
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-10 17:07:48
 * @Descripttion: 测试函数集合
 */
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const { orderBy } = require('lodash')
const SharedParameters = require('../../globals')

const { pinpuConnectionName, appConfigFilePath } = require("../../../main/publicData");
const {
  query_fn,
  write_fn,
  get_screen_capture,
  set_timeout,
} = require("../../api");
const { delayTime } = require('../../utils')
//获取图片路径
exports.getImgPath = (id) => {
  const projectName = SharedParameters.get("projectName");
  const subProjectName = SharedParameters.get("subProjectName");
  return path.join(
    appConfigFilePath,
    "user/project",
    projectName,
    subProjectName,
    "img",
    `${id}.png`
  );
};
//公用测试函数
//参数 指令名称,指令值
const publicWriteFn = async (instructName, instructValue, timeout) => {
  try {
    const params = {
      instr_name: pinpuConnectionName,
      command: instructValue,
      instructName,
    };
    let config = {}
    if (timeout) {
      config = {
        timeout
      }
    }
    await write_fn(params, config);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

const publicQueryFn = (instructName, command, timeout) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        instr_name: pinpuConnectionName,
        command,
        instructName,
      };
      let config = {}
      if (timeout) {
        config = { timeout }
      }
      const rst = await query_fn(params);
      resolve(rst);
    } catch (error) {
      reject(error);
    }
  });
};

//频谱线损
exports.CABLE_LOSS = async (DLFreq) => {
  let num = '';
  const spectrumLineLoss = SharedParameters.get("spectrumLineLoss");
  const filterSpectrumLineLoss = spectrumLineLoss.filter(item => {
    return item.frequency !== DLFreq
  })
  const id = uuidv4()
  const self = {
    id,
    frequency: DLFreq,
    lineLoss: "",
  }
  filterSpectrumLineLoss.push(self)
  //排序
  const orderSpectrumLineLoss = orderBy(filterSpectrumLineLoss, ['frequency'], ['asc'])
  const findIndex = orderSpectrumLineLoss.findIndex(item => {
    return item.id === id
  })
  const prevItem = orderSpectrumLineLoss[findIndex - 1]
  const nextItem = orderSpectrumLineLoss[findIndex + 1]
  //公式(DLFreq-prevItem.frequency)/(nextItem.frequency-prevItem.frequency)*(nextItem.lineLoss-prevItem.lineLoss)+prevItem.lineLoss
  if (prevItem?.id && nextItem?.id) {
    const a = DLFreq - prevItem.frequency
    const b = nextItem.frequency - prevItem.frequency
    const c = nextItem.lineLoss - prevItem.lineLoss
    const d = prevItem.lineLoss
    const value = ((a / b) * c) + d
    num = value.toFixed(2)
  } else {
    num = 5;
  }
  const instructValue = `DISPlay:WINDow:TRACe:Y:SCALe:RLEVel:offset ${num}`;
  return await publicWriteFn("设置频谱线损", instructValue);
};

//POW:ATT {pow_att}
exports.POW_ATT = () => {
  const spectrumConfig = SharedParameters.get("spectrumConfig");
  const value = spectrumConfig.POWATT;
  const instructValue = `POW:ATT ${value}`;
  return publicWriteFn("POW_ATT", instructValue);
};


//获取截图
// {
//     instr_name: params.instr_name,
//     img_path: params.img_path,
//   };
exports.GET_SCREEN_CAPTURE = (img_path, timeout) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        instr_name: pinpuConnectionName,
        img_path: img_path,
        instructName: "获取结果截图",
      };
      let config = {}
      if (timeout) {
        config = {
          timeout
        }
      }
      await get_screen_capture(params, config);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
//设置频谱连接超时时间
// let obj = {
//   instr_name: params.instr_name,
//   img_path: params.timeout,
// };
exports.SET_TIMEOUT = (timeout) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        instr_name: pinpuConnectionName,
        timeout,
        instructName: "设置频谱超时时长",
      };
      await set_timeout(params);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
//判定频谱是否测试结束
exports.STAT_OPER_COND = async () => {
  const command = `:STAT:OPER:COND?`
  try {
    while (true) {
      const params = {
        instr_name: pinpuConnectionName,
        command,
        instructName: '获取频谱测试状态',
      };
      let rst = await query_fn(params);
      const newRst = rst?.replace(/\s/g, '')
      if (String(newRst) === '0') {
        return Promise.resolve();
      } else {
        await delayTime(3000)
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
exports.publicWriteFn = publicWriteFn
exports.publicQueryFn = publicQueryFn
