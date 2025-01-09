import type { Key } from 'react';
import { BandItemInfo } from '@src/customTypes/renderer';
import type { FormInstance } from 'antd';
export const RBConfigValidator = async (
  _rule: any,
  RBConfigSelected: Key[],
) => {
  try {
    console.log(RBConfigSelected);
    if (RBConfigSelected?.length) {
      return Promise.resolve();
    } else {
      return Promise.reject(`请勾选RB配置`);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export function BandValidator({
  getFieldValue,
}: {
  getFieldValue: FormInstance['getFieldInstance'];
}) {
  return {
    validator: async function (_: any, selectBand: BandItemInfo[]) {
      try {
        if (selectBand?.length) {
          const networkMode = getFieldValue('networkMode');
          const showLTE = networkMode === 'NSA';
          //NSA
          const tempList = Object.entries(selectBand);
          for (let [index, BandObj] of tempList) {
            const { Band, SCS, BW, ARFCN, LTE_Band } = BandObj;
            if (!Band?.length) {
              return Promise.reject(`第${Number(index) + 1}列:未设置NR_Band`);
            }
            if (showLTE) {
              //NSA
              if (!LTE_Band?.length) {
                return Promise.reject(
                  `第${Number(index) + 1}列:未设置LTE_Band`,
                );
              }
            }
            if (!SCS?.length) {
              return Promise.reject(`第${Number(index) + 1}列:未设置SCS`);
            }
            if (!BW?.length) {
              return Promise.reject(`第${Number(index) + 1}列:未设置BW`);
            }
            if (!ARFCN?.length) {
              return Promise.reject(`第${Number(index) + 1}列:未设置ARFCN`);
            }
          }
          return Promise.resolve();
        } else {
          return Promise.reject('请添加NR_Band');
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
  };
}
