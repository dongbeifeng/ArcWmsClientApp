import type { IDisableLocationArgs, IKeyPointListArgs, IKeyPointInfo, IStreetletListArgs, IStreetletInfo, IOutletListArgs, IOutletInfo, ISetOutletsArgs, IStorageLocationListArgs, IStorageLocationInfo, ITakeStreetletOfflineArgs, ICreateUpdateKeyPointArgs, ISideViewData, ISetStorageGroupArgs, ISetHeightLimitArgs, ISetWeightLimitArgs, ICreateOutletArgs,  } from '@/models/loc';
import type { IUnitloadDetail } from '@/models/matl';
import { trimArgs } from '@/utils/mapUtil';

import { sortToString } from '@/utils/myUtils';
// import request from '@/utils/request';

import type { RequestData } from '@ant-design/pro-table';
import type { SortOrder } from 'antd/es/table/interface';
 import { request } from 'umi';
import type { IApiData } from './IApiData';

/**
 * 获取巷道列表
 *
 * @export
 * @param {IStreetletListArgs} params 查询参数
 * @returns
 */
export async function getStreetletList(params: IStreetletListArgs) {
  return request<RequestData<IStreetletInfo>>('api/loc/get-streetlet-list', {
    method: 'POST',
    data: trimArgs(params),
  });
}

/**
 * 获取巷道选项列表
 *
 * @export
 * @returns
 */
export async function getStreetletOptions() {
  return request<IApiData<IStreetletInfo[]>>('api/loc/get-streetlet-options', {
    method: 'POST',
  });
}

/**
 * 使巷道脱机
 *
 * @export
 * @param {ITakeStreetletOfflineArgs} args
 * @returns
 */
export async function takeStreetletOffline(args: ITakeStreetletOfflineArgs) {
  return request<IApiData>(`api/loc/take-streetlet-offline`, {
    method: 'POST',
    data: args,
  });
}


/**
 * 使巷道联机
 *
 * @export
 * @param {ITakeOnlineArgs} args
 * @returns
 */
export async function takeStreetletOnline(args: ITakeStreetletOfflineArgs) {
  return request<IApiData>(`api/loc/take-streetlet-online`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 设置巷道可到达的出口
 *
 * @export
 * @param {ISetOutletsArgs} args
 * @returns
 */
export async function setOutlets(args: ISetOutletsArgs) {
  return request<IApiData>(`api/loc/set-outlets`, {
    method: 'POST',
    data: args,
  });
}


/**
 * 获取储位列表
 *
 * @export
 * @param {IStorageLocationListArgs} params
 * @param {Record<string, SortOrder>} sort
 * @param {Record<string, React.ReactText[]>} filter
 * @returns
 */
export async function getStorageLocationList(
  params: IStorageLocationListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[]>,
) {
  return request<RequestData<IStorageLocationInfo>>('api/loc/get-storage-location-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort),
      filter,
    },
  });
}

/**
 * 获取关键点列表
 *
 * @export
 * @param {IKeyPointListArgs} params
 * @param {Record<string, SortOrder>} sort
 * @param {Record<string, React.ReactText[]>} filter
 * @returns {Promise<RequestData<IKeyPointInfo>>}
 */
export async function getKeyPointList(
  params: IKeyPointListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[]>,
): Promise<RequestData<IKeyPointInfo>> {
  return request<RequestData<IKeyPointInfo>>('api/loc/get-key-point-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort),
      filter,
    },
  });
}

/**
 * 将位置设为禁止入站
 *
 * @export
 * @param {IDisableLocationArgs} args
 * @returns
 */
export async function disableInbound(args: IDisableLocationArgs) {
  return request<IApiData>(`api/loc/disable-inbound`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 将位置设为允许入站
 *
 * @export
 * @param {IEnableInboundArgs} args
 * @returns
 */
export async function enableInbound(args: IDisableLocationArgs) {
  return request<IApiData>(`api/loc/enable-inbound`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 将位置设为禁止出站
 *
 * @export
 * @param {IDisableOutboundArgs} args
 * @returns
 */
export async function disableOutbound(args: IDisableLocationArgs) {
  return request<IApiData>(`api/loc/disable-outbound`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 将位置设为允许出站
 *
 * @export
 * @param {IEnableOutboundArgs} args
 * @returns
 */
export async function enableOutbound(args: IDisableLocationArgs) {
  return request<IApiData>(`api/loc/enable-outbound`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 设置分组
 * @param args
 * @returns
 */
export async function setStorageGroup(args: ISetStorageGroupArgs) {
  return request<IApiData>(`api/loc/set-storage-group`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 设置限高
 * @param args
 * @returns
 */
export async function setHeightLimit(args: ISetHeightLimitArgs) {
  return request<IApiData>(`api/loc/set-height-limit`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 设置限重
 * @param args
 * @returns
 */
export async function setWeightLimit(args: ISetWeightLimitArgs) {
  return request<IApiData>(`api/loc/set-weight-limit`, {
    method: 'POST',
    data: args,
  });
}


/**
 * 创建关键点
 *
 * @export
 * @param {ICreateKeyPointArgs} args
 * @returns
 */
export async function createKeyPoint(args: ICreateUpdateKeyPointArgs) {
  return request<IApiData>('api/loc/create-key-point', {
    method: 'POST',
    data: args,
  });
}

/**
 * 更新关键点
 *
 * @export
 * @param {number} id 关键点的位置Id
 * @param {IUpdateKeyPointArgs} arg
 * @returns
 */
export async function updateKeyPoint(id: number, arg: ICreateUpdateKeyPointArgs) {
  return request<IApiData>(`api/loc/update-key-point/${id}`, {
    method: 'POST',
    data: arg,
  });
}

/**
 * 获取出口选项列表数据
 *
 * @export
 * @returns
 */
export async function getOutletOptions() {
  return request<IApiData<IOutletInfo[]>>('api/loc/get-outlet-options', {
    method: 'POST',
  });
}

/**
 * 获取出口列表
 *
 * @export
 * @param {IOutletListArgs} params
 * @returns
 */
export async function getOutletList(params: IOutletListArgs) {
  return request<RequestData<IOutletInfo>>('api/loc/get-outlet-list', {
    method: 'POST',
    data: trimArgs(params),
  });
}

export async function createOutlet(arg: ICreateOutletArgs) {
  return request<IApiData>('api/loc/create-outlet', {
    method: 'POST',
    data: arg,
  });
}

export async function clearOutlet(outletId: number) {
  return request<IApiData>(`api/loc/clear-outlet`, {
    method: 'POST',
    data: {
      outletId,
    }
  });
}



/**
 * 获取侧视图数据。
 *
 * @export
 * @returns
 */
export async function getSideViewData(streetletCode: string) {
  return request<IApiData<ISideViewData>>(`api/loc/get-side-view`, {
    method: 'POST',
    data: {
      streetletCode,
    }

  });
}

export async function getStorageLocationDetail(locationCode: string) {
  return request<IApiData<IStorageLocationInfo & { exists: boolean, unitloads: IUnitloadDetail[] }>>(`api/loc/get-storage-location-detail`, {
    method: 'POST',
    data: {
      locationCode,
    }
  });
}
