/**
 * 巷道列表的查询参数
 *
 * @export
 * @interface IStreetletListArgs
 */
export interface IStreetletListArgs {
  /**
   * 巷道编码。支持模糊查找，使用 ? 表示单个字符，使用 * 表示任意个字符
   *
   * @type {(string | null)}
   * @memberof IStreetletListArgs
   */
  streetletCode: string | null;
}

/**
 * 巷道信息
 *
 * @export
 * @interface IStreetletListItem
 */
export interface IStreetletInfo {
  /**
   * 巷道Id
   *
   * @type {number}
   * @memberof IStreetletListItem
   */
  streetletId: number;

  /**
   * 巷道编码
   *
   * @type {string}
   * @memberof IStreetletListItem
   */
  streetletCode: string;

  /**
   * 是否双深
   *
   * @type {boolean}
   * @memberof IStreetletListItem
   */
  isDoubleDeep: boolean;

  /**
   * 货位总数
   *
   * @type {number}
   * @memberof IStreetletListItem
   */
  totalLocationCount: number;

  /**
   * 可用货位数
   *
   * @type {number}
   * @memberof IStreetletListItem
   */
  availableLocationCount: number;

  /**
   * 货位使用率
   *
   * @type {number}
   * @memberof IStreetletListItem
   */
  usageRate: number;

  /**
   * 货位使用数据
   *
   * @type {IStreetletUsageInfo[]}
   * @memberof IStreetletListItem
   */
  usageInfos: IStreetletUsageInfo[];

  /**
   * 保留货位数
   *
   * @type {number}
   * @memberof IStreetletListItem
   */
  reservedLocationCount: number;

  /**
   * 可到达的出货口
   *
   * @type {{ outletId: number; outletCode: string }[]}
   * @memberof IStreetletListItem
   */
   outlets: { outletId: number; outletCode: string }[];

  /**
   * 是否禁入
   *
   * @type {boolean}
   * @memberof IStreetletListItem
   */
  isInboundDisabled: boolean;

  /**
   * 禁入备注
   *
   * @type {string}
   * @memberof IStreetletListItem
   */
  inboundDisabledComment: string;

  /**
   * 是否禁出
   *
   * @type {boolean}
   * @memberof IStreetletListItem
   */
   isOutboundDisabled: boolean;

   /**
    * 禁出备注
    *
    * @type {string}
    * @memberof IStreetletListItem
    */
   outboundDisabledComment: string;

}


/**
 * 货位使用数据
 *
 * @export
 * @interface IStreetletUsageInfo
 */
export interface IStreetletUsageInfo {

  /**
   * 货位存储分组
   *
   * @type {string}
   * @memberof IStreetletUsageInfo
   */
  storageGroup: string;

  /**
   * 货位规格
   *
   * @type {string}
   * @memberof IStreetletUsageInfo
   */
  specification: string;

  /**
   * 货位限重
   *
   * @type {number}
   * @memberof IStreetletUsageInfo
   */
  weightLimit: number;

  /**
   * 货位限高
   *
   * @type {number}
   * @memberof IStreetletUsageInfo
   */
  heightLimit: number;

  /**
   * 总货位数
   *
   * @type {number}
   * @memberof IStreetletUsageInfo
   */
  total: number;

  /**
   * 当前可用的货位数
   *
   * @type {number}
   * @memberof IStreetletUsageInfo
   */
  available: number;

  /**
   * 当前有货的货位数
   *
   * @type {number}
   * @memberof IStreetletUsageInfo
   */
  loaded: number;

  /**
   * 当前已禁止入站的货位数
   *
   * @type {number}
   * @memberof IStreetletUsageInfo
   */
  inboundDisabled: number;
}

/**
 * 启用或禁用巷道的操作参数
 *
 * @export
 * @interface IEnableStreetletArgs
 */
export interface IEnableStreetletArgs {

  /**
   * 巷道Id
   */
  streetletId?: number;

  /**
   * 启用或禁用巷道的操作备注。必填
   *
   * @type {string}
   * @memberof IEnableStreetletArgs
   */
  comment: string;
}



/**
 * 设置巷道可到达的出货口的操作参数
 *
 * @export
 * @interface ISetOutletsArgs
 */
export interface ISetOutletsArgs {

  /**
   * 巷道Id
   */
   streetletId?: number;

  /**
   * 出货口Id列表
   *
   * @type {number[]}
   * @memberof ISetOutletsArgs
   */
  outletIdList: number[];
}

/**
 * 储位列表的查询参数
 *
 * @export
 * @interface IStorageLocationListArgs
 */
export interface IStorageLocationListArgs {
  /**
   * 货位编码
   *
   * @type {(string | null)}
   * @memberof IStorageLocationListArgs
   */
  locationCode: string | null;

