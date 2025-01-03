/*
 * @Author: feifei
 * @Date: 2023-07-11 15:42:24
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 14:32:50
 * @FilePath: \pxa_signal_analyzer\src\renderer\utils\modalConfirm.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

export default (title: string | null, content: string) => {
  return new Promise<void>((resolve, reject) => {
    Modal.confirm({
      title,
      icon: <ExclamationCircleFilled />,
      content,
      okText: 'OK',
      cancelText: 'Cancel',
      centered: true,
      onOk() {
        resolve();
      },
      onCancel() {
        reject('取消');
      },
    });
  });
};
