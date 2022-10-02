import type { ICompletedTaskInfo, IRequestInfo } from '@/models/debug';
import { request } from 'umi';
import type { IApiData } from './IApiData';

/**
 * 模拟完成
 * @param params 完成参数
 */
export async function doCompleted(params: ICompletedTaskInfo) {
  return request<IApiData>('api/debug/simulate-completion', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 模拟请求
 * @param params 模拟请求参数
 */
export async function doRequest(params: IRequestInfo) {
  return request<IApiData>('api/debug/simulate-request', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
