import { HOST } from '../../utils';
import { addToast } from '@heroui/react';

// 定义请求配置接口
interface RequestConfig {
  url: string;
  method?: string;
  headers?: HeadersInit;
  data?: object;
}

export interface ResponseFromBackend<T> {
  message: string;
  data: T;
  statusCode: number;
}

const showToast = (message: string, title: string = '请求发生错误') => {
  const description =
    typeof message === 'object'
      ? JSON.stringify(message, null, 2) // 格式化对象
      : message;
  addToast({
    title,
    description: description,
    color: 'danger',
  });
};

// 请求拦截器，可用于添加统一的请求头
const requestInterceptor = (config: RequestConfig): RequestConfig => {
  // 示例：添加统一的请求头
  const headers = {
    ...config.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
  return {
    ...config,
    headers,
  };
};

// 响应拦截器，可用于处理统一的响应逻辑
const responseInterceptor = async (response: Response): Promise<any> => {
  if (!response.ok) {
    console.error('响应错误:', response.statusText);
    showToast(response.statusText);
  }
  const res = await response.json();

  const errorHandlers: Record<number, () => void> = {
    401: () => showToast('登录已过期，请重新登录'),
  };
  if (res.code !== 200) {
    if (errorHandlers[res.code]) {
      errorHandlers[res.code]();
    }
    // else {
    //   showToast(res.message);
    // }
  }

  return res;
};

// 封装的 fetch 方法
const request = async <T = any>(
  config: RequestConfig,
): Promise<ResponseFromBackend<T>> => {
  // 执行请求拦截器
  const interceptedConfig = requestInterceptor(config);

  try {
    // 发起请求
    const response = await fetch(`${HOST}${interceptedConfig.url}`, {
      method: interceptedConfig.method || 'GET',
      headers: interceptedConfig.headers,
      body: JSON.stringify(interceptedConfig.data),
    });

    // 执行响应拦截器
    const res = await responseInterceptor(response);

    return res;
  } catch (error) {
    // 处理请求错误
    console.error('请求发生错误:', error);
    showToast(error.message);
    throw error;
  }
};

export default request;
