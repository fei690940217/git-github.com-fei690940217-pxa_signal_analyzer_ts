# 0.1.0 (2023.10.15)

## Features

### Config

- **Webpack:** 添加webpack.config.testProcess.dev.ts
- **Webpack:** 添加webpack.configtestProcess.prod.ts

### Mian

- **preload.ts:** electronStore重写
- **configValidate:** 配置文件重写
-

### Renderer

- **addPage:** 新建项目重构
- **setPage:** 删除频谱功能,添加MT8000相关配置

### TestProcess

- **Index.ts:** UXM功率测试拆分

# 0.2.0 (2023.10.19)

## Features

### Config

- **Webpack:** 添加webpack.config.testProcess.dev.ts
- **Webpack:** 添加webpack.configtestProcess.prod.ts

### Mian

- **preload.ts:** electronStore重写
- **configValidate:** 配置文件重写
-

### Renderer

- **addPage:** 新建项目重构
- **setPage:** 删除频谱功能,添加MT8000相关配置

### TestProcess

- **Index.ts:** UXM功率测试拆分

# 0.3.0 (2023.10.27)

## Features

- UXM基站相关功能开发完成

# 0.4.0 (2023.11.4)

## Features

### Mian

- **preload.ts:** electronStore重写
- **configValidate:** 配置文件重写
-

### Renderer

- **TestPage:** 合并数据表格
- **LogPage:** 性能优化,解决前端界面卡顿bug

### TestProcess

- **Index.ts:** MT8000功率测试开始开发

# 0.5.0 (2023.11.8)

## Features

- **MT8000:** 开始完成
-

# 0.5.1 (2023.11.8 13:13)

## Features

- **MT8000:** 功率异常判定函数整改

# 0.6.0 (2023.11.13 09:57)

## Features

### 架构重整

- 测试条目生成逻辑重整,有原来的两层改为三层,添加的一层以band为key,数据结构修改对应的所有结构全部整改
- 非兼容性升级,需重建项目,原项目不可复用
