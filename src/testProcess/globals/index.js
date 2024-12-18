/*
 * @Author: feifei
 * @Date: 2024-12-10 16:08:53
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-10 16:20:22
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\globals\index.js
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
class SharedParameters {
    constructor() {
        this.data = {}; // 存储共享数据的对象
    }

    // 获取指定键的数据
    get(key) {
        return this.data[key];
    }

    // 设置指定键的数据
    set(key, value) {
        this.data[key] = value;
    }

    // 获取所有数据的副本
    getAll() {
        return { ...this.data };
    }

    // 删除指定键的数据
    remove(key) {
        delete this.data[key];
    }

    // 清空所有数据
    clear() {
        this.data = {};
    }
}

// 导出单例
module.exports = new SharedParameters();
