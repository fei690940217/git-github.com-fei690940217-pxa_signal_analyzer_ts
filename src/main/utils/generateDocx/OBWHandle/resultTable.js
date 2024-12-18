/*
 * @Author: feifei
 * @Date: 2023-06-20 14:55:19
 * @LastEditors: feifei
 * @LastEditTime: 2023-10-16 14:04:11
 * @FilePath: \fcc_5g_test_system\main\utils\generateDocx\OBWHandle\resultTable.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const { cloneDeep } = require("lodash");
const { verdictHandle } = require("../../../utils");
const { bandGenerate } = require('../functionList/index')
module.exports = (list) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bodyRows = list.map((record) => {
        const {
          ARFCN,
          modulate: oldModulate,
          OFDM,
          RBStart,
          RBNum,
          SCS,
          BW,
          result,
        } = record;
        const newBand = bandGenerate(record)
        const ofdm = OFDM === "DFT" ? "DFT-s-OFDM" : "CP-OFDM";
        const modulate = oldModulate === "BPSK" ? `PI/2 BPSK` : oldModulate;
        const RB = `${RBNum}/${RBStart}`;
        const verdict = verdictHandle(record) ? "PASS" : "FAIL";
        const [resultOBW, result26dB] = result.split(",");
        return {
          Band: newBand,
          SCS,
          BW,
          ARFCN,
          modulate,
          ofdm,
          RB,
          resultOBW,
          result26dB,
          limit: BW,
          verdict,
        };
      });
      resolve(bodyRows);
    } catch (error) {
      reject(error);
    }
  });
};
