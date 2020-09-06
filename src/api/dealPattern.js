import request from '@/utils/request'

const DealPatternApi = {
  SelectAllByPatternStatus: '/api/dealPattern/selectAllByPatternStatus',
  SelectByPatternId: '/api/dealPattern/selectByPatternId',
  Insert: '/api/dealPattern/insert',
  UpdateByPatternId: '/api/dealPattern/updateByPatternId',
  DeleteByPatternId: '/api/dealPattern/deleteByPatternId',
  RecoveryByPatternId: '/api/dealPattern/recoveryByPatternId'
}

export function selectAllByPatternStatus (parameter) {
  return request({
    url: DealPatternApi.selectAllByPatternStatus,
    method: 'get',
    params: parameter
  })
}

export function selectByPatternId (parameter) {
  return request({
    url: DealPatternApi.SelectByPatternId,
    method: 'get',
    params: parameter
  })
}

export function insert (parameter) {
  return request({
    url: DealPatternApi.Insert,
    method: 'post',
    data: parameter
  })
}

export function updateByPatternId (parameter) {
  return request({
    url: DealPatternApi.UpdateByPatternId,
    method: 'post',
    data: parameter
  })
}

export function deleteByPatternId (parameter) {
  return request({
    url: DealPatternApi.DeleteByPatternId,
    method: 'post',
    data: parameter
  })
}

export function recoveryByPatternId (parameter) {
  return request({
    url: DealPatternApi.RecoveryByPatternId,
    method: 'post',
    data: parameter
  })
}
