/*
 * @Author: feifei
 * @Date: 2023-10-18 16:00:08
 * @LastEditors: feifei
 * @LastEditTime: 2024-01-25 17:35:08
 * @FilePath: \5G_TELEC_TEST\.erb\configs\webpack.config.base.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
/**
 * Base webpack config used across other specific configs
 */
import path from 'path';
import webpack from 'webpack';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
            compilerOptions: {
              module: 'esnext',
            },
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    alias: {
      // 渲染引擎使用
      '@': path.resolve(__dirname, '../../src/renderer'),
      '@render': path.resolve(__dirname, '../../src/renderer'),
      '@src': path.resolve(__dirname, '../../src'),
      '@t': path.resolve(__dirname, '../../src/customTypes'),
      '@api': path.resolve(__dirname, '../../src/renderer/api'),
      //主进程使用
      '@main': path.resolve(__dirname, '../../src/main'),
      //测试进程使用
      '@test': path.resolve(__dirname, '../../src/testProcess'),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    // There is no need to add aliases here, the paths in tsconfig get mirrored
    plugins: [new TsconfigPathsPlugins()],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
