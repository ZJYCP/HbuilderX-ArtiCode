// 后端接口host地址，根据环境判断
export const HOST =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'http://articode.artimind.top:3000';
