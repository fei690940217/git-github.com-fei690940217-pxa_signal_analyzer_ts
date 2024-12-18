/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 15:06:28
 * @Descripttion:  新建项目
 */

import { Form } from "antd";
import { useState, useEffect } from "react";
import "./index.scss";
//设置预设名称
import FormModule from "./formModule";
import RBPlanTable from "./RBPlanTable";
import localforage from "localforage";
import { useSelector } from "react-redux";
const AddPage = () => {
  const [addProjectForm] = Form.useForm();
  const currentRow = useSelector((state) => state.projectList.currentRow);
  //表单数据
  const [addFormValues, setAddFormValues] = useState({});
  //选中的band列表
  const [selectBand, setSelectBand] = useState([]);
  //选中的RB配置id列表
  const [RBSelectedRowKeys, setRBSelectedRowKeys] = useState([]);

  //进入页面,根据currentRow重置数据
  const initFn = async () => {
    //说明是首页点击复用按钮进入的此页面
    if (currentRow?.id) {
      const { formValue, RBSelectedRowKeys } = currentRow;
      const { Band } = formValue;
      setSelectBand(Band);
      //初始化表单数据
      addProjectForm.setFieldsValue(formValue);
      //设置addFormValues
      setAddFormValues(formValue);
      if (Array.isArray(RBSelectedRowKeys)) {
        setRBSelectedRowKeys(RBSelectedRowKeys);
      } else {
        setRBSelectedRowKeys([]);
      }
    }
    //其他情况
    else {
      const tempAddFormValues = await localforage.getItem("addFormValues");
      if (tempAddFormValues) {
        setAddFormValues(tempAddFormValues);
        addProjectForm.setFieldsValue(tempAddFormValues);
        const { Band } = tempAddFormValues;
        if (Band?.length) {
          setSelectBand(Band);
        }
      }
    }
  };
  const setAddFormValuesFn = (obj) => {
    setAddFormValues(obj);
    localforage.setItem("addFormValues", obj);
  };
  //从后端获取RBTableObj
  useEffect(() => {
    initFn();
  }, []);
  return (
    <div className="add-project-wrapper">
      <div className="add-project-content">
        {/* 新增表单 */}
        <FormModule
          addFormValues={addFormValues}
          setAddFormValuesFn={setAddFormValuesFn}
          addProjectForm={addProjectForm}
          selectBand={selectBand}
          setSelectBand={setSelectBand}
          RBSelectedRowKeys={RBSelectedRowKeys}
          setRBSelectedRowKeys={setRBSelectedRowKeys}
        />
        {/* 勾选RB配置 */}
        <RBPlanTable
          addFormValues={addFormValues}
          RBSelectedRowKeys={RBSelectedRowKeys}
          setRBSelectedRowKeys={setRBSelectedRowKeys}
        />
      </div>
    </div>
  );
};
export default AddPage;
