/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 11:28:23
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 10:30:08
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\electron.js
 * @Description: 主进程入口文件
 */

const { app, BrowserWindow, Menu, screen, nativeImage } = require("electron");
//运行环境
const isDev = require("electron-is-dev");
const path = require("path");
const iconPath = isDev
  ? path.join(__dirname, "..", "public/static/icon.ico")
  : path.join(__dirname, "static/icon.ico");
const logoImage = nativeImage.createFromPath(iconPath);
const appEventHandle = require("./appEventHandle");
const { createWindow, getWindow } = require('./windowManager')
const logger = require("./logger");
const { logError } = require("./logger/logLevel");

//添加环境变量
if (isDev) {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }
}
/* 热加载 */
try {
  require("electron-reloader")(module);
} catch { }
//创建窗口函数
const createWindowFn = () => {
  createWindow(logoImage)
  const win = getWindow();
  //zui
  const localFile = path.join(__dirname, "index.html");
  win.loadURL(isDev ? "http://localhost:3000" : localFile);
  win.show();
  // win.minimize();
  appEventHandle(win);
};

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("ready", async (event) => {
    logger.info("app ready");
    // null值取消顶部菜单栏
    Menu.setApplicationMenu(null);
    //创建窗口
    logger.info("准备创建窗口");
    createWindowFn();
  });
  // app.whenReady().then(() => {
  //   // null值取消顶部菜单栏
  //   Menu.setApplicationMenu(null);
  //   //创建窗口
  //   createWindow();
  // });
}
process.on("uncaughtException", (err) => {
  const msg = `main process uncaughtException: ${err.stack || err}`
  logError(msg)
});

