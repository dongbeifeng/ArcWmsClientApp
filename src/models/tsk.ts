import type { IUnitloadItemInfo } from "./matl";

/**
 * 历史任务列表的查询参数
 *
 * @export
 * @interface IArchivedTaskListArgs
 */
export interface IArchivedTaskListArgs {

  /**
   * 任务号
   *
   * @type {string}
   * @memberof IArchivedTaskListArgs
   */
  taskCode?: string;

  /**
   * 托盘号
   *
   * @type {string}
   * @memberof IArchivedTaskListArgs
   */
  palletCode?: string;

  /**
   * 任务类型
   *
   * @type {string}
   * @memberof IArchivedTaskListArgs
   */
  taskType?: string;

  /**
   * 起点编号
   *
   * @type {string}
   * @memberof IArchivedTaskListArgs
   */
  startLocationCode?: string;

  /**
   * 终点编号
   *
   * @type {string}
   * @memberof IArchivedTaskListArgs
   */
  endLocationCode?: string;

  /**
   * 起点或者终点编号
   *
   * @type {string}
   * @memberof IArchivedTaskListArgs
   */
  anyLocationCode?: string;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof IArchivedTaskListArgs
   */
  materialType?: string;

  /**
   * 物料编号
   *
   * @type {string}
   * @memberof IArchivedTaskListArgs
   */
  materialCode?: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof IArchivedTaskListArgs
   */
  batch?: string;

  /**
   * 巷道Id列表
   *
   * @type {number[]}
   * @memberof IArchivedTaskListArgs
   */
  streetletIdList?: number[];

  /**
   * 任务是否取消
   *
   * @type {(boolean | null)}
   * @memberof IArchivedTaskListArgs
   */
  cancelled?: boolean | null;
}

/**
 * 任务列表的查询参数
 *
 * @export
 * @interface ITaskListArgs
 */
export interface ITaskListArgs {

  /**
   * 任务号
   *
   * @type {string}
   * @memberof ITaskListArgs
   */
  taskCode: string;

  /**
   * 托盘号
   *
   * @type {string}
   * @memberof ITaskListArgs
   */
  palletCode: string;

  /**
   * 任务类型
   *
   * @type {string}
   * @memberof ITaskListArgs
   */
  taskType: string;

  /**
   * 起点编号
   *
   * @type {string}
   * @memberof ITaskListArgs
   */
  startLocationCode: string;

  /**
   * 终点编号
   *
   * @type {string}
   * @memberof ITaskListArgs
   */
  endLocationCode: string;

  /**
   * 起点或者终点编号
   *
   * @type {string}
   * @memberof ITaskListArgs
   */
  anyLocationCode: string;

  /**
   * 物料类型
   *
   * @type {string}
   * @memberof ITaskListArgs
   */
  materialType: string;

  /**
   * 物料编号
   *
   * @type {string}
   * @memberof ITaskListArgs
   */
  materialCode: string;

  /**
   * 批号
   *
   * @type {string}
   * @memberof ITaskListArgs
   */
  batch: string;

  /**
   * 巷道Id列表
   *
   * @type {number[]}
   * @memberof ITaskListArgs
   */
  streetletIdList: number[];
}

/**
 * 任务信息
 *
 * @export
 * @interface ITaskInfo
 */
export interface ITaskInfo {

  /**
   * 任务Id
   *
   * @type {number}
   * @memberof ITaskInfo
   */
  taskId: number;

  /**
   * 任务号
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  taskCode: string;

  /**
   * 任务类型
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  taskType: string;

  /**
   * 托盘号
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  palletCode: string;

  /**
   * 起点
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  startLocationCode: string;

  /**
   * 终点
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  endLocationCode: string;

  /**
   * 任务下发时间
   *
   * @type {Date}
   * @memberof ITaskInfo
   */
  sendTime: Date;

  /**
   * 货载明细
   *
   * @type {IUnitloadItemInfo[]}
   * @memberof ITaskInfo
   */
  items: IUnitloadItemInfo[];

  /**
   * 单号
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  orderCode: string;

  /**
   * 备注
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  comment: string;
}

/**
 * 历史任务信息
 *
 * @export
 * @interface IArchivedTaskInfo
 */
export interface IArchivedTaskInfo {

  /**
   * 任务Id
   *
   * @type {number}
   * @memberof IArchivedTaskInfo
   */
  taskId: number;

  /**
   * 任务号
   *
   * @type {string}
   * @memberof IArchivedTaskInfo
   */
  taskCode: string;

  /**
   * 任务类型
   *
   * @type {string}
   * @memberof IArchivedTaskInfo
   */
  taskType: string;

  /**
   * 托盘号
   *
   * @type {string}
   * @memberof IArchivedTaskInfo
   */
  palletCode: string;

  /**
   * 起点
   *
   * @type {string}
   * @memberof IArchivedTaskInfo
   */
  startLocationCode: string;

  /**
   * 终点
   *
   * @type {string}
   * @memberof IArchivedTaskInfo
   */
  endLocationCode: string;

  /**
   * 任务下发时间
   *
   * @type {Date}
   * @memberof IArchivedTaskInfo
   */
  sendTime: Date;

  /**
   * 货载明细
   *
   * @type {IUnitloadItemInfo[]}
   * @memberof IArchivedTaskInfo
   */
  items: IUnitloadItemInfo[];

  /**
   * Swm 的单号（例如出库单）
   *
   * @type {string}
   * @memberof IArchivedTaskInfo
   */
  orderCode: string;

  /**
   * 备注
   *
   * @type {string}
   * @memberof IArchivedTaskInfo
   */
  comment: string;

  /**
   * 归档时间，也就是任务完成或取消时间
   *
   * @type {Date}
   * @memberof IArchivedTaskInfo
   */
  archivedAt: Date;

  /**
   * 是否取消，true 表示已取消
   *
   * @type {boolean}
   * @memberof IArchivedTaskInfo
   */
  cancelled: boolean;
}


/**
 * 更改货载位置的操作参数
 *
 * @export
 * @interface IChangeUnitloadLocationArgs
 */
export interface IChangeUnitloadLocationArgs {

  /**
   * 要更改位置的托盘号。
   */
  palletCode: string;

  /**
   * 目标货位编码
   *
   * @type {string}
   * @memberof IChangeUnitloadLocationArgs
   */
  destinationLocationCode: string;

  /**
   * 备注
   *
   * @type {string}
   * @memberof IChangeUnitloadLocationArgs
   */
  comment?: string;

}

export interface ICreateManualTaskArgs {
  /**
   * 托盘号
   *
   * @type {string}
   * @memberof ICreateManualTaskArgs
   */
  palletCode: string;

  /**
   * 任务类型
   *
   * @type {string}
   * @memberof ICreateManualTaskArgs
   */
  taskType: string;

  /**
   * 起点
   *
   * @type {string}
   * @memberof ICreateManualTaskArgs
   */
  fromLocationCode: string;

  /**
   * 终点
   *
   * @type {string}
   * @memberof ICreateManualTaskArgs
   */
  toLocationCode: string;
}
