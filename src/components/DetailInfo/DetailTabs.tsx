import React, { useState, useEffect, useRef } from 'react'
import { Basement, Container } from '../../components/BasicHTMLElement'
import { RentDetailModel } from '../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../utils/api'
import ContentContainer from '../../components/DetailInfo/ContentContainer'
import { detailOptions } from '../../utils/DetailOptions'
import HouseInfo from './Panels/HouseInfo'
import HouseDesc from './Panels/HouseDesc'
import HousePay from './Panels/HousePay'
const { Text, Title, Paragraph } = Typography;

const DetailTabs = (props: { data: RentDetailModel }) => {
  const { data } = props;
  const [currentKey, setCurrentKey] = useState('house-info')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current;
    if (container) {
      // setInterval(() => {
      //   console.log(container.scrollHeight, container.scrollTop, container.clientHeight)
      // }, 10)
    }
  }, [])

  return <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
    <div style={{ background: '#F3F4F6', display: 'flex', flexDirection: 'row', width: '100%', marginInline: '40px' }} ref={ref}>
      {detailOptions.map((item) => <div
        key={item.key}
        style={{ display: 'flex', flexDirection: 'column' }}
        className="p-1 m-3" onClick={() => { setCurrentKey(item.key) }}>
        <label style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.label}</label>
        <div style={{ height: 3, width: '100%', background: '#00896c', borderRadius: 1, marginTop: 10 }} hidden={item.key !== currentKey}></div>
      </div>)}
    </div>
    <Divider />
    <HouseInfo data={data} />
    <HouseDesc data={data} />
    <HousePay data={data} />
  </div>
}

export default DetailTabs;