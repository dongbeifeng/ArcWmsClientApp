import { IChangePasswordArgs } from '@/models/user';
import { request } from 'umi';


export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/account/get-current-user', {
    'method': 'POST',
    skipErrorHandler: true
  });
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function resetpassword(params: IChangePasswordArgs): Promise<any> {
  return request('/api/account/change-password', {
    method: 'POST',
    data: params
  });
}
