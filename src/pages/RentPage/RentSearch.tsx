import React, { useState, useEffect } from "react";
import { Basement, Layer, Container } from "../../components/BasicHTMLElement";
import { useHistory } from 'react-router-dom';
import { Button, Col, Form, Input, Row, Tabs, Steps, message } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { tmapApi, useApi, apiKey } from "../../utils/api";
import { SearchItemModel } from "../../utils/DataModel";
import VirtualList from '../../components/ItemList/VirtualList'

type Task<T = unknown> = () => Promise<T>

function createTaskQueue(max = 10) {
  let active = 0
  const pending: (() => void)[] = []

  function doWork() {
    if (pending.length > 0) {
      const cur = pending.shift();
      if (cur) cur();
    }
    else active--
  }

  return function enqueue<T>(task: Task<T>) {
    return new Promise<T>((res, rej) => {
      pending.push(() => {
        active++
        task().then(res, rej).then(doWork)
      })
      if (active < max) doWork()
    })
  }
}


const RentSearch = (props: { match: any }) => {
  const routesSearchText = props.match.params.keywords;
  const [searchText, setSearchText] = useState('');
  const [provinceSelect, setProvinceSelect] = useState('');
  const [citySelect, setCitySelect] = useState('');
  const [totalNum, setTotalNum] = useState(0);
  const [pageAndPageSize] = useState([1, 40]);
  const [resourceList, setResourceList] = useState<Array<SearchItemModel>>([])
  const api = useApi();

  const enqueue = createTaskQueue(10)

  const resolveUrl = (id: string) => {
    return (res: any) => {
      setResourceList(resourceList.map(item => {
        if (item.id === id) {
          return {
            ...item,
            cover: res.data.result
          }
        }
        return item;
      }))
    }
  }

  const createTask = (name: string, id: string) => () => api.get('/minio', { params: { type: 'house', name } }).then(resolveUrl(id));


  const getResourceList = async () => {
    const res = await api.get('/rent/search', {
      params: {
        neighborhood: searchText === '' ? routesSearchText.neighborhood : searchText,
        city: provinceSelect === '' ? routesSearchText.city : (provinceSelect + citySelect),
        page_num: pageAndPageSize[0],
        page_size: pageAndPageSize[1],
      }
    })
    if (res.data.success) {
      setResourceList([...resourceList, ...res.data.result.list]);
      setTotalNum(res.data.result.total);
      res.data.result.list.forEach((item: any) => {
        enqueue(createTask(item.cover, item.id))
      })
    } else {
      message.error(res.data.reason)
    }
  }

  useEffect(() => {
    // getResourceList()
    setResourceList([
      {
        id: '1',
        title: '1',
        neighborhood: '1',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
      },
      {
        id: '2',
        title: '1',
        neighborhood: '1',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
      },
      {
        id: '3',
        title: '1',
        neighborhood: '1',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
      },
      {
        id: '4',
        title: '1',
        neighborhood: '1',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
      },
      {
        id: '5',
        title: '1',
        neighborhood: '1',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
      },
      {
        id: '6',
        title: '1',
        neighborhood: '1',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
      }
    ])
  }, [])

  return <Basement style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '65%', background: '#fff' }}>
      <VirtualList list={resourceList} />
    </div>
  </Basement>
}

export default RentSearch;