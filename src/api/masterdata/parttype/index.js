import request from '@/utils/request'

export function listPartType (query) {
  return request({
    url: '/masterdata/parttype/list',
    method: 'get',
    params: query
  })
}

export function getPartTypeById (id) {
  return request({
    url: '/masterdata/parttype/' + id,
    method: 'get'
  })
}

export function addPartType (data) {
  return request({
    url: '/masterdata/parttype',
    method: 'post',
    data: data
  })
}

export function updatePartType (data) {
  return request({
    url: '/masterdata/parttype',
    method: 'put',
    data: data
  })
}

export function deletePartTypeById (id) {
  return request({
    url: '/masterdata/parttype/' + id,
    method: 'delete'
  })
}
