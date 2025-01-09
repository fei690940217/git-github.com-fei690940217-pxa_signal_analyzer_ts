/*
 * @Author: feifei
 * @Date: 2025-01-07 10:47:20
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-07 10:47:35
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\useStyle.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { createStyles } from 'antd-style';
export const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));
