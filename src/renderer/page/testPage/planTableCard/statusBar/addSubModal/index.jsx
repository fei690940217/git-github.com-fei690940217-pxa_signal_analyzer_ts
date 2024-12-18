/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-13 09:20:25
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\planTableCard\statusBar\addSubModal\index.jsx
 * @Description: 项目列表主表格
 */

import { Button, Table, message, Modal, Input, Form } from "antd";
import React, { useState, useEffect, useMemo, lazy } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentTestRecordName } from "@/store/modules/testStatus";
import addLog from "@/store/asyncThunk/addLog";

const { ipcRenderer } = window.myApi;
export default ({ modalVisible, closeModal }) => {
  const dispatch = useDispatch();
  const [addProjectForm] = Form.useForm();
  const [messageApi, messageContextHolder] = message.useMessage();
  const currentRow = useSelector((state) => state.projectList.currentRow);
  //表单验证
  const formVerify = () => {
    return new Promise(async (resolve, reject) => {
      try {
        //验证且获取表单数据
        const values = await addProjectForm.validateFields();
        resolve(values);
      } catch (error) {
        reject(new Error("请检查输入框"));
      }
    });
  };
  //新建子项目
  const addSubProject = async () => {
    try {
      const { subProjectName } = await formVerify();
      //通知主进程创建子文件夹  拿结果创建文件夹
      await ipcRenderer.invoke("addSubProject", {
        projectName: currentRow.projectName,
        subProjectName,
      });
      //更新currentRow,projectList
      dispatch(setCurrentTestRecordName(subProjectName));
      //添加log
      const log = `success_-_项目${currentRow.projectName}/${subProjectName}创建成功`;
      dispatch(addLog(log));
      message.success("子项目创建成功");
      closeModal();
    } catch (error) {
      if (error !== "取消") {
        messageApi.error(error.message);
      }
    }
  };

  return (
    <Modal
      width={400}
      title={`新建 ${currentRow.projectName} 子项目`}
      open={modalVisible}
      onCancel={closeModal}
      onOk={addSubProject}
      okText="确定新建"
      centered={true}
    >
      <div style={{ padding: "10px 0" }}>
        {messageContextHolder}
        <Form
          form={addProjectForm}
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item
            name="subProjectName"
            rules={[
              { required: true, message: "不能为空!" },
              {
                pattern: /^[^/\\\\:\\*\\?\\<\\>\\|\"]{1,255}$/,
                message: `不能包含特殊字符  ?/|*:<> `,
              },
            ]}
          >
            <Input placeholder="请输入子项目名称" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
