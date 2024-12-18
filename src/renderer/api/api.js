/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-15 09:50:18
 * @LastEditors: feifei
 * @LastEditTime: 2023-08-15 10:27:38
 * @FilePath: \fcc_5g_test_system\src\api\api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axiosInstance from "./index";
//获取本机是否有授权
export const check_auth = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axiosInstance.post("/check_auth", {});
      if (res.data.error === 0) {
        resolve();
      } else {
        resolve(res.data.errmsg);
      }
    } catch (error) {
      reject(error);
    }
  });
};
//创建连接
// 参数 instr_name String 自定义仪表连接名
// 参数 mode String 控制方式: ip | gpib
// 参数 ip String (可选, mode == ip 必须) 仪表IP地址 如 192.168.8.6
// 参数 gpib String|Int (可选, mode == gpib 必须) 仪表GPIB地址  如 18
// 参数 driver String (可选) visa驱动名称, visa 或 @py 或其它支持的名称, 默认visa
// 参数 inst String (可选) 端口名, 默认 inst0 或 hislip0 自动处理，可指定其它已知名称
export const create_instr_fn = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axiosInstance.post("/create_instr", params);
      if (res.data.error === 0) {
        resolve();
      } else {
        reject(res.data.errmsg);
      }
    } catch (error) {
      reject(error);
    }
  });
};
//获取连接列表
export const get_instr_list = () => {
  return axiosInstance.post("/get_instr", {});
};
//删除仪表连接
export const delete_instr = (instr_name) => {
  const params = {
    instr_name,
  };
  return axiosInstance.post("/delete_instr", params);
};

//向设备写入指令
export const write_fn = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axiosInstance.post("/write", params);
      if (res.data.error === 0) {
        resolve();
      } else {
        reject(res.data.errmsg);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * @description //查询命令 query
 * @param {Object} params .
 * @param {string} params.instr_name - 连接名称
 * @param {string} params.command - 查询指令.
 */
export const query_fn = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axiosInstance.post("/query", params);
      if (res.data.error === 0) {
        resolve(res.data.rst);
      } else {
        reject(res.data.errmsg);
      }
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * @description 获取设备截图 query_screen_capture
 * @param {Object} params .
 * @param {string} params.instr_name - 连接名称
 * @param {string} params.img_path - 截图png文件保存到本地的完整路径,路径分隔用“/”如 D:/abc/123.png.
 */
export const get_screen_capture = (params) => {
  let obj = {
    instr_name: params.instr_name,
    img_path: params.img_path,
  };
  return axiosInstance.post("/query_screen_capture", obj);
};

/**
 * @description 设置设备超时 /set_timeout
 * @param {Object} params .
 * @param {string} params.instr_name - 连接名称
 * @param {string} params.timeout - StringlInt 超时时间，单位毫秒
 */
export const set_timeout = (params, config = {}) => {
  return axiosInstance.post("/set_timeout", params, config);
};

/**
 * @description 获取线上的软件版本号 /get_soft_version
 * @description 当前启动的软件内部先定义版本 ver_local(版本)，appname(软件英文名)，appname_ch(软件中文名)
 * @param {Object} params .
 * @param {string} params.appname - 软件的英文名(软件内部配置，全公司唯一，无空格) 如 morlab_fcc_test_soft
 * @return {Object} {error:0, ver_online:“5.8”}} 拿到ver_online与ver_local对比,如软件版本不相同，
 * @description  POST http://192.168.0.8:9000/normal/soft_update
 * @description 下载新版软件exePOST参数 [file:"appname_ch + ver_online + exe"了如 file:"MORLAB FCC测试软件5.8.exe"}
 */
export const get_soft_version = async (appname) => {
  try {
    let obj = {
      appname: appname,
    };
    let res = await axiosInstance.post("/get_soft_version", obj);
    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject(error)
  }

};
