/*
 * @Author: feifei
 * @Date: 2023-06-20 14:55:19
 * @LastEditors: feifei
 * @LastEditTime: 2024-01-22 16:55:00
 * @FilePath: \fcc_5g_test_system\main\utils\generateDocx\otherHandle\resultTable.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const { cloneDeep } = require("lodash");
const { verdictHandle } = require("../../../utils");
const { bandGenerate } = require("../functionList/index");
module.exports = (list) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bodyRows = list.map((record) => {
        const {
          testItem,
          ARFCN,
          modulate: oldModulate,
          OFDM,
          RBStart,
          RBNum,
          SCS,
          BW,
          result,
          CSE_Limit,
        } = record;
        const newBand = bandGenerate(record);
        const ofdm = OFDM === "DFT" ? "DFT-s-OFDM" : "CP-OFDM";
        const modulate = oldModulate === "BPSK" ? `PI/2 BPSK` : oldModulate;
        const RB = `${RBNum}/${RBStart}`;
        const verdict = verdictHandle(record) ? "PASS" : "FAIL";
        if (testItem === "PAR") {
          return {
            Band: newBand,
            SCS,
            BW,
            ARFCN,
            modulate,
            ofdm,
            RB,
            result,
            limit: 13,
            verdict,
          };
        } else if (testItem === "CSE") {
          const [_, rst] = result.split(",");
          return {
            Band: newBand,
            SCS,
            BW,
            ARFCN,
            modulate,
            ofdm,
            RB,
            result: rst,
            limit: CSE_Limit,
            verdict,
          };
        } else if (testItem === "BandEdge" || testItem === "BandEdgeIC") {
          return { Band: newBand, SCS, BW, ARFCN, modulate, ofdm, RB, verdict };
        }
      });
      resolve(bodyRows);
    } catch (error) {
      reject(error);
    }
  });
};
