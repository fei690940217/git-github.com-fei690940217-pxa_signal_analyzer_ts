/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\formModule\util\RBTableObj.js
 * @Author: xxx
 * @Date: 2023-04-03 15:00:16
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-11 15:32:27
 * @Descripttion:  form表单不同字段数据
 */


//通用的
const modulateList = [
  { OFDM: "DFT", modulate: "BPSK" },
  { OFDM: "DFT", modulate: "QPSK" },
  { OFDM: "DFT", modulate: "16QAM" },
  { OFDM: "DFT", modulate: "64QAM" },
  { OFDM: "DFT", modulate: "256QAM" },
  { OFDM: "CP", modulate: "QPSK" },
  { OFDM: "CP", modulate: "16QAM" },
  { OFDM: "CP", modulate: "64QAM" },
  { OFDM: "CP", modulate: "256QAM" },
];
//bandEdgeIc专用
const Band_Edge_Ic_Rb_Name_List = [
  "Outer_Full_Left",
  "Outer_Full_Right",
  "Edge_1RB_Left",
  "Edge_1RB_Right",
];
//bandEdge 分为两组
const Band_Edge_Rb_Name_List_Low = ["Outer_Full", "Edge_1RB_Left"];
const Band_Edge_Rb_Name_List_High = ["Outer_Full", "Edge_1RB_Right"];
//PAR
const PAR_Rb_Name_List = [
  "Outer_Full",
  "Inner_1RB_Left",
  "Inner_1RB_Right",
];
//OBW
const OBW_Rb_Name_List = ["Outer_Full"]
//CSE
const CSE_Rb_Name_List = [
  "Outer_Full",
  "Inner_1RB_Left",
  "Inner_1RB_Right",
];

const BandEdgeFn = () => {
  const lowResult = modulateList.flatMap((modulateItem) => {
    return Band_Edge_Rb_Name_List_Low.map((RB) => {
      return { ...modulateItem, RB, level: "L" };
    });
  });
  const highResult = modulateList.flatMap((modulateItem) => {
    return Band_Edge_Rb_Name_List_High.map((RB) => {
      return { ...modulateItem, RB, level: "H" };
    });
  });
  const result = [...lowResult, ...highResult];
  const tempResult = result.map((item, index) => {
    item.id = index + 1;
    return item;
  });
  return tempResult;
};
const handleFn = (Rb_Name_List) => {
  const tempList = modulateList.flatMap((modulation) => {
    const { OFDM, modulate } = modulation;
    return Rb_Name_List.map((RB) => {
      return {
        OFDM,
        modulate,
        RB,
      };
    });
  });
  //创建id
  return tempList.map((item, index) => {
    item.id = index + 1;
    return item;
  });
}
export const BandEdgeRBNameList = BandEdgeFn();
const BandEdge = BandEdgeFn()
const BandEdgeIC = handleFn(Band_Edge_Ic_Rb_Name_List)
const PAR = handleFn(PAR_Rb_Name_List)
const OBW = handleFn(OBW_Rb_Name_List)
const CSE = handleFn(CSE_Rb_Name_List)



export default {
  BandEdge,
  BandEdgeIC,
  PAR,
  OBW,
  CSE,
};


