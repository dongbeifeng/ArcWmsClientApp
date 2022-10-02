export interface IRequestInfo {
  requestType: string; // 请求类型
  locationCode: string; // 请求位置
  palletCode: string; // 托盘号
  weight: number; // 重量
  height: number; // 高度
  additionalInfo: Record<string, string>; // 附加信息
}

export interface ICompletedTaskInfo {
  taskCode: string; // 任务号
  taskType: string; // 任务类型
  cancelled: boolean; // 是否已取消
  actualEnd: string; // 实际完成位置
  additionalInfo: Record<string, string>;
}
