import type { ICreateInboundOrderArgs, IIboPalletizeArgs, IInboundOrderInfo, IInboundOrderListArgs, IUpdateInboundOrderArgs } from '@/models/ibo';
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
export async function getInboundOrderList(
  params: IInboundOrderListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[]>,
) {
  return request<RequestData<IInboundOrderInfo>>('api/ibo/get-inbound-order-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort.length ? sort : { "inboundOrderCode": 'descend' }),
      ...filter,
    },
  });
}

/**
 * 创建入库单
 * @param args 创建入库单参数
 */
export async function createInboundOrder(args: ICreateInboundOrderArgs) {
  return request<IApiData>('api/ibo/create-inbound-order', {
    method: 'POST',
    data: args
  });
}

/**
 * 更新入口的
 * @param args 更新入库单参数
 */
export async function updateInboundOrder(args: IUpdateInboundOrderArgs) {
  return request<IApiData>(`/api/ibo/update-inbound-order`, {
    method: 'POST',
    data: args
  });
}


/**
 *
 * @param orderId 删除入库单
 */
export async function deleteInboundOrder(inboundOrderId: number) {
  return request<IApiData>(`api/ibo/delete-inbound-order`, {
    method: 'POST',
    data: {
      id: inboundOrderId
    }
  });
}

/**
 * 获取入库单详细信息
 * @param id 入库单ID
 */
export async function getInboundOrderDetail(inboundOrderId: number) {
  return request<IApiData<IInboundOrderInfo>>(`api/ibo/get-inbound-order-detail`, {
    method: 'POST',
    data: {
      inboundOrderId
    }
  });
}


/**
 * 关闭入库单
 * @param id 入库单ID
 */
export async function closeInboundOrder(inboundOrderId: number) {
  return request<IApiData>(`/api/ibo/close-inbound-order`, {
    method: 'POST',
    data: {
      inboundOrderId
    }
  });

}

/**
 * 入库单组盘
 *
 * @export
 * @param {IIboPalletizeArgs} args
 * @returns
 */
export async function palletize(args: IIboPalletizeArgs) {
  return request<IApiData>('api/ibo/palletize', {
    method: 'POST',
    data: args,
  });
}