  /**
   * 巷道列表，可多选
   *
   * @type {(number[] | null)}
   * @memberof IStorageLocationListArgs
   */
  streetletIdList: number[] | null;

  /**
   * 货位是否有货
   *
   * @type {boolean}
   * @memberof IStorageLocationListArgs
   */
  isLoaded?: boolean;

  /**
   * 分组
   *
   * @type {(string | null)}
   * @memberof IStorageLocationListArgs
   */
  storageGroup: string | null;

  /**
   * 是否禁止入站
   *
   * @type {boolean}
   * @memberof IStorageLocationListArgs
   */
  isInboundDisabled?: boolean;

  /**
   * 是否禁止出站
   *
   * @type {boolean}
   * @memberof IStorageLocationListArgs
   */
  isOutboundDisabled?: boolean;

  /**
   * 是否有入站任务
   *
   * @type {boolean}
   * @memberof IStorageLocationListArgs
   */
  hasInboundMoves?: boolean;

  /**
   * 是否有出站任务
   *
   * @type {boolean}
   * @memberof IStorageLocationListArgs
   */
  hasOutboundMoves?: boolean;
}

/**
 * 储位信息
 *
 * @export
 * @interface IStorageLocationListItem
 */
export interface IStorageLocationInfo {
  /**
   * 货位 Id
   *
   * @type {number}
   * @memberof IStorageLocationListItem
   */
  locationId: number;

  /**
   * 货位编码
   *
   * @type {string}
   * @memberof IStorageLocationListItem
   */
  locationCode: string;

  /**
   * 巷道 Id
   *
   * @type {number}
   * @memberof IStorageLocationListItem
   */
  streetletId: number;

  /**
   * 巷道编码
   *
   * @type {string}
   * @memberof IStorageLocationListItem
   */
  streetletCode: string;

  /**
   * 限重
   *
   * @type {number}
   * @memberof IStorageLocationListItem
   */
  weightLimit: number;

  /**
   * 限高
   *
   * @type {number}
   * @memberof IStorageLocationListItem
   */
  heightLimit: number;

  /**
   * 入站数
   *
   * @type {number}
   * @memberof IStorageLocationListItem
   */
  inboundCount: number;

  /**
   * 禁止入站
   *
   * @type {boolean}
   * @memberof IStorageLocationListItem
   */
  isInboundDisabled: boolean;

  /**
   * 禁止入站备注
   *
   * @type {string}
   * @memberof IStorageLocationListItem
   */
  inboundDisabledComment: string;

  /**
   * 出站数
   *
   * @type {number}
   * @memberof IStorageLocationListItem
   */
  outboundCount: number;

  /**
   * 禁止出站
   *
   * @type {boolean}
   * @memberof IStorageLocationListItem
   */
  isOutboundDisabled: boolean;

  /**
   * 禁止出站备注
   *
   * @type {string}
   * @memberof IStorageLocationListItem
   */
  outboundDisabledComment: string;

  /**
   * 存储分组
   *
   * @type {string}
   * @memberof IStorageLocationListItem
   */
  storageGroup: string;

  /**
   * 货载数
   *
   * @type {number}
   * @memberof IStorageLocationListItem
   */
  unitloadCount: number;

}

/**
 * 关键点列表的查询参数
 *
 * @export
 * @interface IKeyPointListArgs
 */
export interface IKeyPointListArgs {
  /**
   * 位置编码
   *
   * @type {(string | null)}
   * @memberof IKeyPointListArgs
   */
  locationCode: string | null;

  /**
   * 标记
   *
   * @type {(string | null)}
   * @memberof IKeyPointListArgs
   */
  tag: string | null;

  /**
   * 是否禁止入站
   *
   * @type {(boolean | null)}
   * @memberof IKeyPointListArgs
   */
  isInboundDisabled: boolean | null;

  /**
   * 是否禁止出站
   *
   * @type {(boolean | null)}
   * @memberof IKeyPointListArgs
   */
  isOutboundDisabled: boolean | null;

  /**
   * 是否有入站任务
   *
   * @type {(boolean | null)}
   * @memberof IKeyPointListArgs
   */
  hasInboundMoves: boolean | null;

  /**
   * 是否有出站任务
   *
   * @type {(boolean | null)}
   * @memberof IKeyPointListArgs
   */
  hasOutboundMoves: boolean | null;
}

/**
 * 关键点信息
 *
 * @export
 * @interface IKeyPointInfo
 */
export interface IKeyPointInfo {
  /**
   * 货位Id
   *
   * @type {number}
   * @memberof IKeyPointInfo
   */
  locationId: number;

