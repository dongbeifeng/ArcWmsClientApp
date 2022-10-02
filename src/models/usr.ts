/**
 * 用户列表的查询参数
 *
 * @export
 * @interface IUserListArgs
 */
export interface IUserListArgs {

  /**
   * 用户名
   *
   * @type {(string | null)}
   * @memberof IUserListArgs
   */
  userName?: string;
}

/**
 * 用户信息
 *
 * @export
 * @interface IUserInfo
 */
export interface IUserInfo {

  /**
   * 用户ID
   *
   * @type {string}
   * @memberof IUserInfo
   */
  userId: string;

  /**
   * 用户名
   *
   * @type {string}
   * @memberof IUserInfo
   */
  userName: string;

  /**
   * 是否内置用户
   *
   * @type {boolean}
   * @memberof IUserInfo
   */
  isBuiltIn: boolean;

  /**
   * 所属角色
   *
   * @type {string[]}
   * @memberof IUserInfo
   */
  roles: string[];

  /**
   * 备注
   *
   * @type {string}
   * @memberof IUserInfo
   */
  comment: string;

}

export interface ICreateUserArgs {
  userName: string; // 用户名
  Password: string; // 密码
  roles: string[]; // 角色
}

export interface IEditUserArgs {
  userId: string;
  userName: string; // 用户名，界面上限制用户名字段不给编辑
  roles: string[]; // 角色
}

export interface IRoleListArgs {
  roleName?: string; // 角色名
}

/**
 * 角色信息
 *
 * @export
 * @interface IRoleInfo
 */
export interface IRoleInfo {

  /**
   * 角色Id
   *
   * @type {string}
   * @memberof IRoleInfo
   */
  roleId: string;

  /**
   * 角色名
   *
   * @type {string}
   * @memberof IRoleInfo
   */
  roleName: string;

  /**
   * 是否内置角色，内置角色不能删除
   *
   * @type {boolean}
   * @memberof IRoleInfo
   */
  isBuiltIn: boolean;

  /**
   * 允许的操作
   *
   * @type {string[]}
   * @memberof IRoleInfo
   */
  allowedOpTypes: string[];


  /**
   * 备注
   *
   * @type {string}
   * @memberof IRoleInfo
   */
  comment: string;
}

/**
 * 创建角色的操作参数
 *
 */
export interface ICreateRoleArgs {

  /**
   * 角色名称
   *
   */
  roleName: string;

}


/**
 * 编辑角色的操作参数
 *
 */
 export interface IUpdateRoleArgs {

  roleId: string;
  /**
   * 角色名称
   *
   */
  roleName: string;

}
