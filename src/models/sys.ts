
/**
 * 系统参数
 *
 * @export
 * @interface IAppSetting
 */
export interface IAppSetting {
  /**
   * 参数名称
   *
   * @type {string}
   * @memberof IAppSetting
   */
  settingName: string;

  /**
   * 参数类型
   *
   * @type {('字符串' | '数字' | '布尔')}
   * @memberof IAppSetting
   */
  settingType: '字符串' | '数字' | '布尔';

  /**
   * 参数值
   *
   * @type {string}
   * @memberof IAppSetting
   */
  settingValue: string;

  /**
   * 备注
   *
   * @type {string}
   * @memberof IAppSetting
   */
  comment: string;
}

/**
 * 编辑系统参数的操作参数
 *
 * @export
 * @interface IUpdateAppSettingArgs
 */
export interface IUpdateAppSettingArgs {

  settingName: string;

  settingType: '字符串' | '数字' | '布尔';

  /**
   * 参数值
   *
   * @type {string}
   * @memberof IUpdateAppSettingArgs
   */
  settingValue: string;
  comment: string;
}


/**
 * 操作记录列表的查询参数
 *
 * @export
 * @interface IOpListArgs
 */
export interface IOpListArgs {

  /**
   * 开始时间
   *
   * @type {Date}
   * @memberof IOpListArgs
   */
  timeFrom?: Date;

  /**
   * 结束时间
   *
   * @type {Date}
   * @memberof IOpListArgs
   */
  timeTo?: Date;

  /**
   * 操作类型
   *
   * @type {string}
   * @memberof IOpListArgs
   */
  operationType?: string;

  /**
   * 操作人
   *
   * @type {string}
   * @memberof IOpListArgs
   */
  user?: string;

}


/**
 * 操作记录信息
 *
 * @export
 * @interface OpListInfo
 */
 export interface IOpListInfo {

  /**
   * 操作记录 Id
   *
   * @type {number}
   * @memberof IOpListInfo
   */
  opId: number;

  /**
   * 创建时间
   *
   * @type {Date}
   * @memberof IOpListInfo
   */
  creationTime: Date;

  /**
   * 操作人
   *
   * @type {string}
   * @memberof IOpListInfo
   */
  creationUser: string;

  /**
   * 操作类型
   *
   * @type {string}
   * @memberof IOpListInfo
   */
  operationType: string;

  /**
   *  产生此记录的 Url
   *
   * @type {string}
   * @memberof IOpListInfo
   */
  url: string;

  /**
   * 备注
   *
   * @type {string}
   * @memberof IOpListInfo
   */
  comment: string;
}