  /**
   * 货位编码
   *
   * @type {string}
   * @memberof IKeyPointInfo
   */
  locationCode: string;

  /**
   * 入站任务数
   *
   * @type {number}
   * @memberof IKeyPointInfo
   */
  inboundCount: number;

  /**
   * 是否禁止入站
   *
   * @type {boolean}
   * @memberof IKeyPointInfo
   */
  isInboundDisabled: boolean;

  /**
   * 禁止入站备注
   *
   * @type {string}
   * @memberof IKeyPointInfo
   */
  inboundDisabledComment: string;

  /**
   * 入站数限制
   *
   * @type {number}
   * @memberof IKeyPointInfo
   */
  inboundLimit: number;

  /**
   * 出站任务数
   *
   * @type {number}
   * @memberof IKeyPointInfo
   */
  outboundCount: number;

  /**
   * 是否禁止出站
   *
   * @type {boolean}
   * @memberof IKeyPointInfo
   */
  isOutboundDisabled: boolean;

  /**
   * 禁止出站备注
   *
   * @type {string}
   * @memberof IKeyPointInfo
   */
  outboundDisabledComment: string;

  /**
   * 出站数限制
   *
   * @type {number}
   * @memberof IKeyPointInfo
   */
  outboundLimit: number;

  /**
   * 标记
   *
   * @type {string}
   * @memberof IKeyPointInfo
   */
  tag: string;

  /**
   * 请求类型
   *
   * @type {(string | null)}
   * @memberof IKeyPointInfo
   */
  requestType: string | null;

  /**
   * 货载数
   *
   * @type {number}
   * @memberof IKeyPointInfo
   */
  unitloadCount: number; // 货载数
}


/**
 * 启用或禁用位置的操作参数
 *
 * @export
 * @interface IEnableLocationArgs
 */
 export interface IEnableLocationArgs {

  /**
   * 要启用或禁用的位置 Id 列表
   *
   * @type {number[]}
   * @memberof IEnableLocationArgs
   */
  locationIds: number[];


  /**
   *  操作备注
   *
   * @type {string}
   * @memberof IEnableLocationArgs
   */
  comment?: string;
}



/**
 * 设置存储分组的操作参数
 *
 * @export
 * @interface ISetStorageGroupArgs
 */
export interface ISetStorageGroupArgs {

  /**
   * 要设置存储分组的位置 Id 列表
   *
   * @type {number[]}
   * @memberof IDisableLocationArgs
   */
  locationIds: number[];

  /**
   * 存储分组
   *
   * @type {string}
   * @memberof ISetStorageGroupArgs
   */
  storageGroup: string;
}

/**
 * 设置货位限高的操作参数
 *
 * @export
 * @interface IHeightLimitArgs
 */
export interface ISetHeightLimitArgs {

  /**
 * 要设置限高的位置 Id 列表
 *
 * @type {number[]}
 * @memberof IDisableLocationArgs
 */
  locationIds: number[];

  /**
   * 限高
   *
   * @type {number}
   * @memberof ISetHeightLimitArgs
   */
  heightLimit: number;
}

/**
 * 设置货位限重的操作参数
 *
 * @export
 * @interface IHeightLimitArgs
 */
export interface ISetWeightLimitArgs {

  /**
 * 要设置限重的位置 Id 列表
 *
 * @type {number[]}
 * @memberof IDisableLocationArgs
 */
  locationIds: number[];

  /**
   * 限重
   *
   * @type {number}
   * @memberof ISetWeightLimitArgs
   */
  weightLimit: number;
}

/**
 *  创建和编辑关键点的操作参数
 *
 * @export
 * @interface ICreateUpdateKeyPointArgs
 */
export interface ICreateUpdateKeyPointArgs {

  /**
   * 货位编号
   *
   * @type {string}
   * @memberof ICreateUpdateKeyPointArgs
   */
  locationCode: string;

  /**
   * 请求类型
   *
   * @type {(string | null)}
   * @memberof ICreateUpdateKeyPointArgs
   */
  requestType: string | null;

  /**
   * 标记
   *
   * @type {(string | null)}
   * @memberof ICreateUpdateKeyPointArgs
   */
  tag: string | null;

  /**
   * 最大入站数，1 - 999
   *
   * @type {number}
   * @memberof ICreateUpdateKeyPointArgs
   */
  inboundLimit: number;

  /**
   * 最大出站数，1 - 999
   *
   * @type {number}
   * @memberof ICreateUpdateKeyPointArgs
   */
  outboundLimit: number;
}

/**
 * 出货口列表的查询参数
 *
 * @export
 * @interface IOutletListArgs
 */
export interface IOutletListArgs {

  /**
   * 出货口编码
   *
   * @type {(string | null)}
   * @memberof IOutletListArgs
   */
  outletCode: string | null;
}

