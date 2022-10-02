export interface IInventoryStatusInfo {

  /**
   * 库存状态
   *
   */
  inventoryStatus: string;


  /**
   * 展示名称
   *
   */
  displayName: string;
}

/**
 * 物料主数据列表的查询参数
 *
 * @export
 * @interface IMaterialListArgs
 */
export interface IMaterialListArgs {
  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IMaterialListArgs
   */
  materialCode: string;

  /**
   * 物料描述
   *
   * @type {string}
   * @memberof IMaterialListArgs
   */
  description: string;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IMaterialListArgs
   */
  materialType: string;
}

/**
 *
 *
 * @export
 * @interface IMaterialInfo
 */
export interface IMaterialInfo {
  /**
   * 物料Id
   *
   * @type {number}
   * @memberof IMaterialInfo
   */
  materialId: number;

  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IMaterialInfo
   */
  materialCode: string;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IMaterialInfo
   */
  materialType: string;

  /**
   * 物料描述
   *
   * @type {string}
   * @memberof IMaterialInfo
   */
  description: string;

  /**
   * 物料规格
   *
   * @type {string}
   * @memberof IMaterialInfo
   */
  specification: string;

  /**
   * 是否启用批次管理
   *
   * @type {boolean}
   * @memberof IMaterialInfo
   */
  batchEnabled: boolean;

  /**
   * 物料分组
   *
   * @type {string}
   * @memberof IMaterialInfo
   */
  materialGroup: string;

  /**
   * 有效天数
   *
   * @type {number}
   * @memberof IMaterialInfo
   */
  validDays: number;

  /**
   * 静置时间（以小时为单位）
   *
   * @type {number}
   * @memberof IMaterialInfo
   */
  standingTime: number;

  /**
   * ABC分类
   *
   * @type {('A' | 'B' | 'C' | null)}
   * @memberof IMaterialInfo
   */
  abcClass: 'A' | 'B' | 'C' | null;

  /**
   * 计量单位
   *
   * @type {string}
   * @memberof IMaterialInfo
   */
  uom: string;

  /**
   * 库存下边界
   *
   * @type {number}
   * @memberof IMaterialInfo
   */
  lowerBound: number;

  /**
   * 库存上边界
   *
   * @type {number}
   * @memberof IMaterialInfo
   */
  upperBound: number;

  /**
   * 默认数量
   *
   * @type {number}
   * @memberof IMaterialInfo
   */
  defaultQuantity: number;

  /**
   * 默认存储分组
   *
   * @type {string}
   * @memberof IMaterialInfo
   */
  defaultStorageGroup: string;

  /**
   * 备注
   *
   * @type {string}
   * @memberof IMaterialInfo
   */
  comment: string;
}

/**
 * 物料选择列表的查询参数
 *
 * @export
 * @interface IMaterialOptionsArgs
 */
export interface IMaterialOptionsArgs {
  /**
   * 关键字，可以是物料编码，物料描述的拼音首字母
   *
   * @type {string}
   * @memberof IMaterialOptionsArgs
   */
  keyword: string;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IMaterialOptionsArgs
   */
  materialType: string;

  /**
   * 是否只取有库存的物料号
   *
   * @type {boolean}
   * @memberof IMaterialOptionsArgs
   */
  inStockOnly: boolean;

  /**
   * 取多少条记录
   *
   * @type {number}
   * @memberof IMaterialOptionsArgs
   */
  limit: number;
}


/**
 * 物料选择列表的查询参数
 *
 * @export
 * @interface IBatchOptionsArgs
 */
export interface IBatchOptionsArgs {
  /**
   * 关键字
   *
   * @type {string}
   * @memberof IBatchOptionsArgs
   */
  keyword?: string;

  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IBatchOptionsArgs
   */
  materialCode: string;

  /**
   * 库存状态
   *
   * @type {boolean}
   * @memberof IBatchOptionsArgs
   */
  inventoryStatus?: string;

  /**
   * 取多少条记录
   *
   * @type {number}
   * @memberof IBatchOptionsArgs
   */
  limit: number;
}

/**
 * 物料类型信息
 *
 * @export
 * @interface IMaterialTypeInfo
 */
export interface IMaterialTypeInfo {
  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IMaterialTypeInfo
   */
  materialType: string;

  /**
   * 物料类型说明
   *
   * @type {string}
   * @memberof IMaterialTypeInfo
   */
  displayName: string;

}


/**
 * 业务类型信息
 *
 * @export
 * @interface IBizTypeInfo
 */
export interface IBizTypeInfo {
  /**
   * 业务类型
   *
   * @type {string}
   * @memberof IBizTypeInfo
   */
  bizType: string;

  /**
   * 业务类型说明
   *
   * @type {string}
   * @memberof IBizTypeInfo
   */
  displayName: string;

