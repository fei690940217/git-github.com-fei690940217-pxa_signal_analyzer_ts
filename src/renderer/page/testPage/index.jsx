/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-05 15:01:54
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\index.jsx
 * @Description: 测试与列表主页
 */
import "./index.scss";
import PlanTableCard from "./planTableCard";
import ProjectList from "./projectListPage";
import LogCard from "./logCard";
import { useSelector, useDispatch } from "react-redux";
import { SmileOutlined } from "@ant-design/icons";
import { Result } from "antd";

export default () => {
  const currentRow = useSelector((state) => state.projectList.currentRow);
  return (
    <div className="test-plan-wrapper">
      <div className="test-plan-content">
        <div className="content-left">
          <ProjectList />
        </div>
        <div className="content-right">
          {currentRow?.id ? (
            <PlanTableCard />
          ) : (
            <Result
              style={{ height: "100%" }}
              icon={<SmileOutlined style={{ color: "#DCDFE6" }} />}
              subTitle="请勾选测试项目后继续"
            />
          )}
        </div>
      </div>
      <div className="test-plan-footer">
        <LogCard />
      </div>
    </div>
  );
};
