
/**
 * 实时库存报表的查询参数
 *
 * @export
 * @interface IInventoryReportArgs
 */
export interface IInventoryReportArgs {

  /**
   * 物料编码
   *
   * @type {(string | null)}
   * @memberof IInventoryReportArgs
   */
  materialCode: string | null;

  /**
   * 批号
   *
   * @type {(string | null)}
   * @memberof IInventoryReportArgs
   */
  batch: string | null;
}

/**
 * 库存信息
 *
 * @export
 * @interface IInventoryReprotItemInfo
 */
export interface IInventoryReprotItemInfo {

  /**
   * 物料代码
   *
   * @type {string}
   * @memberof IInventoryReprotItemInfo
   */
  materialCode: string;

  /**
   * 物料描述
   *
   * @type {string}
   * @memberof IInventoryReprotItemInfo
   */
  description: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IInventoryReprotItemInfo
   */
  batch: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IInventoryReprotItemInfo
   */
  inventoryStatus: string;

  /**
   * 数量
   *
   * @type {number}
   * @memberof IInventoryReprotItemInfo
   */
  quantity: number;

  /**
   * 计量单位
   *
   * @type {string}
   * @memberof IInventoryReprotItemInfo
   */
  uom: string;

}

export interface IAgeReportListArgs {
  materialCode: string | null;
}

/**
 * 库龄报表的数据项
 *
 * @export
 * @interface IAgeReportItemInfo
 */
export interface IAgeReportItemInfo {

  /**
   * 物料编码
   *
   * @type {string}
   * @memberof IAgeReportItemInfo
   */
  materialCode: string;

  /**
   * 物料描述
   *
   * @type {string}
   * @memberof IAgeReportItemInfo
   */
  description: string;

  /**
   * 物料规格
   *
   * @type {string}
   * @memberof IAgeReportItemInfo
   */
  specification: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IAgeReportItemInfo
   */
  batch: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IAgeReportItemInfo
   */
  inventoryStatus: string;

  /**
   * 计量单位
   *
   * @type {string}
   * @memberof IAgeReportItemInfo
   */
  uom: string;

  /**
   * 7天以内的库存数量
   *
   * @type {number}
   * @memberof IAgeReportItemInfo
   */
  zeroToSevenDays: number;

  /**
   * 7到30天的库存数量
   *
   * @type {number}
   * @memberof IAgeReportItemInfo
   */
  sevenToThirtyDays: number;

  /**
   * 30天到90天的库存数量
   *
   * @type {number}
   * @memberof IAgeReportItemInfo
   */
  thirtyToNinetyDays: number;

  /**
   * 90天以上的库存数量
   *
   * @type {number}
   * @memberof IAgeReportItemInfo
   */
  moreThanNinetyDays: number;
}


export interface IMonthlyReportDetail {
  month: Date;
  items: IMonthlyReportItemInfo[];
}

/**
 * 库存月报的数据项
 *
 * @export
 * @interface IMonthlyReportItemInfo
 */
export interface IMonthlyReportItemInfo {

  /**
   * 月份
   *
   * @type {Date}
   * @memberof IMonthlyReportItemInfo
   */
  month: Date;

  /**
   * 物料代码
   *
   * @type {string}
   * @memberof IMonthlyReportItemInfo
   */
  materialCode: string;

  /**
   * 物料描述
   *
   * @type {string}
   * @memberof IMonthlyReportItemInfo
   */
  description: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IMonthlyReportItemInfo
   */
  batch: string;

  /**
   * 库存状态
   *
   * @type {string}
   * @memberof IMonthlyReportItemInfo
   */
  inventoryStatus: string;

  /**
   * 计量单位
   *
   * @type {string}
   * @memberof IMonthlyReportItemInfo
   */
  uom: string;

  /**
   * 期初数量。期初数量 = 上期期末数量
   *
   * @type {number}
   * @memberof IMonthlyReportItemInfo
   */
  beginning: number;

  /**
   * 流入数量
   *
   * @type {number}
   * @memberof IMonthlyReportItemInfo
   */
  incoming: number;

  /**
   * 流出数量
   *
   * @type {number}
   * @memberof IMonthlyReportItemInfo
   */
  outgoing: number;

  /**
   * 期末数量。期末数量 = 期初数量 + 流入数量 - 流出数量
   *
   * @type {number}
   * @memberof IMonthlyReportItemInfo
   */
  ending: number;
}

export interface IMonthlyReportArgs {
  month: Date;
}


/**
 * 表示与日期关联的数值
 */
export interface IDateNumberPair {
  date: Date;
  value: number;
}

/**
 * 表示仪表盘数据
 */
export interface IDashboardData {


  /**
   * 数据查询时间
   */
  time: Date;

  /**
   * 位置数据
   */
  location: {
    /**
     * 巷道数量
     */
    streetletCount: number;

    /**
     * 货位数量
     */
    locationCount: number;

    /**
     * 货位使用率，有货货位 / 货位总数
     */
    locationUsageRate: number;

    /**
     * 最近7天（不含今天）的货位使用率，每天约 23:50 采样
     */
    locationUsageRate7: IDateNumberPair[];

    /**
     * 可用货位数
     */
    availableLocationCount: number;

    /**
     * 已禁入或禁出的货位数
     */
    disabledLocationCount: number;
  };

  /**
   *  入库单数量
   */
  inboundOrder: {
    /**
     * 当前未关闭的入库单数量
     */
    openInboundOrderCount: number;

    /**
     * 最近7天（不含今天）创建的入库单数量
     */
    inboundOrderCount7: IDateNumberPair[];
  };

  /**
   * 出库单数据
   */
  outboundOrder: {
    /**
     * 当前未关闭的出库单数量
     */
    openOutboundOrderCount: number;

    /**
     * 最近7天（不含今天）创建的出库单数量
     */
    outboundOrderCount7: IDateNumberPair[];
  };

  /**
   * 库存数据
   */
  stock: {

    /**
     * 当前货载数量
     */
    unitloadCount: number;

    /**
     * 当前库内空托盘数量
     */
    emptyPalletCount: number;

    /**
     * 最近7天（不含今天）产生的流入流水个数
     */
    flowInCount7: IDateNumberPair[];

    /**
     * 最近7天（不含今天）产生的流出流水个数
     *
     * @type {IDateNumberPair[]}
     */
    flowOutCount7: IDateNumberPair[];
  };

  /**
   * 任务数据
   */
  task: {
    /**
     * 当前任务数量
     */
    taskCount: number;

    /**
     * 最近7天（不含今天）产生的任务数
     */
    taskCount7: IDateNumberPair[];
  }

}
