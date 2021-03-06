import axios from 'axios'
import { useSelector } from 'react-redux'
import { StoreState } from '../store'

// 无需token
export const staticApi = axios.create({
  baseURL: 'https://api.karshilov.com/',
  transformResponse(data: any) {
    // 对 data 进行任意转换处理
    const parsedData = JSON.parse(data)
    return parsedData
  }
})


// 需要token
export const useApi = () => {
  const { apiToken } = useSelector((state: StoreState) => state, (left: StoreState, right: StoreState) => left.apiToken === right.apiToken)
  return axios.create({
    baseURL: 'https://api.karshilov.com/',
    headers: {
      'x-api-token': apiToken
    },
    transformResponse(data: any) {
      // 对 data 进行任意转换处理
      const parsedData = JSON.parse(data)
      return parsedData
    }
  })
}

export const tmapApi = axios.create({
  baseURL: 'https://apis.map.qq.com/ws/place/v1/',
  transformResponse(data: any) {
    // 对 data 进行任意转换处理
    const parsedData = JSON.parse(data)
    return parsedData
  }
})


export const usePostImg = () => axios.create()

export const apiKey = 'B2EBZ-YEB6Q-WVF55-GBMOS-R5YV7-GGFPE';
