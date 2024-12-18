const path = require('path');

const rootPath = path.join(__dirname, '../..');

const dllPath = path.join(__dirname, '../dll');

const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');
//测试进程的文件路径
const srcTestProcessPath = path.join(srcPath, 'testProcess');
const releasePath = path.join(rootPath, 'release');
const appPath = path.join(releasePath, 'app');
const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');
const srcNodeModulesPath = path.join(srcPath, 'node_modules');

const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'main');
const distRendererPath = path.join(distPath, 'renderer');
const distTestProcessPath = path.join(distPath, 'testProcess');
const distWorkerPath = path.join(distPath, 'worker');

const buildPath = path.join(releasePath, 'build');
//executables
const executablesPath = path.join(path.join(__dirname, '../executables'));
const WebApplication2Path = path.join(executablesPath, 'WebApplication2.exe');

export default {
  rootPath,
  dllPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  srcTestProcessPath,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
  distTestProcessPath,
  distWorkerPath,
  buildPath,
  WebApplication2Path,
  executablesPath,
};
