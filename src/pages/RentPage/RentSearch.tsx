import React, { useState, useEffect } from "react";
import { Basement, Layer, Container } from "../../components/BasicHTMLElement";
import { useHistory } from 'react-router-dom';
import { Button, Col, Form, Input, Row, message, Select, Pagination } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { tmapApi, useApi, apiKey } from "../../utils/api";
import { SearchItemModel } from "../../utils/DataModel";
import VirtualList from '../../components/ItemList/VirtualList'
import { city } from '../../utils/city'


const RentSearch = (props: { match: any }) => {
  const routesSearchText = props.match.params.keywords;
  const [searchText, setSearchText] = useState('');
  const [citySelect, setCitySelect] = useState('南京');
  const [totalNum, setTotalNum] = useState(0);
  const [pageAndPageSize, setPageAndPageSize] = useState([1, 20]);
  const [resourceList, setResourceList] = useState<Array<SearchItemModel>>([])
  const api = useApi();

  const getResourceList = async () => {
    const res = await api.get('/rent/search', {
      params: {
        neighbourhood: searchText,
        city: citySelect,
        page_num: pageAndPageSize[0],
        page_size: pageAndPageSize[1],
      }
    })
    if (res.data.success) {
      setResourceList([...res.data.result.list]);
      setTotalNum(res.data.result.total);
    } else {
      message.error(res.data.reason)
    }
  }

  useEffect(() => {
    if (routesSearchText) {
      setCitySelect(routesSearchText.split('@')[0])
      setSearchText(routesSearchText.split('@')[1])
    }
  }, [])

  useEffect(() => {
    getResourceList()
  }, [pageAndPageSize, citySelect])

  return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ width: '65%', background: '#fff', marginBottom: 40, marginTop: 20 }} className="shadow-sm">
      <Input.Group compact style={{ marginTop: 40, marginBottom: 20, marginLeft: 40, height: 40 }}>
        <Select defaultValue="南京" value={citySelect} onChange={(value, option) => { setCitySelect(value) }}>
          {city.map(item => <Select.Option value={item}>{item}</Select.Option>)}
        </Select>
        <Input style={{ width: '50%' }} placeholder="请输入小区名称进行搜索" />
      </Input.Group>
    </div>
    <div style={{ width: '65%', background: '#fff' }} className="shadow-md">
      <VirtualList list={resourceList} />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }} className="m-8">
        <Pagination {...{ defaultCurrent: 1, pageSize: pageAndPageSize[1], total: totalNum, showSizeChanger: false }} responsive onChange={(pg, pgsz) => {
          setPageAndPageSize([pg, pageAndPageSize[1]]);
        }} />
      </div>
    </div>
  </Basement>
}

export default RentSearch;