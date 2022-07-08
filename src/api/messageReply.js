import { axios } from '@/utils/request'

// 查询所有人员消息
export function getMessageDataList (parameter) {
  return axios({
    url: '/patientCenterMessage/getDataList',
    method: 'get',
    params: parameter
  })
}
// 查询当前患者消息
export function getPatientMessageList (patientCenterMessageId) {
  return axios({
    url: '/messageRecords/centerGetMessageRecords/' + patientCenterMessageId,
    method: 'get'
  })
}
// 回复消息消息
export function replyMessageData (params) {
  return axios({
    url: '/patientCenterMessage/centerReplyMessage',
    method: 'post',
    data: params
  })
}
