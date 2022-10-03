// outboundorders.ts
/**
 * @Author pyluo
 * @Description 出库单数据接口
 * @Date 2021-01-03
 */


/**
 * 出库单
 */
export interface IOutboundOrderInfo {
  /**
   * 出库单Id
   */
  outboundOrderId: number;
  /**
   * 出库单编号。
   */
  outboundOrderCode: string;
  /**
   * 创建时间
   */
  creationTime: Date;
  /**
   * 创建人
   */
  creationUser: string;
  /**
   * 修改时间
   */
  modificationTime: Date;
  /**
   * 修改人
   */
  modificationUser: string;
  /**
   * 业务类型
   */
  bizType: string;
  /**
   * 业务单据号
   */
  bizOrder: string;
  /**
   * 是否已关闭
   */
  closed: boolean;
  /**
   * 关闭时间
   */
  closedAt: Date;
  /**
   * 由谁关闭
   */
  closedBy: string;
  /**
   * 备注
   */
  comment: string;
  /**
   *
   */
  lines: IOutboundLineInfo[];

  /**
   * 已分配的货载数
   *
   * @type {number}
   * @memberof IOutboundOrderItem
   */
  unitloadCount: number;
}

/**
 * 出库单明细
 */
export interface IOutboundLineInfo {
  /**
   * 出库单明细Id
   */
  outboundLineId: number;
  /**
   * 物料Id
   */
  materialId: number;
  /**
   * 物料编码
   */
  materialCode: string;
  /**
   * 物料类型
   */
  materialType: string;
  /**
   * 物料描述
   */
  description: string;
  /**
   * 物料规格
   */
  specification: string;
  /**
   * 要出库的批号，可以为空
   */
  batch?: string;
  /**
   * 要出库的库存状态
   */
  inventoryStatus: string;
  /**
   * 计量单位
   */
  uom: string;
  /**
   * 需求数量
   */
  quantityDemanded: number;
  /**
   * 已出数量
   */
  quantityFulfilled: number;
  /**
   * 未出数量，MAX(应出-已出, 0)
   */
  quantityUnfulfilled: number;
  /**
   * 备注
   */
  comment: string;
}

/**
 * 获取出库单列表参数
 */
export interface IOutboundOrderListArgs {
  /**
   * 出库单号
   * @description 支持模糊查找，使用 ? 表示单个字符，使用 * 表示任意个字符
   *
   */
  outboundOrderCode?: string;
  /**
   * 业务类型
   */
  bizType?: string;
  /**
   * 是否显示已关闭的出库单
   */
  closed?: boolean;
}
/**
 * 创建出库单入参
 */
export interface ICreateOutboundOrderArgs {
    /**
   * 出库单Id
   */
  outboundOrderId?: number;
  /**
   * 业务类型
   */
  bizType: string | null;
  /**
   * 业务单据号
   */
  bizOrder: string;
  /**
   * 备注
   */
  comment: string;
  /**
   * 创建出库单或编辑出库单操作中的出库行信息
   */
  lines: EditOutboundLineInfo[];
}

/**
 * 创建或编辑出库单明细
 */
export interface EditOutboundLineInfo {
  /**
   * 本行的操作： add 表示新增， edit 表示编辑， delete 表示删除。
   */
  op: 'add' | 'edit' | 'delete';
  /**
   * 出库单明细Id，用户在界面上新增的明细Id为0。
   */
  outboundLineId: number;
  /**
   * 物料代码
   */
  materialCode: string;
  /**
   * 要出库的批号，可以为空
   */
  batch?: string;
  /**
   * 要出库的库存状态
   */
  inventoryStatus: string;
  /**
   * 计量单位
   */
  uom: string;
  /**
   * 需求数量
   */
  quantityDemanded: number;
  /**
   * 备注
   */
  comment: string;
}


export interface IEditOutboundLineInfo extends Partial<EditOutboundLineInfo> {
  key: string;
  isNew?: boolean;
  editable?: boolean;
  description: string;
  qty?: number;
}

/**
 * 获取可用库存数量
 *
 * @export
 * @interface IGetAvailableQuantityArgs
 */
export interface IGetAvailableQuantityArgs {
  /**
   * 物料代码
   *
   */
  materialCode?: string;

  /**
   *  库存状态
   */
  inventoryStatus?: string;

  /**
   * 批号
   */
  batch?: string;

  /**
   * 出库单号
   *
   */
  outboundOrderCode?: string;
}

export interface IAllocatStockArgs {

  /**
   * 要分配库存的出库单 Id。
   */
  outboundOrderId: number;

  /**
   * 分配选项。
   */
  options?: IAllocatStockOptions;
}

/**
 * 为出库单分配库存的选项。
 *
 * @export
 * @interface IAllocatStockOptions
 */
export interface IAllocatStockOptions {

  /**
   * 指示在哪些区域内分配，null 或空数组表示在全部区域分配
   *
   */
  areas?: string[];

  /**
   * 指示包含哪些托盘，这些托盘优先参与分配
   *
   */
  includePallets?: string[];

  /**
   * 指示排除哪些托盘，这些托盘不会参与分配，即使出现在 includePallets 中，也不参与分配
   *
   */
  excludePallets?: string[];

  /**
   * 指示是否跳过禁出的巷道。已禁出巷道的托盘无法下架，但跳过会打破先入先出规则
   *
   */
  skipStreetletsOutboundDisabled: boolean;

}

/**
 * 拣货数据
 */
export interface IPickData {
  /**
   * 分配信息ID
   */
  unitloadItemAllocationId: number,
  /**
   * 拣货数量
   */
  quantityPicked: number,
}
