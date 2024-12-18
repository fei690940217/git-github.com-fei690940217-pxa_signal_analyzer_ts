/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 15:51:43
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-03 08:41:35
 * @FilePath: \5G_TELEC_TEST\src\main\db\appDB.ts
 * @Description: 全局公用数据库
 *
 */

import path from 'path';
import { appConfigFilePath } from '@main/publicData';
import CreateDataBaseClass from './createDataBaseClass';
const filepath = path.join(appConfigFilePath, 'app/app.db');
export default new CreateDataBaseClass(filepath);
