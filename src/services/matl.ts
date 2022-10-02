import type { IMaterialListArgs, IMaterialInfo, IMaterialTypeInfo, IUnitloadListArgs, IUnitloadInfo, IPalletizeStandalonelyArgs, IFlowListArgs, IFlowInfo, IMaterialOptionsArgs, IInventoryStatusInfo, IBizTypeInfo, IBatchOptionsArgs, IUnitloadDetail, IChangeInventoryStatusArgs, IChangeInventoryStatusUnitloadItemInfo, IGetUnitloadItemsToChangeInventoryStatusArgs } from '@/models/matl';
import { trimArgs } from '@/utils/mapUtil';
import { sortToString } from '@/utils/myUtils';
import type { RequestData } from '@ant-design/pro-table';
import type { SortOrder } from 'antd/es/table/interface';
import { request } from 'umi';
import type { IApiData } from './IApiData';

// TODO 改为从后端取值
/**
 * 表示没有批号的值
 *
 */
export const valueForNoBatch = '*****';

export async function getInventoryStatus() {
  return request<IApiData<IInventoryStatusInfo[]>>('api/matl/get-inventory-status', {
    method: 'POST'
  });
}

/**
 * 获取物料列表
 *
 * @export
 * @param {IMaterialListArgs} params
 * @param {Record<string, SortOrder>} sort
 * @param {Record<string, React.ReactText[]>} filter
 * @returns
 */
export async function getMaterialList(
  params: IMaterialListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[]>,
) {
  return request<RequestData<IMaterialInfo>>('api/matl/get-material-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort),
      ...filter,
    },
  });
}

export async function getMaterialOptions(
  args: IMaterialOptionsArgs,
) {
  return request<IApiData<IMaterialInfo[]>>('api/matl/get-material-options', {
    method: 'POST',
    data: trimArgs(args),
  });
}


/**
 * 获取物料类型选项列表数据
 *
 * @export
 * @returns
 */
export async function getMaterialTypes() {
  return request<IApiData<IMaterialTypeInfo[]>>('api/matl/get-material-types', {
    method: 'POST',
  });
}


/**
 * 获取业务类型选项列表数据
 *
 * @export
 * @returns
 */
export async function getBizTypes(scope: 'Inbound' | 'Outbound' | 'StatusChanging') {
  return request<IApiData<IBizTypeInfo[]>>('api/matl/get-biz-types', {
    method: 'POST',
    data: {
      scope,
    }
  });
}

/**
 * 获取批号选项列表数据
 *
 * @export
 * @param {IMaterialOptionsArgs} args
 * @returns
 */
export async function getBatchOptions(
  args: IBatchOptionsArgs,
) {
  return request<IApiData<string[]>>('api/matl/get-batch-options', {
    method: 'POST',
    data: trimArgs(args),
  });
}


// TODO 修改导入方式
/**
 * 导入物料主数据
 *
 * @export
 * @returns
 */
export async function importMaterials() {
  return request<IApiData>('api/matl/import-materials', {
    method: 'POST'
  });
}


/**
 * 获取货载列表
 *
 * @export
 * @param {IUnitloadListArgs} params
 * @param {Record<string, SortOrder>} sort
 * @param {Record<string, React.ReactText[]>} filter
 * @returns
 */
export async function getUnitloadList(
  params: IUnitloadListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[] | null>,
) {
  const sort2 = { ...sort };
  if (Object.keys(sort2).length === 0) {
    sort2.modificationTime = 'descend';
  }
  return request<RequestData<IUnitloadInfo>>('api/matl/get-unitload-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort2),
      filter,
    },
  });
}

export async function getUnitloadDetail(palletCode: string) {
  return request<IApiData<IUnitloadDetail>>(`api/matl/get-unitload-detail`, {
    method: 'POST',
    data: {
      palletCode
    }
  });
}

export async function getUnitloadItemsToChangeInventoryStatus(
  params: IGetUnitloadItemsToChangeInventoryStatusArgs
) {
  return request<RequestData<IChangeInventoryStatusUnitloadItemInfo>>('api/matl/get-unitload-items-to-change-inventory-status', {
    method: 'POST',
    data: params,
  });
}

/**
 * 独立组盘
 *
 * @export
 * @param {IPalletizeStandalonelyArgs} args
 * @returns
 */
export async function palletizeStandalonely(args: IPalletizeStandalonelyArgs) {
  return request<IApiData>('api/matl/palletize-standalonely', {
    method: 'POST',
    data: args,
  });
}


/**
 * 获取流水列表
 *
 * @export
 * @param {IFlowListArgs} params
 * @param {Record<string, SortOrder>} sort
 * @param {Record<string, React.ReactText[]>} filter
 * @returns
 */
export async function getFlowList(
  params: IFlowListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[] | null>,
) {
  return request<RequestData<IFlowInfo>>('api/matl/get-flow-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: 'flowId DESC',
      filter,
    },
  });
}


export async function changeInventoryStatus(params: IChangeInventoryStatusArgs) {
  return request<IApiData>(`api/matl/change-inventory-status`, {
    method: 'POST',
    data: params,
  });
}

export async function validatePalletCode(palletCode: string) {
  try {
    if (!palletCode) {
      return Promise.resolve();
    }
    const result = await request<IApiData>(`/api/matl/validate-pallet-code`, {
      method: 'POST',
      data: {
        palletCode
      },
      skipErrorHandler: true,
    });
    if (result.success) {
      return Promise.resolve();
    }
    return Promise.reject(result.errorMessage);
  }
  catch (err) {
    return Promise.reject(err)
  };
}
