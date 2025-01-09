/*
 * @Author: feifei
 * @Date: 2023-07-11 15:42:24
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 10:50:18
 * @FilePath: \pxa_signal_analyzer\src\renderer1\utils\modalConfirm.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
export default (title: string | null, content: string) => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      confirm({
        title,
        icon: <ExclamationCircleFilled />,
        content,
        okText: 'OK',
        cancelText: 'Cancel',
        centered: true,
        onOk() {
          resolve(true);
        },
        onCancel() {
          resolve(false);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};
