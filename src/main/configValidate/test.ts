import path from 'path';
import XLSX from 'xlsx';
import { appConfigFilePath } from '../publicData';

const configFilePath = path.join(appConfigFilePath, 'user/rbConfig/CSE.xlsx');
//处理合并单元格函数
const mergeCellDataFill = (merges: any, result: any) => {
  try {
    console.log(merges);
    // 使用合并单元格信息处理合并区域
    merges.forEach((merge) => {
      const startRow = merge.s.r;
      const startCol = merge.s.c;
      const endRow = merge.e.r;
      const endCol = merge.e.c;
      console.log('开始行', startRow, '开始列', startCol);
      console.log('结束行', endRow, '结束列', endCol);

      // 获取合并区域的所有坐标
      const cellsToFill = [];
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (r !== startRow || c !== startCol) {
            cellsToFill.push([r, c]);
          }
        }
      }
      // 对每个合并单元格区域做处理，比如将合并区域中的值填充到所有单元格
      // 填充合并区域的所有单元格
      cellsToFill.forEach(([r, c]) => {
        result[r][c] = result[startRow][startCol];
      });
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};
export default async () => {
  try {
    const wb = XLSX.readFile(configFilePath);
    console.log(wb);
    //判断文件是否存在
    // const merges = ws['!merges']
    const { Sheets, SheetNames } = wb;
    const sheet = Sheets[SheetNames[0]];
    const merges = sheet['!merges'];
    const json = XLSX.utils.sheet_to_json<any>(sheet, {
      range: 0,
      header: 1,
      defval: '',
      raw: false, // 禁用原始文本模式
      // blankrows: false, // 不忽略空行
    });
    const newJson = mergeCellDataFill(merges, json, 1);
    console.log('json 原始数据', newJson);
  } catch (error) {
    const msg = `ces limit 配置文件验证失败,请检查 ${error}`;
    console.error(msg);
    console.error(error);
  }
};