    /**
     * 更改库存状态时的发出状态。
     */
    issuingInventoryStatus?: string;

    /**
     * 更改库存状态时的接收状态。
     */
    receivingInventoryStatus?: string;

}

/**
 * 流水列表的查询参数
 *
 * @export
 * @interface IFlowListArgs
 */
export interface IFlowListArgs {
  // TODO 为这两个时间参数赋值
  /**
   * 开始时间
   *
   * @type {string}
   * @memberof IFlowListArgs
   */
  timeFrom?: Date;

  /**
   * 结束时间
   *
   * @type {Date}
   * @memberof IFlowListArgs
   */
  timeTo?: Date;

  /**
   * 托盘号，不支持模糊查询
   *
   * @type {string}
   * @memberof IFlowListArgs
   */
  palletCode?: string;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IFlowListArgs
   */
  materialType?: string;

  /**
   * 物料代码，不支持模糊查询
   *
   * @type {string}
   * @memberof IFlowListArgs
   */
  materialCode?: string;

  /**
   * 批号，不支持模糊查询
   *
   * @type {string}
   * @memberof IFlowListArgs
   */
  batch?: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IFlowListArgs
   */
  inventoryStatus?: string;

  /**
   * 单据号，不支持模糊查询
   *
   * @type {string}
   * @memberof IFlowListArgs
   */
  orderCode?: string;

  /**
   * 业务类型
   *
   * @type {string[]}
   * @memberof IFlowListArgs
   */
  bizTypes?: string[];
}

/**
 * 流水信息
 *
 * @export
 * @interface IFlowInfo
 */
export interface IFlowInfo {

  /**
   * 流水Id
   *
   * @type {number}
   * @memberof IFlowInfo
   */
  flowId: number;

  /**
   * 创建时间
   *
   * @type {Date}
   * @memberof IFlowListItem
   */
  creationTime: Date;

  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  materialCode: string;


  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  materialType: string;

  /**
   * 物料描述
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  description: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  batch: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  inventoryStatus: string;

  /**
   * 业务类型
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  bizType: string;

  /**
   * 流动方向
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  direction: string;

  /**
   * 托盘号
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  palletCode: string;

  /**
   * 单据号，例如出库单号
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  orderCode: string;

  /**
   * ERP 的业务单号
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  bizOrder: string;

  /**
   * 导致此流水产生的操作类型
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  operationType: string;

  /**
   * 数量
   *
   * @type {number}
   * @memberof IFlowListItem
   */
  quantity: number;

  /**
   * 库存余额
   */
  balance: number;

  /**
   * 计量单位
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  uom: string;

  /**
   * 创建人
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  creationUser: string;

  /**
   * 备注
   *
   * @type {string}
   * @memberof IFlowListItem
   */
  comment: string;
}

/**
 * 货载列表的查询参数
 *
 * @export
 * @interface IUnitloadListArgs
 */
export interface IUnitloadListArgs {
  /**
   * 托盘号，支持模糊查找
   *
   * @type {string}
   * @memberof IUnitloadListArgs
   */
  palletCode?: string;

  /**
   * 是否已分配
   *
   * @type {boolean}
   * @memberof IUnitloadListArgs
   */
  allocated?: boolean;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IUnitloadListArgs
   */
  materialType?: string;

  // TODO 所有物料编码改为自动完成 + 不支持模糊查找

  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IUnitloadListArgs
   */
  materialCode?: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IUnitloadListArgs
   */
  batch?: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IUnitloadListArgs
   */
  inventoryStatus?: string;

  /**
   * 托盘所在巷道
   *
   * @type {number}
   * @memberof IUnitloadListArgs
   */
  streetletId?: number;

  /**
   * 托盘所在货位号
   *
   * @type {string}
   * @memberof IUnitloadListArgs
   */
  locationCode?: string;

  /**
   * 托盘是否有任务
   *
   * @type {boolean}
   * @memberof IUnitloadListArgs
   */
  hasTask?: boolean;

  /**
   * 托盘的操作提示
   *
   * @type {string}
   * @memberof IUnitloadListArgs
   */
  opHintType?: string;
}

/**
 * 货载明细列表的查询参数
 *
 * @export
 * @interface IUnitloadItemListArgs
 */
export interface IUnitloadItemListArgs {
  /**
   * 托盘号
   *
   * @type {string}
   * @memberof IUnitloadItemListArgs
   */
  palletCode?: string;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IUnitloadItemListArgs
   */
  materialType?: string;

  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IUnitloadItemListArgs
   */
  materialCode: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IUnitloadItemListArgs
   */
  batch: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IUnitloadItemListArgs
   */
  inventoryStatus: string;
}

