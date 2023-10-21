import { isNullOrUndef } from "@/utils/is"

export function reqResolve(config) {
  // 防止缓存，给get请求加上时间戳
  if (config.method === "get") {
    config.params = { ...config.params, t: new Date().getTime() }
  }

  return config
}

export function reqReject(error) {
  return Promise.reject(error)
}

export function resResolve(response) {
  return response
}

export function resReject(error) {
  let { code, message } = error.response?.data || {}
  if (isNullOrUndef(code)) {
    // 未知错误
    code = -1
    message = "网络繁忙，请稍后重试！"
  }
  console.error(`【${code}】 ${error}`)
  return Promise.reject({ code, message, error })
}
