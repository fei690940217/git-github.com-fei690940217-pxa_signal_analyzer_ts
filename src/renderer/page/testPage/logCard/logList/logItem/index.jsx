/*
 * @FilePath: \fcc_power_test\src\renderer\page\testPage\logCard\logItem\index.tsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2023-11-06 15:15:23
 * @Descripttion:
 */
import {
  BellOutlined,
  CheckCircleTwoTone,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import "./index.scss";

const ListItem = ({ data }) => {
  const { id, type, createDate, message } = data;
  const leftIcon = () => {
    if (type === "success") {
      return <CheckCircleTwoTone style={{ color: "#52c41a" }} />;
    } else if (type === "info") {
      return <BellOutlined style={{ color: "#ccc" }} />;
    } else if (type === "warning") {
      return <WarningOutlined style={{ color: "#FF9900" }} />;
    } else if (type === "error") {
      return <CloseCircleOutlined style={{ color: "#CC3333" }} />;
    } else {
      return "";
    }
  };
  return (
    <div className="list-item-wrapper">
      <div className="icon-wrapper">{leftIcon()}</div>
      <div className="create-date-wrapper">{createDate}</div>
      <div className="text-wrapper">
        <div className={`class-${type}`}>
          <div dangerouslySetInnerHTML={{ __html: message }}></div>
        </div>
      </div>
    </div>
  );
};
export default ListItem;
