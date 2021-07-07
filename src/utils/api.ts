import axios from 'axios'
import { useSelector } from 'react-redux'
import { StoreState } from '../store'

// 无需token
export const staticApi = axios.create({
  baseURL: 'http://localhost:3383/',
  transformResponse (data: any) {
    // 对 data 进行任意转换处理
    const parsedData = JSON.parse(data)
    return parsedData
  }
})


// 需要token
export const useApi = () => {
  const { apiToken } = useSelector((state: StoreState) => state, (left:StoreState, right:StoreState) => left.apiToken === right.apiToken)
  return axios.create({
    baseURL: 'http://localhost:3383/',
    headers: {
      'x-api-token': apiToken
    },
    transformResponse (data: any) {
      // 对 data 进行任意转换处理
      const parsedData = JSON.parse(data)
      return parsedData
    }
  })
}

export const usePostImg = () => axios.create()
