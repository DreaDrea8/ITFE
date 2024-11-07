export interface metadataInterface {
  page?: number
  per_page?: number
  total_page?: number
  offset?: number
  limit?: number
  total_count?: number
  sort_by?: string
  order_by?: 'ASC' | 'DESC'
}

export type jsonContent = {
  message: string
  metadata?: metadaInterface
  data: unknown
  error: unknown
}
