/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\logCard\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-03 17:49:25
 * @Descripttion:
 */
import { Card, Tabs } from "antd";
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./index.scss";
import LogList from "./logList";
import { debounce, throttle } from "lodash";

const App = () => {
  const [height, setHeight] = useState(180);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startY = e.clientY;

    const handleMouseMove = throttle((e) => {
      const diffY = startY - e.clientY;
      setHeight(height + diffY);
    }, 50);
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="log-and-result-card-wrapper" style={{ height: height }}>
      <div className="handle-wrapper">
        <div className="handle-content" onMouseDown={handleMouseDown}></div>
      </div>
      <Card className="log-card">
        <div className="log-content">
          <LogList></LogList>
        </div>
      </Card>
    </div>
  );
};
export default App;
