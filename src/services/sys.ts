import type { IUpdateAppSettingArgs, IAppSetting } from '@/models/sys';
import type { IOpListArgs, IOpListInfo} from '@/models/sys';
import type { ITrigger, IUpdateTriggerArgs } from '@/models/trigger';
import { trimArgs } from '@/utils/mapUtil';
import type { RequestData } from '@ant-design/pro-table';
import { request } from 'umi';
import type { IApiData } from './IApiData';


export async function getAppSettingList(params: IUpdateAppSettingArgs) {
  return request<RequestData<IAppSetting>>('api/sys/get-app-setting-list', {
    method: 'POST',
    data: trimArgs(params),
  });
}

export async function updateAppSetting(args: IUpdateAppSettingArgs) {

  return request<IApiData>(`api/sys/update-app-setting`, {
    method: 'POST',
    data: {
      ...args,
      settingValue: args.settingValue.toString(),
    },
  });
}


export async function getOpList(params: IOpListArgs) {
  return request<RequestData<IOpListInfo>>('api/sys/get-op-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: 'creationTime DESC',
    },
  });
}

/**
 * 获取操作类型的选项列表
 * @returns
 */
export async function getOperationTypes() {
  return request<RequestData<string>>('api/sys/get-operation-types', {
    method: 'POST',
  });
}

/**
 *  获取当前角色的操作权限
 * @param roleId
 * @returns
 */
export async function getPermission(roleId: string) {
  return request<RequestData<string>>(`api/usr/get-permission`, {
    method: 'POST',
    data: {
      roleId
    }
  });
}

export async function setPermission(args: { roleId: string, allowedOperationTypes: string[]}) {
  return request<RequestData<string>>(`api/usr/set-permission`, {
    method: 'POST',
    data: args,
  });
}


export async function getTriggerList(params: IUpdateTriggerArgs) {
  return request<RequestData<ITrigger>>('api/sys/get-trigger-list', {
    method: 'POST',
    data: trimArgs(params),
  });
}

export async function pauseTrigger(triggerName: string,triggerGroup: string) {
  return request<IApiData>('/api/sys/pause-trigger/', {
    method: 'POST',
    data: {
      name:triggerName,
      group:triggerGroup
    },
  });
}

export async function resumeTrigger(triggerName: string,triggerGroup: string) {
  return request<IApiData>('/api/sys/resume-trigger', {
    method: 'POST',
    data: {
      name:triggerName,
      group:triggerGroup
    },
  });
}
