/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-15 09:50:18
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-07 16:09:37
 * @FilePath: \5G_TELEC_TEST\src\renderer\apiC\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axiosInstance from './requestC';

//创建连接
// 参数 instrumentName String 自定义仪表连接名
// 参数 visaAddress String 仪表地址
export const CreateInstrumentConnect = (params: {
  visaAddress: string;
  instrumentName: string;
  httpTimeout?: number;
}) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const res = await axiosInstance.post('/CreateInstrumentConnect', params);
      console.log(res);
      if (res.data.error === 0) {
        resolve();
      } else {
        const errorMessage = res.data.errorMessage;
        if (
          errorMessage.includes('VI_ERROR_INV_PROT') &&
          errorMessage.includes('Invalid protocol specified')
        ) {
          reject(new Error('仪表已连接锁定\n' + res.data.errorMessage));
        } else {
          reject(new Error(res.data.errorMessage));
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
//关闭仪表连接
export const DisposeConnect = async (params: {
  instrumentName: string;
  httpTimeout?: number;
  timeout?: number;
}) => {
  try {
    const res = await axiosInstance.post('/DisposeConnect', params);
    if (res.data.error !== 0) {
      throw new Error(res.data.errorMessage);
    }
  } catch (error) {
    throw error;
  }
};
//关闭所有仪表连接
export const DisposeConnectAll = async () => {
  try {
    const res = await axiosInstance.get('/DisposeConnectAll');
    if (res.data.error !== 0) {
      throw new Error(res.data.errorMessage);
    }
  } catch (error) {
    throw error;
  }
};
//向设备写入指令
export const WriteCommand = async (params: {
  instrumentName: string;
  command: string;
  httpTimeout?: number;
  timeout?: number;
}) => {
  try {
    const res = await axiosInstance.post('/WriteCommand', params);
    if (res.data.error !== 0) {
      throw new Error(res.data.errorMessage);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * @description //查询命令 query
 * @param {Object} params .
 * @param {string} params.instr_name - 连接名称
 * @param {string} params.command - 查询指令.
 */
export const QueryCommand = async (params: {
  instrumentName: string;
  command: string;
  httpTimeout?: number;
  timeout?: number;
}) => {
  try {
    const res = await axiosInstance.post('/QueryCommand', params);
    console.log(res);
    if (res.data.error === 0) {
      return res.data.data;
    } else {
      throw new Error(res.data.errorMessage);
    }
  } catch (error) {
    throw error;
  }
};
/**
 * @description 获取设备截图 DisplayCapture
 * @param {Object} params .
 * @param {string} params.instrumentName - 连接名称
 * @param {string} params.imgPath - 截图png文件保存到本地的完整路径,路径分隔用“/”如 D:/abc/123.png.
 * @param {string} params.httpTimeout - http超时
 * @param {string} params.timeout - visa超时
 *
 */
export const DisplayCapture = async (params: {
  instrumentName: string;
  imgPath: string;
  httpTimeout?: number;
  timeout?: number;
}) => {
  try {
    const res = await axiosInstance.post('/DisplayCapture', params);
    if (res.data.error !== 0) {
      throw new Error(res.data.errorMessage);
    }
  } catch (error) {
    throw error;
  }
};

//判断webApp是否正常启动
export const GetStatus = async () => {
  try {
    const res = await axiosInstance.get('/GetStatus');
    if (res.data.error === 0) {
      return true;
    } else {
      console.error(res.data.errorMessage);
      return false;
    }
  } catch (error: any) {
    console.error(error.message);
    return false;
  }
};

//判断webApp是否正常启动
export const GetConnectList = async () => {
  try {
    const res = await axiosInstance.get('/GetConnectList');
    if (res.data.error === 0) {
      return res.data.data;
    } else {
      throw new Error(res.data.errorMessage);
    }
  } catch (error) {
    throw error;
  }
};
