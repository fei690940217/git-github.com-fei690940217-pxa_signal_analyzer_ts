/*
 * @Author: feifei
 * @Date: 2023-07-11 15:42:24
 * @LastEditors: feifei
 * @LastEditTime: 2023-09-04 17:36:19
 * @FilePath: \fcc_5g_test_system\src\utils\modalConfirm.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

export default (title, content) => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title,
      icon: <ExclamationCircleFilled />,
      content,
      okText: "OK",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        resolve();
      },
      onCancel() {
        reject("取消");
      },
    });
  });
};
