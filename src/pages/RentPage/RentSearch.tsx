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
        title: '整租·今典花园 3室1厅 东北',
        neighborhood: '海淀-小西天-今典花园 ',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
        price: 0,
        create_time: 1
      },
      {
        id: '2',
        title: '整租·金茂逸墅 4室2厅 南/北',
        neighborhood: '大兴-亦庄开发区其它-金茂逸墅 ',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
        price: 0,
        create_time: 1
      },
      {
        id: '3',
        title: '整租·万科紫苑 3房间 东',
        neighborhood: '丰台-青塔-万科紫苑 ',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
        price: 0,
        create_time: 1
      },
      {
        id: '4',
        title: '整租·华贸商务楼 4房间 西',
        neighborhood: '朝阳-红庙-华贸商务楼',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
        price: 0,
        create_time: 1
      },
      {
        id: '5',
        title: '整租·西潞园三里 3室2厅 南/北',
        neighborhood: '房山-良乡-西潞园三里',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
        price: 0,
        create_time: 1
      },
      {
        id: '6',
        title: '整租·正东国际大厦 1室0厅 东/西',
        neighborhood: '东城-东直门-正东国际大厦 ',
        cover: 'http://img.mp.itc.cn/upload/20170226/955e6f01cf4642e9b925f41e60b7bf07_th.jpeg',
        area: '1',
        floor: 1,
        total_floor: 1,
        price: 0,
        create_time: 1
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