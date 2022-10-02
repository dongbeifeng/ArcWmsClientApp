import type { RequestConfig } from 'umi';
import { request as rq } from 'umi';
import { ResponseError } from 'umi-request';
import { getTokenExpirationTime, getRefreshToken, getToken, setToken } from './tokenService';

let refreshTokenTimeout: any;

const errorHandler = (error: ResponseError): any => {
  const { response, data } = error;

  if (!response) {
    throw new Error('网络异常');
  }

  if (!data.success) {
    throw new Error(data.errorMessage ?? '未知错误');
  }
  return response;
};


export const request: RequestConfig = {
  timeout: 15000,
  errorConfig: {},
  errorHandler,
  credentials: 'include',
  middlewares: [],
  requestInterceptors: [(url, options) => {
    let headers = {};
    const token = getToken();
    if (token)
      headers = {
        Authorization: `Bearer ${token}`
      };
    return {
      url,
      options: { ...options, headers },
    };
  }, (url, options) => {
    const token = getToken();
    if (token) {
      const arr = ["api/account/refresh-token", "api/account/login", "api/account/logout"];
      if (!arr.some(x => url.indexOf(x) >= 0)) {
        const tokenExpirationTime = getTokenExpirationTime();

        // 提前30分钟刷新令牌
        // 如已失效，则没必要刷新
        // A---n-----E--n--B
        // A 过期前30分钟
        // B 过期后5分钟
        // n 现在
        const span = Date.now() - tokenExpirationTime;
        if ((60 * 1000 * -30) < span && span < (60 * 1000 * 5)) {
          // 检查 refreshTokenTimeout，避免发送重复的刷新令牌请求
          if (!refreshTokenTimeout) {
            refreshTokenTimeout = setTimeout(() => {
              rq("api/account/refresh-token", {
                method: 'POST',
                data: {
                  refreshToken: getRefreshToken(),
                },
                timeout: 15000,
                headers: {
                  Authorization: `Bearer ${token}`
                },
                // 跳过内置的错误处理，否则页面上会弹出消息框
                skipErrorHandler: true
              }).then(res => {
                if (res.success) {
                  setToken(res.data.token, res.data.tokenExpiry, res.data.refreshToken);
                }
              }).finally(() => {
                refreshTokenTimeout = null;
              });
            }, 1000);
          }
        }
      }
    }

    return {
      url,
      options: { ...options },
    };
  }
  ],
  responseInterceptors: [],
};

