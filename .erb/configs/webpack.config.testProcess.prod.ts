/*
 * @Author: feifei
 * @Date: 2023-09-27 17:36:02
 * @LastEditors: feifei
 * @LastEditTime: 2023-11-15 16:46:13
 * @FilePath: \fcc_power_test\.erb\configs\webpack.config.testProcess.prod.ts
 * @Description:测试进程的生成环境配置文件
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';
import checkNodeEnv from '../scripts/check-node-env';
import deleteSourceMaps from '../scripts/delete-source-maps';

checkNodeEnv('production');
deleteSourceMaps();

const configuration: webpack.Configuration = {
  devtool: 'eval',

  mode: 'production',

  target: 'node',

  entry: {
    testProcess: path.join(webpackPaths.srcTestProcessPath, 'index.ts'),
    // MT8000SubTest: path.join(webpackPaths.srcTestProcessPath,
    //   'testFunction/MT8000/functionList/subTest',
    //   'index.ts',
    // ),
  },

  output: {
    path: webpackPaths.distTestProcessPath,
    filename: '[name].js',
    library: {
      type: 'umd',
    },
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
      analyzerPort: 8889,
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),

    new webpack.DefinePlugin({
      'process.type': '"browser"',
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
};

export default merge(baseConfig, configuration);
