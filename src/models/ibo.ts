
/**
 * 获取出库单列表参数
 */
 export interface IInboundOrderListArgs {
  /**
   * 入库单号
   * @description 支持模糊查找，使用 ? 表示单个字符，使用 * 表示任意个字符
   *
   */
  inboundOrderCode?: string;
  /**
   * 业务类型
   */
  bizType?: string;
  /**
   * 是否显示已关闭的入库单
   */
  closed?: boolean;
}

/**
 * 出库单列表页的数据项
 */
 export interface IInboundOrderInfo {
  /**
   * 入库单Id
   */
  inboundOrderId?: number;
  /**
   * 入库单编号。
   */
  inboundOrderCode?: string;
  /**
   * 创建时间
   */
  creationTime?: Date;
  /**
   * 创建人
   */
  creationUser?: string;
  /**
   * 修改时间
   */
  modificationTime?: Date;
  /**
   * 修改人
   */
  modificationUser?: string;
  /**
   * 业务类型
   */
  bizType?: string;
  /**
   * 业务单据号
   */
  bizOrder?: string;
  /**
   * 是否已关闭
   */
  closed?: boolean;
  /**
   * 关闭时间
   */
  closedAt?: Date;
  /**
   * 由谁关闭
   */
  closedBy?: string;
  /**
   * 备注
   */
  comment?: string;
  /**
   * 出库单明细集合。
   */
  lines?: IInboundLineInfo[];
}


/**
 * 入库单明细
 */
 export interface IInboundLineInfo {
  /**
   * 入库单明细Id。
   */
  inboundLineId: number;
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
   * 要出库的批号，不为空
   */
  batch: string;
  /**
   * 要出库的库存状态。
   */
  inventoryStatus: string;
  /**
   * 计量单位。
   */
  uom: string;
  /**
   * 应入数量。
   */
  quantityExpected: number;
  /**
   * 已入数量
   */
  quantityReceived: number;
  /**
   * 备注
   */
  comment?: string;
}


/**
 * 创建入库单的操作参数
 */
 export interface ICreateInboundOrderArgs {
  /**
   * 业务类型
   */
  bizType: string;
  /**
   * 业务单据号
   */
  bizOrder?: string;
  /**
   * 备注
   */
  comment?: string;

  /**
   * 入库明细
   *
   * @type {IEditInboundLineInfo[]}
   * @memberof ICreateInboundOrderArgs
   */
  lines?: IEditInboundLineInfo[];
}


/**
 * 创建入库单或编辑入库单操作中的入库行信息。
 */
 export interface IEditInboundLineInfo {
  /**
   * 本行的操作：  add 表示新增，  edit 表示编辑，  delete 表示删除。
   */
  op: string;
  /**
   * 入库单明细Id，用户在界面上新增的明细Id为0。
   */
  inboundLineId?: number;
  /**
   * 物料代码
   */
  materialCode: string;
  /**
   * 要入库的批号，不可以为空
   */
  batch: string;
  /**
   * 要入库的库存状态。
   */
  inventoryStatus: string;
  /**
   * 计量单位。
   */
  uom: string;
  /**
   * 应入数量
   */
  quantityExpected?: number;
  /**
   * 备注
   */
  comment?: string;
}


/**
 * 编辑入库单操作的参数
 */
 export interface IUpdateInboundOrderArgs {

  /**
   * 要更新的入库单 Id。
   */
  inboundOrderId: number;

  /**
   * 业务单号
   */
  bizOrder?: string;
  /**
   * 备注I
   */
  comment?: string;
  /**
   * 入库明细
   */
  lines?: IEditInboundLineInfo[];
}


/**
 * 入库单组盘的操作参数
 *
 * @export
 * @interface IIboPalletizeArgs
 */
 export interface IIboPalletizeArgs {

  /**
   * 入库单号
   *
   * @type {string}
   * @memberof IIboPalletizeArgs
   */
   inboundOrderCode: string;

  /**
   * 托盘号
   *
   * @type {string}
   * @memberof IIboPalletizeArgs
   */
  palletCode: string;
  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IIboPalletizeArgs
   */
  materialCode: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IIboPalletizeArgs
   */
  batch: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IIboPalletizeArgs
   */
  inventoryStatus: string;

  /**
   * 数量
   *
   * @type {0}
   * @memberof IIboPalletizeArgs
   */
  quantity: 0;

  /**
   * 计量单位
   *
   * @type {string}
   * @memberof IIboPalletizeArgs
   */
  uom: string;

}
