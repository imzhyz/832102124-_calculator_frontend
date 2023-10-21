import { defAxios as request } from "@/utils/http"

export default {
  // 查询最近十条
  listHistoryLastTen() {
    return request({
      url: "/optHistory/listHistoryLastTen",
      method: "get",
    })
  },
  // 添加记录
  insert(data) {
    return request({
      url: "/optHistory/insert",
      method: "post",
      data
    })
  }
}
