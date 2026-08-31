import { productApi } from './client'

export function createProduct(token, { name, price, businessId, file }) {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('price', String(price))
  formData.append('businessId', businessId)
  if (file) {
    formData.append('file', file)
  }

  return productApi('/products', {
    token,
    formData,
  })
}

export function fetchMenu(slug) {
  return productApi(`/products/${encodeURIComponent(slug)}`, {
    method: 'GET',
  })
}
