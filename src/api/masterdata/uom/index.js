import request from '@/utils/request'

export function listUOM (query) {
  return request({
    url: '/masterdata/uom/list',
    method: 'get',
    params: query
  })
}

export function getUOMById (id) {
  return request({
    url: '/masterdata/uom/id/' + id,
    method: 'get'
  })
}

export function getUOMByNumber (number) {
  return request({
    url: '/masterdata/uom/number/' + number,
    method: 'get'
  })
}

export function addUOM (data) {
  return request({
    url: '/masterdata/uom',
    method: 'post',
    data: data
  })
}

export function updateUOM (data) {
  return request({
    url: '/masterdata/uom',
    method: 'put',
    data: data
  })
}

export function deleteUOMByIds (ids) {
  return request({
    url: '/masterdata/uom/' + ids,
    method: 'delete'
  })
}
