export interface LoginRequestData {
  /** admin 或 editor */
  email: string
  /** 密码 */
  passWord: string
  /** 验证码 */
  lang: string
  // code: string
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<any>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