export interface ICreateOutletArgs {


  /**
   * 出货口编码
   *
   * @type {string}
   * @memberof ICreateOutletArgs
   */
   outletCode: string;

   /**
    * 出货口的关键点1，不为 null
    *
    * @type {string}
    * @memberof ICreateOutletArgs
    */
   kP1: string;

   /**
    * 出货口的关键点2，可能为 null
    *
    * @type {string}
    * @memberof ICreateOutletArgs
    */
   kP2?: string;

   /**
    * 备注
    */
   comment?: string;
}

/**
 * OutletInfo
 *
 * @export
 * @interface IOutletInfo
 */
export interface IOutletInfo {

  /**
   * 出货口Id
   *
   * @type {number}
   * @memberof IOutletInfo
   */
  outletId: number;

  /**
   * 出货口编码
   *
   * @type {string}
   * @memberof IOutletInfo
   */
  outletCode: string;

  /**
   * 出货口的关键点1，不为 null
   *
   * @type {string}
   * @memberof IOutletInfo
   */
  kP1: string;

  /**
   * 出货口的关键点2，可能为 null
   *
   * @type {string}
   * @memberof IOutletInfo
   */
  kP2?: string;

  /**
   * 可到达此出货口的巷道
   *
   * @type {string[]}
   * @memberof IOutletInfo
   */
  streetlets: string[];

  /**
   * CurrentUat
   *
   * @type {string}
   * @memberof IOutletInfo
   */
  currentUat: string;

  /**
   * 最近一次为此出货口调度下架的时间
   *
   * @type {Date}
   * @memberof IOutletInfo
   */
   lastCheckTime: Date;

  /**
   * 最近一次为此出货口调度下架的消息
   *
   * @type {string}
   * @memberof IOutletInfo
   */
  checkMessage: string;


}


/**
 * 侧视图货位数据
 */
export interface ISideViewLocation {
  /**
   * 货位Id
   */
  locationId?: number;
  /**
   * 货位编码
   */
  locationCode: string;
  /**
   * 是否有货
   */
  isLoaded?: boolean;

  /**
   * 货位在左侧还是右侧
   *
   * @type {('Left' | 'Right')}
   * @memberof SideViewLocation
   */
  side: 'Left' | 'Right';

  /**
   * 货架是第几深位
   */
  deep: number;
  /**
   * 所在层
   */
  level: number;
  /**
   * 所在列
   */
  bay: number;
  /**
   * 是否禁止入站
   */
  isInboundDisabled: boolean;
  /**
   * 禁止入站备注
   */
  inboundDisabledComment?: string;
  /**
   * 入站数
   */
  inboundCount: number;
  /**
   * 入站限制
   */
  inboundLimit: number;
  /**
   * 是否禁止出站
   */
  isOutboundDisabled: boolean;
  /**
   * 禁止出站备注
   */
  outboundDisabledComment?: string;
  /**
   * 出站限制
   */
  outboundLimit: number;
  /**
   * 出站数
   */
  outboundCount: number;
  /**
   * 货位规格
   */
  specification?: string;
  /**
   * 存储分组
   */
  storageGroup: string;
  /**
   * 限重
   */
  weightLimit?: number;
  /**
   * 限高
   */
  heightLimit?: number;
  /**
   * 货位是否存在
   */
  exists?: boolean;
  /**
   * 入次序1
   */
  i1?: number;
  /**
   * 出次序1
   */
  o1?: number;
  /**
   * 入次序2
   */
  i2?: number;
  /**
   * 出次序2
   */
  o2?: number;
  /**
   * 入次序3
   */
  i3?: number;
  /**
   * 出次序3
   */
  o3?: number;
  /**
   * 是否选中
   */
  selected?: bigint;
}


/**
 * 侧视图数据。
 */
export interface ISideViewData {
  /**
   * 巷道编码
   */
  streetletCode?: string;
  /**
   * 巷道是否禁入
   */
  isInboundDisabled?: boolean;

 /**
   * 巷道是否禁出
   */
  isOutboundDisabled?: boolean;

  /**
   * 巷道的货位数，不包含 Swm.Model.Location.Exists 为 false 的货位。
   */
  locationCount?: number;
  /**
   * 巷道的可用货位数，即存在、无货、无入站任务、未禁止入站的货位
   */
  availableCount?: number;
  /**
   * 巷道的货位，包含 Swm.Model.Location.Exists 为 false 的货位。
   */
  locations: ISideViewLocation[];
  /**
   * 巷道禁入的备注
   */
  inboundDisabledComment?: string;

  /**
   * 巷道禁出的备注
   */
  outboundDisabledComment?: string;
}