/**
 * 货载列表的数据项
 *
 * @export
 * @interface IUnitloadInfo
 */
export interface IUnitloadInfo {
  /**
   * 货载Id
   *
   * @type {number}
   * @memberof IUnitloadInfo
   */
  unitloadId: number;

  /**
   * 托盘号
   *
   * @type {string}
   * @memberof IUnitloadInfo
   */
  palletCode: string;

  /**
   * 创建时间
   *
   * @type {Date}
   * @memberof IUnitloadInfo
   */
  creationTime: Date;

  /**
   * 更新时间
   */
  modificationTime: Date;

  /**
   * 所在位置Id
   *
   * @type {number}
   * @memberof IUnitloadInfo
   */
  locationId: number;

  /**
   * 所在位置编码
   *
   * @type {string}
   * @memberof IUnitloadInfo
   */
  locationCode: string;

  /**
   * 货位类型
   */
  locationType: string;

  /**
   * 所在巷道Id
   *
   * @type {(number | null)}
   * @memberof IUnitloadInfo
   */
  streetletId: number | null;

  /**
   * 所在巷道编码
   *
   * @type {(string | null)}
   * @memberof IUnitloadInfo
   */
  streetletCode: string | null;

  /**
   * 备注
   *
   * @type {string}
   * @memberof IUnitloadInfo
   */
  comment: string;

  /**
   * 当前是否有任务
   *
   * @type {boolean}
   * @memberof IUnitloadInfo
   */
  hasTask: boolean;

  /**
   * 托盘是否已分配
   *
   * @type {boolean}
   * @memberof IUnitloadInfo
   */
  allocated: boolean;

  /**
   * 货载明细列表
   *
   * @type {IUnitloadItemInfo[]}
   * @memberof IUnitloadInfo
   */
  items: IUnitloadItemInfo[];
}

/**
 * 货载明细信息
 *
 * @export
 * @interface IUnitloadItemInfo
 */
export interface IUnitloadItemInfo {

  /**
   * 货载项Id
   *
   * @type {number}
   * @memberof IUnitloadItemInfo
   */
  unitloadItemId: number;

  /**
   * 物料Id
   *
   * @type {number}
   * @memberof IUnitloadItemInfo
   */
  materialId: number;

  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IUnitloadItemInfo
   */
  materialCode: string;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IUnitloadItemInfo
   */
  materialType: string;

  /**
   * 物料描述
   *
   * @type {string}
   * @memberof IUnitloadItemInfo
   */
  description: string;

  /**
   * 物料规格
   *
   * @type {string}
   * @memberof IUnitloadItemInfo
   */
  specification: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IUnitloadItemInfo
   */
  batch: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IUnitloadItemInfo
   */
  inventoryStatus: string;

  /**
   * 数量
   *
   * @type {number}
   * @memberof IUnitloadItemInfo
   */
  quantity: number;

  /**
   * 计量单位
   *
   * @type {string}
   * @memberof IUnitloadItemInfo
   */
  uom: string;

  /**
   * 分配给出库单的数量
   *
   * @type {number}
   * @memberof IUnitloadItemInfo
   */
  quantityAllocatedToOutboundOrder?: number;

  /**
   * 分配信息
   *
   * @type {{
   *     outboundLineId: number,
   *     quantityAllocated: number,
   *   }[]}
   * @memberof IUnitloadItemInfo
   */
  allocationsToOutboundOrder: {
    /**
     * 出库单明细Id
     *
     * @type {number}
     */
    outboundLineId: number,

    /**
     * 分配数量
     *
     * @type {number}
     */
    quantityAllocated: number,
    /**
     * 分配信息ID
     */
    unitloadItemAllocationId: number,
  }[],

}

/**
 * 货载详细信息
 *
 * @export
 * @interface IUnitloadDetail
 */
export interface IUnitloadDetail {
  /**
   * 货载Id
   *
   * @type {number}
   * @memberof IUnitloadDetail
   */
  unitloadId: number;

  /**
   * 托盘编号
   *
   * @type {string}
   * @memberof IUnitloadDetail
   */
  palletCode: string;

  /**
   * 创建时间
   *
   * @type {string}
   * @memberof IUnitloadDetail
   */
  creationTime: string;

  /**
   * 所在位置
   *
   * @type {string}
   * @memberof IUnitloadDetail
   */
  locationCode: string;

  /**
   * 托盘到达当前位置的时间
   *
   * @type {Date}
   * @memberof IUnitloadDetail
   */
  locationTime: Date;
  /**
   * 所在巷道
   *
   * @type {(string | null)}
   * @memberof IUnitloadDetail
   */
  streetletCode: string | null;

  /**
   * 操作提示类型
   *
   * @type {string}
   * @memberof IUnitloadDetail
   */
  opHintType: string;

