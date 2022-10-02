/**
 * 表示一条日志记录
 *
 * @export
 * @interface ILogEntry
 */
export interface ILogEntry {
  /**
   * 日志 id
   *
   * @type {number}
   * @memberof ILogEntry
   */
  logId: number;

  /**
   * 日志消息
   *
   * @type {string}
   * @memberof ILogEntry
   */
  message: string;

  /**
   * 消息模板
   *
   * @type {string}
   * @memberof ILogEntry
   */
  messageTemplate: string;

  /**
   * 日志级别
   *
   * @type {string}
   * @memberof ILogEntry
   */
  level: string;

  /**
   * 日志输出时间
   *
   * @type {string}
   * @memberof ILogEntry
   */
  time: string;

  /**
   * 异常
   *
   * @type {string}
   * @memberof ILogEntry
   */
  exception?: string;

  /**
   * 属性
   *
   * @type {string}
   * @memberof ILogEntry
   */
  properties: string;

  /**
   * 请求Id
   *
   * @type {string}
   * @memberof ILogEntry
   */
  requestId: string;

  /**
   * 用户
   *
   * @type {string}
   * @memberof ILogEntry
   */
  userName: string;
}

/**
 * 日志列表的查询参数
 *
 * @export
 * @interface ILogListArgs
 */
export interface ILogListArgs {
  /**
   * 开始时间，必填，默认当前时间减去5分钟
   *
   * @type {Date}
   * @memberof ILogListArgs
   */
  timeFrom: Date;

  /**
   * 取多少秒，默认 10 分钟
   *
   * @type {(number | null)}
   * @memberof ILogListArgs
   */
  seconds: number | null;

  /**
   * 关键字，默认 null
   *
   * @type {string}
   * @memberof ILogListArgs
   */
  keyword: string;

  /**
   * 日志级别，可多选，默认 ['Information', 'Warning', 'Error', 'Fatal']
   *
   * @type {(('Verbose' | 'Debug' | 'Information' | 'Warning' | 'Error' | 'Fatal')[])}
   * @memberof ILogListArgs
   */
  levels: ('Verbose' | 'Debug' | 'Information' | 'Warning' | 'Error' | 'Fatal')[];

  /**
   * 要排除的关键字，多个用逗号隔开, 默认 null
   *
   * @type {string}
   * @memberof ILogListArgs
   */
  excludedKeywords: string;
}




/**
 * 日志跟踪的查询参数
 *
 * @export
 * @interface ITraceLogArgs
 */
export interface ITraceLogArgs {


  /**
   * 请求Id
   *
   * @type {string}
   * @memberof ITraceLogArgs
   */
  requestId: string;

  /**
   * 关键字，默认 null
   *
   * @type {string}
   * @memberof ITraceLogArgs
   */
  keyword: string;

  /**
   * 未使用
   * 要排除的关键字，多个用逗号隔开, 默认 null
   *
   * @type {string}
   * @memberof ITraceLogArgs
   */
  excludedKeywords: string;

  /**
   * 日志级别，可多选，默认 ['Verbose' | 'Debug' | 'Information', 'Warning', 'Error', 'Fatal']
   *
   * @type {(('Verbose' | 'Debug' | 'Information' | 'Warning' | 'Error' | 'Fatal')[])}
   * @memberof ITraceLogArgs
   */
  levels: ('Verbose' | 'Debug' | 'Information' | 'Warning' | 'Error' | 'Fatal')[];

}
