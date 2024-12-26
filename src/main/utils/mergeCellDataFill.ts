import { logError } from '@src/main/logger/logLevel';
import XLSX from 'xlsx';
import { type Range } from 'xlsx';

export default (merges: Range[] | undefined, result: any[][]) => {
  try {
    if (!merges) {
      return result;
    }
    // 使用合并单元格信息处理合并区域
    merges.forEach((merge) => {
      const startRow = merge.s.r;
      const startCol = merge.s.c;
      const endRow = merge.e.r;
      const endCol = merge.e.c;

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
    logError(error?.toString() + 'mergeCellDataFill 33');
    return result;
  }
};
