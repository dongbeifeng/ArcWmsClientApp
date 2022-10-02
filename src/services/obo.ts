// outboundorders.ts
/**
 * @Author pyluo
 * @Description 出库单服务
 * @Date 2021-01-03
 */

import type { IUnitloadInfo } from '@/models/matl';
import type { ICreateOutboundOrderArgs, IGetAvailableQuantityArgs, IOutboundOrderListArgs, IOutboundOrderInfo, IPickData, IAllocatStockArgs, } from '@/models/obo';
import { trimArgs } from '@/utils/mapUtil';
import { sortToString } from '@/utils/myUtils';
import type { RequestData } from '@ant-design/pro-table';
import type { SortOrder } from 'antd/es/table/interface';
import { request } from 'umi';
import type { IApiData } from './IApiData';

/**
 *
 * @param params
 * @param sort
 * @param filter
 */
export async function getOutboundOrderList(
  params: IOutboundOrderListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[]>,
) {
  return request<RequestData<IOutboundOrderInfo>>('api/obo/get-outbound-order-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort.length ? sort : { "outboundOrderCode": 'descend'}),
      ...filter,
    },
  });
}

/**
 * 创建出库单
 * @param args 创建出库单入参
 */
export async function createOutboundOrder(args: ICreateOutboundOrderArgs) {
  return request<IApiData>('api/obo/create-outbound-order', {
    method: 'POST',
    data: args
  });
}

/**
 * 更新出口的
 * @param args 更新出库单参数
 */
export async function updateOutboundOrder(args: ICreateOutboundOrderArgs) {
  return request<IApiData>(`/api/obo/update-outbound-order`, {
    method: 'POST',
    data: args
  });
}

/**
 *
 * @param outboundOrderId 删除出库单
 */
export async function deleteOutboundOrder(outboundOrderId: number) {
  return request<IApiData>(`api/obo/delete-outbound-order`, {
    method: 'POST',
    data: {
      outboundOrderId
    }
  });
}

/**
 * 获取出库单详细信息
 * @param outboundOrderId 出库单ID
 */
export async function getOutboundOrderDetails(outboundOrderId: number) {
  return request<IApiData<IOutboundOrderInfo>>(`api/obo/get-outbound-order-detail`, {
    method: 'POST',
    data: {
      outboundOrderId
    }
  });
}

export async function getAvailableQuantity(args: IGetAvailableQuantityArgs) {
  return request<number>('/api/obo/get-available-quantity', {
    method: 'POST',
    data: args,
  });
}

/**
 * 为出库单分配库存
 *
 * @export
 * @param {*} args
 * @returns
 */
export async function allocateStock(args: IAllocatStockArgs) {
  return request<IApiData>(`api/obo/allocate-stock`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 为出库单取消库内分配
 * @param outboundOrderId 出库单ID
 */
export async function deallocateStockInRack(outboundOrderId: number) {
  return request<IApiData>(`api/obo/deallocate-stock-in-rack`, {
    method: 'POST',
    data:{
      outboundOrderId,
    },
  });
}

/**
 * 将托盘从出库单中取消分配
 * @param outboundOrderId 出库单ID
 */
export async function deallocateStock(args: { outboundOrderId: number; palletCodes: string[] }) {
  return request<IApiData>(`api/obo/deallocate-pallets`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 获取分配给出库单的货载
 * @param outboundOrderId 出库单ID
 */
export async function getAllocatedUnitloads(outboundOrderId: number) {
  return request<IApiData<IUnitloadInfo[]>>(`api/obo/get-allocated-unitloads`, {
    method: 'POST',
    data: {
      outboundOrderId
    }
  });
}



/**
 * 关闭出库单
 * @param id 出库单ID
 */
export async function closeOutboundOrder(outboundOrderId: number) {
  return request<IApiData>(`/api/obo/close-outbound-order`, {
    method: 'POST',
    data: {
      outboundOrderId,
    }
  });

}
/**
 * 出库单下架
 * @param outboundOrderId 出库单ID
 * @param outlets 出口列表
 */
export async function attachToOutlets(args: {outboundOrderId: number; outlets: string[]}) {
  return request<IApiData>(`api/obo/attach-to-outlets`, {
    method: 'POST',
    data: args,
  });
}

/**
 * 拣货接口
 * @param pickInfo 拣货信息
 * @param palletCode 托盘号
 * @returns
 */
export async function pick(args: { pickInfos: IPickData[], palletCode: string }) {
  return request<IApiData>(`api/obo/pick`, {
    method: 'POST',
    data: args,
  });
}