  /**
   * 操作提示信息
   *
   * @type {string}
   * @memberof IUnitloadDetail
   */
  opHintInfo: string;

  /**
   * 货载的重量。单位千克。
   */
  weight: number;


  /**
   *  货载的高度。单位米。
   */
  height: number;


  /**
   *  存储分组。
   */
  storageGroup: string;


  /**
   * 出库标记
   */
  outFlag: string;

  /**
   * 容器规格。
   */
  palletSpecification: string;


  /**
   * 备注
   *
   * @type {(string | null)}
   * @memberof IUnitloadDetail
   */
  comment: string | null;

  /**
   * 是否有任务
   *
   * @type {boolean}
   * @memberof IUnitloadDetail
   */
  hasTask: boolean;

  /**
   * 当前分配到的单据
   *
   * @type {(string | null)}
   * @memberof IUnitloadDetail
   */
  currentUat: string | null;

  /**
   * 货载明细
   *
   * @type {IUnitloadItemInfo[]}
   * @memberof IUnitloadDetail
   */
  items: IUnitloadItemInfo[];


  /**
   * 当前任务号
   *
   * @type {(string | null)}
   * @memberof IUnitloadDetail
   */
  currentTaskCode: string | null;

  /**
   * 当前任务类型
   *
   * @type {(string | null)}
   * @memberof IUnitloadDetail
   */
  currentTaskType: string | null;

  /**
   * 当前任务起点
   *
   * @type {(string | null)}
   * @memberof IUnitloadDetail
   */
  currentTaskStartLocationCode: string | null;

  /**
   * 当前任务终点
   *
   * @type {(string | null)}
   * @memberof IUnitloadDetail
   */
  currentTaskEndLocationCode: string | null;
}

export interface IGetUnitloadItemsToChangeInventoryStatusArgs {

  /**
   * 业务类型
   */
  bizType: string;

  /**
   * 托盘号
   */
  palletCode?: string;

  /**
   * 物料类型
   */
  materialType?: string;


  /**
   * 物料代码
   */
  materialCode: string;

  /**
   * 物料描述
   */
  description: string;

  /**
   *  物料规格
   */
  specification: string;

  /**
   * 批号
   */
  batch: string;
}

/**
 * 用于变更库存状态的货载明细信息
 *
 * @export
 * @interface IChangeInventoryStatusUnitloadItemInfo
 */
export interface IChangeInventoryStatusUnitloadItemInfo {

  /**
   * 货载项Id
   *
   * @type {number}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  unitloadItemId: number;

  /**
   * 物料Id
   *
   * @type {number}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  materialId: number;

  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  materialCode: string;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  materialType: string;

  /**
   * 物料描述
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  description: string;

  /**
   * 物料规格
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  specification: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  batch: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  inventoryStatus: string;

  /**
   * 数量
   *
   * @type {number}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  quantity: number;

  /**
   * 计量单位
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  uom: string;


  /**
   * 托盘号
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  palletCode: string;

  /**
   * 所在货位编码
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  locationCode: string;

  /**
   * 所在巷道编码
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  streetletCode?: string;

  /**
   * 托盘是否已分配
   *
   * @type {boolean}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  allocated: boolean;

  /**
   * 托盘是否有任务
   *
   * @type {boolean}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  hasTask: boolean;

  /**
   * 托盘是否有盘点错误
   *
   * @type {boolean}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  hasCountingError: boolean;


  /**
   * 是否可变更库存状态
   *
   * @type {boolean}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  canChangeInventoryStatus: boolean;


  /**
   * 不可变更库存状态的原因
   *
   * @type {string}
   * @memberof IChangeInventoryStatusUnitloadItemInfo
   */
  reasonWhyInventoryStatusCannotBeChanged: string;

}


//  ---------------------------------------------------------------
//

/**
 * 无单据组盘的操作参数
 *
 * @export
 * @interface IPalletizeStandalonelyArgs
 */
export interface IPalletizeStandalonelyArgs {
  /**
   * 托盘号
   *
   * @type {string}
   * @memberof IPalletizeStandalonelyArgs
   */
  palletCode: string;
  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IPalletizeStandalonelyArgs
   */
  materialCode: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IPalletizeStandalonelyArgs
   */
  batch: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IPalletizeStandalonelyArgs
   */
  inventoryStatus: string;

  /**
   * 数量
   *
   * @type {0}
   * @memberof IPalletizeStandalonelyArgs
   */
  quantity: 0;

  /**
   * 计量单位
   *
   * @type {string}
   * @memberof IPalletizeStandalonelyArgs
   */
  uom: string;

}


export interface IChangeInventoryStatusArgs {
  unitloadItemIds: number[];
  bizType: string;
}
