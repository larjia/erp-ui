import request from '@/utils/request'

export function listSupplier (query) {
  return request({
    url: '/masterdata/supplier/list',
    method: 'get',
    params: query
  })
}

export function getSupplierById (id) {
  return request({
    url: '/masterdata/supplier/' + id,
    method: 'get'
  })
}

export function addSupplier (data) {
  return request({
    url: '/masterdata/supplier',
    method: 'post',
    data: data
  })
}

export function updateSupplier (data) {
  return request({
    url: '/masterdata/supplier',
    method: 'put',
    data: data
  })
}

export function deleteSupplierById (id) {
  return request({
    url: '/masterdata/supplier/' + id,
    method: 'delete'
  })
}
