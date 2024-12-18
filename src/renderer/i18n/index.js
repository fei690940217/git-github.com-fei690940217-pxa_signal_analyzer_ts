/*
 * @Author: feifei
 * @Date: 2023-09-04 14:25:14
 * @LastEditors: feifei
 * @LastEditTime: 2023-09-11 13:05:51
 * @FilePath: \fcc_5g_test_system\src\i18n\index.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 初始化i18n
i18n.use(initReactI18next).init({
  resources: {
    // 添加支持的语言和对应的翻译文件
    zh: {
      //全局公用
      home: {
        testPage: "测试页",
        addProject: "新建项目",
        set: "设置",
        command: "指令",
      },
      //测试页面
      testPage: {
        projectList: "项目列表",
        projectName: "项目名称",
        createDate: "创建时间",
        testName: "测试名称",
        testRecord: "测试记录",
        openFolder: "打开文件夹",
        generateReport: "生成报告",
        archive: "归档",
        archiveTooltip: "确认归档",
        operationProjectTooltip: "请选择一个项目",
        currentProject: "当前项目",
        spectrum: "频谱",
        skipTested: "跳过已测",
        testStart: "开始",
        notStartedTooltip: "开始测试",
        underTesting: "测试中",
        underTestingTooltip: "暂停",
        paused: "暂停中",
        pausedTooltip: "继续",
        separateTestSpectrum: "单独测试频谱",
        confirmEndOfTest: "确认结束测试?",
        testInProgressTooltip: "测试正在进行中,请勿重复点击",
        addSubTestItemTooltip: "确定新建子测试项",
        skipTestedTooltip: "确认跳过已测",
        startTestTooltip: "确认开始测试",
      },
      //设置页
      setPage: {
        message: "This is Page 2.",
        baseStation: "基站",
        spectrum: "频谱",
        lineLoss: "线损",
        frequency: "频率",
        saveSettings: "保存设置",
        uploadLineLossTable: "上传线损表",
        output: "输出",
        input: "输入",
        connect: "连接",
        authorize: "授权",
        networkStatus: "网络状态",
        re: "重新",
        run: "运行",
        formatError: "格式错误",
        insert: "添加一条数据",
        status: "状态",
        runFailTooltip: "启动失败,请重试",
        networkTooltip: "请确保网络可用",
        switch: "切换功能",
        open: "开启",
        close: "不开启",
      },
      //新建
      addPage: {
        message: "This is Page 2.",
        refreshConfig: "刷新配置",
        noNeedToChoose: "无需选择RB配置",
        projectName: "项目名称",
        testMode: "测试类型",
        normalTest: "常规测试",
        testItem: "测试用例",
        networkMode: "组网模式",
        createProject: "创建项目",
        projectNameRuleTooltip: "不能包含",
        verifyFormTooltip: "请检查表单填写是否完整",
        onlyOne: "只能选择一个",
        inspectRBConfig: "请检查RB配置是否勾选",
        projectAlreadyExists: "项目已存在",
        confirmNewProject: "确认新建项目",
        confirmModifyingProject: "确认修改项目",
        modifyOldProjectTooltip: "如果是新建项目请修改项目名称后重试",
      },
    },
    en: {
      //全局公用
      home: {
        testPage: "Test Page",
        addProject: "New Project",
        set: "Setting",
        command: "Command",
      },
      testPage: {
        projectList: "Project List",
        projectName: "Project Name",
        createDate: "Create Date",
        testName: "Test Name",
        testRecord: "Test Record",
        openFolder: "open a Folder",
        generateReport: "Generate Report",
        archive: "Archive",
        archiveTooltip: "Are you sure to archive",
        operationProjectTooltip: "Please select a project",
        currentProject: "Current Project",
        spectrum: "Spectrum",
        skipTested: "Skip Tested",
        testStart: "Start",
        notStartedTooltip: "Start",
        underTesting: "Under Testing",
        underTestingTooltip: "Paused",
        paused: "Paused",
        pausedTooltip: "Go on",
        separateTestSpectrum: "Separate Test Spectrum",
        confirmEndOfTest: "Confirm End of Test ?",
        testInProgressTooltip:
          "Testing is in progress, please do not click repeatedly",
        addSubTestItemTooltip: "Confirm the creation of new sub test items",
        skipTestedTooltip: "Confirm skipping tested",
        startTestTooltip: "Confirm to start testing",
      },
      //设置页
      setPage: {
        message: "This is Page 2.",
        baseStation: "Base Station",
        spectrum: "Spectrum",
        lineLoss: "lineLoss",
        frequency: "Frequency",
        saveSettings: "Save Settings",
        uploadLineLossTable: "Upload LineLoss Table",
        output: "Output",
        input: "Input",
        connect: "Connect",
        authorize: "Authorize",
        networkStatus: "Network Status",
        re: "Re",
        run: "run",
        formatError: "Format Error",
        insert: "INSERT",
        status: "Status",
        runFailTooltip: "Startup failed, please try again",
        networkTooltip: "Please ensure network availability",
        switch: "Switch",
        open: "Open",
        close: "Close",
      },
      //新建
      addPage: {
        message: "This is Page 2.",
        refreshConfig: "Refresh Config",
        noNeedToChoose: "No need to choose RB Config",
        projectName: "Project Name",
        projectNameRuleTooltip: "Cannot contain",
        testMode: "Test Mode",
        normalTest: "Normal Test",
        testItem: "Test Item",
        networkMode: "Network Mode",
        createProject: "Create Project",
        verifyFormTooltip: "Please check the form",
        onlyOne: "Only one can be selected",
        inspectRBConfig: "Please check if RB configuration is checked",
        projectAlreadyExists: "Project already exists",
        confirmNewProject: "Confirm New Project",
        confirmModifyingProject: "Confirm modifying the project",
        modifyOldProjectTooltip:
          "If it is a new project, please modify the project name and try again",
      },
    },
  },
  lng: "zh", // 设置默认语言
  fallbackLng: "zh", // 如果未找到对应语言，使用默认语言
  interpolation: {
    escapeValue: false, // 不要转义字符串
  },
});

export default i18n;
