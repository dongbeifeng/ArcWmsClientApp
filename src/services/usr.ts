import type { IRoleListArgs, IRoleInfo, ICreateRoleArgs, IUpdateRoleArgs } from '@/models/usr';
import type { IUserListArgs, IUserInfo, ICreateUserArgs, IEditUserArgs } from '@/models/usr';
import { trimArgs } from '@/utils/mapUtil';
import { sortToString } from '@/utils/myUtils';
import type { RequestData } from '@ant-design/pro-table';
import type { SortOrder } from 'antd/es/table/interface';
import { request } from 'umi';
import type { IApiData } from './IApiData';


export async function getUserList(
  params: IUserListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[]>,
) {
  return request<RequestData<IUserInfo>>('api/usr/get-user-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort),
      filter,
    },
  });
}

export async function createUser(arg: ICreateUserArgs) {
  return request<IApiData>('api/usr/create-user', {
    method: 'POST',
    data: arg,
  });
}

export async function updateUser(arg: IEditUserArgs) {
  return request<IApiData>(`api/usr/update-user`, {
    method: 'POST',
    data: arg,
  });
}

export async function deleteUser(userId: string) {
  return request<IApiData>(`api/usr/delete-user`, {
    method: 'POST',
    data: {
      userId
    }
  });
}


export async function getRoleList(
  params: IRoleListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[]>,
) {
  return request<RequestData<IRoleInfo>>(`api/usr/get-role-list`, {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort),
      filter,
    },
  });
}

export async function getRoleOptions() {
  return request<IApiData<IRoleInfo[]>>('api/usr/get-role-options', {
    method: 'POST',
  });
}

export async function createRole(args: ICreateRoleArgs) {
  return request<IApiData>('api/usr/create-role', {
    method: 'POST',
    data: args,
  });
}

export async function updateRole(args: IUpdateRoleArgs) {
  return request<IApiData>(`api/usr/update-role`, {
    method: 'POST',
    data: args,
  });
}

export async function deleteRole(roleId: string) {
  return request<IApiData>(`api/usr/delete-role`, {
    method: 'POST',
    data: {
      roleId,
    }
  });
}
