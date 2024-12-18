import { Button, Popconfirm, InputNumber, Tooltip, message, Card } from "antd";
import React, { useState, useEffect } from "react";
import "./index.scss";
import {
  DeleteOutlined,
  PlusOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";

const { electronStore, ipcRenderer } = window.myApi;
const TableRow = ({ item, valueChange, handleDelete }) => {
  const { id } = item;
  const list = () => {
    if (item) {
      let tempList = Object.entries(item);
      return tempList.filter((arr) => {
        return arr[0] !== "id";
      });
    } else {
      return [];
    }
  };

  return (
    <tr>
      {list().map((arr, index) => {
        return (
          <td key={id + index}>
            <InputNumber
              controls={false}
              variant="borderless"
              style={{
                width: "100%",
              }}
              value={arr[1]}
              onChange={(value) => valueChange(value, arr[0], id)}
            />
          </td>
        );
      })}
      <td style={{ textAlign: "center" }}>
        <Popconfirm
          title="确定删除本条数据?"
          onConfirm={() => handleDelete(id)}
        >
          <DeleteOutlined style={{ color: "#F56C6C" }} />
        </Popconfirm>
      </td>
    </tr>
  );
};
const App = () => {
  const { t, i18n } = useTranslation("setPage");

  const [messageApi, messageContextHolder] = message.useMessage();
  const [tableList, setTableList] = useState([]);
  useEffect(() => {
    let tempList = electronStore.get("spectrumLineLoss");
    if (tempList?.length) {
      setTableList(tempList);
    } else {
      setTableList([
        {
          id: uuidv4(),
          frequency: ``,
          lineLoss: "",
        },
      ]);
    }
  }, []);
  const handleDelete = (id) => {
    const newData = tableList.filter((item) => item.id !== id);
    setTableList(newData);
    electronStore.set("spectrumLineLoss", newData);
  };
  const valueChange = (value, key, id) => {
    let tempList = cloneDeep(tableList);
    tempList.forEach((obj) => {
      if (obj.id === id) {
        obj[key] = value;
      }
    });
    setTableList(tempList);
    electronStore.set("spectrumLineLoss", tempList);
  };
  //添加条目
  const handleAdd = () => {
    const newData = {
      id: uuidv4(),
      frequency: ``,
      lineLoss: "",
    };
    let tempList = [...tableList, newData];
    setTableList(tempList);
    electronStore.set("spectrumLineLoss", tempList);
  };
  //上传线损表
  const uploadLineLoss = async () => {
    let rst = await ipcRenderer.invoke("showOpenDialog");
    const { type, value, msg } = rst;
    if (type === "success") {
      if (value?.length) {
        //找到基站线损表
        const findItem = value.find((item) => {
          return item.name === "频谱线损";
        });
        const { data } = findItem;
        const filterData = data.filter((item, index) => {
          return index > 0;
        });
        const reg = /^(\-|\+)?\d+(\.\d+)?$/;
        const flag = filterData.every((sup) => {
          return sup.every((sub) => {
            return reg.test(sub);
          });
        });
        if (flag) {
          const result = filterData.map(([frequency, lineLoss]) => {
            return {
              id: uuidv4(),
              frequency: parseFloat(frequency.toFixed(2)),
              lineLoss: parseFloat(lineLoss.toFixed(2)),
            };
          });
          setTableList(result);
          electronStore.set("spectrumLineLoss", result);
        } else {
          messageApi.warning(t("formatError"));
        }
      } else {
        messageApi.warning("No Data");
      }
    } else if (type === "error") {
      messageApi.error(msg);
    }
  };
  return (
    <Card
      className="spectrum-config-wrapper"
      styles={{
        header: {
          minHeight: 36,
          lineHeight: "36px",
        },
      }}
      title="频谱线损"
      extra={
        <Button
          size="small"
          type="link"
          icon={<CloudUploadOutlined />}
          onClick={uploadLineLoss}
        >
          {/* 上传线损表 */}
          {t("uploadLineLossTable")}
        </Button>
      }
    >
      <div className="spectrum-line-loss-wrapper">
        {messageContextHolder}
        <table border={1} style={{ width: "100%" }} className="line-loss-table">
          <thead>
            <tr>
              <th>{`${t("frequency")} (MHz)`}</th>
              <th>{`${t("lineLoss")} (dB)`}</th>
              <th style={{ width: 60, textAlign: "center" }}>del</th>
            </tr>
          </thead>
          <tbody>
            {tableList.map((item) => {
              return (
                <TableRow
                  item={item}
                  key={item.id}
                  handleDelete={handleDelete}
                  valueChange={valueChange}
                ></TableRow>
              );
            })}
          </tbody>
        </table>
        <div>
          <Tooltip title={t("insert")}>
            <Button
              onClick={handleAdd}
              type="link"
              icon={<PlusOutlined />}
            ></Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};
export default App;
