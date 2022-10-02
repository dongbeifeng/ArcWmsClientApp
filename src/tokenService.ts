
/**
 * 设置访问令牌和刷新令牌
 *
 * @param {string} token 访问令牌
 * @param {number} tokenExpiry 以分钟计算的过期时间，例如，30 表示 30 分钟后过期
 * @param {string} refreshToken 刷新令牌
 */
export function setToken(token: string, tokenExpiry: number, refreshToken: string) {
  localStorage.setItem('token', token);
  // 基于浏览器时间计算的过期时间
  localStorage.setItem('tokenExpirationTime', (Date.now() + (+tokenExpiry * 60 * 1000)).toString());
  localStorage.setItem('refreshToken', refreshToken);
}

/**
 * 清除访问令牌和刷新令牌
 *
 * @export
 */
export function clearToken(){
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpirationTime');
  localStorage.removeItem('refreshToken');
}

/**
 * 获取基于浏览器本地时间的访问令牌过期时间
 *
 * @export
 * @returns
 */
export function getTokenExpirationTime() {
  const v = localStorage.getItem('tokenExpirationTime');
  if (v) {
    return +v;
  }
  return new Date().getTime();
}

/**
 * 获取访问令牌
 *
 * @export
 * @returns
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * 获取刷新令牌
 *
 * @export
 * @returns
 */
export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}
