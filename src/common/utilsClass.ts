/*
 * @Author: feifei
 * @Date: 2024-01-25 17:27:48
 * @LastEditors: feifei
 * @LastEditTime: 2024-01-30 15:51:55
 * @FilePath: \5G_TELEC_TEST\src\common\utilsClass.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
export class RandomStringGenerator {
  private characterSet: string;
  constructor(
    characterSet: string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz',
  ) {
    this.characterSet = characterSet;
  }
  generateRandomString(length: number = 32): string {
    let result = '';
    const characterSetLength = this.characterSet.length;
    for (let i = 0; i < length; i++) {
      result += this.characterSet.charAt(
        Math.floor(Math.random() * characterSetLength),
      );
    }
    return result;
  }
}
