const hx = require('hbuilderx');
// 后端接口host地址，根据环境判断
export const HOST =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://backend-mdmdjldoda.cn-hangzhou.fcapp.run';

// 全局配置文件路径 采用lowDB
export const GLOBAL_CONFIG_PATH = `${hx.env.appData}/extensions/articode/pref.json`;
