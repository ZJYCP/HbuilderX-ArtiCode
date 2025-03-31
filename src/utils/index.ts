// 后端接口host地址，根据环境判断
export const HOST = !window.hasOwnProperty('hbuilderx')
  ? 'http://localhost:3000'
  : 'https://backend-mdmdjldoda.cn-hangzhou.fcapp.run';
